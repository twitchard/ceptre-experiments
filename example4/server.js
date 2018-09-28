const socketio = require('socket.io')
const express  = require('express')
const http = require('http')
const rockPaperScissorsProgram = require('fs').readFileSync(__dirname + '/rock_paper_scissors.cep')
const { executeCeptre } = require('./ceptre.js')
const { Duplex } = require('stream')

const PORT = 3000

async function main () {
    const app = express()
    const server = http.Server(app)
    const io = socketio(server)
    app.use((req, res, next) => {
        return next()
    })

    app.use(express.static('client/dist'))

    const game = {
        async startGame (io, player1, player2) {
            let b = Buffer.from('')

            const ceptre = await executeCeptre(rockPaperScissorsProgram)

            player1.on('selection', selection => {
                ceptre.input.write(selection)
                ceptre.input.write("\n")
            })

            player2.on('selection', selection => {
                ceptre.input.write(selection)
                ceptre.input.write("\n")
            })

            for await (const event of ceptre.eventStream()) {
                console.log(event)
                io.emit('ceptreEvent', event)
            }
        }

    }

    const registration = handleRegistration(io, game.startGame.bind(game, io))
    io.on('connection', socket => registration(socket))

    server.listen(PORT)
}

function handleRegistration (io, callback) {
    let player1
    let player2
    return socket => {
        socket.on('reset', () => {
            player1 = null
            player2 = null
            io.emit('reset')
        })
        socket.on('register', id => {
            if (!player1) {
                player1 = socket
                return socket.emit('registered', 'player1')
            }
            if (!player2) {
                player2 = socket
                socket.emit('registered', 'player2')
                return callback(player1, player2)
            }
            return socket.emit('err', 'The game was full!')
        })
    }
}

main().catch(console.error)
