import io from 'socket.io-client'
import { render, h } from 'preact'

import App from './App'

render(<App />, document.body)






// const id = Date.now()
// const socket = io('http://localhost:3000')
// 
// const root = document.getElementById('root')
// const warning = document.createElement('div')
// const playerNumber = document.createElement('h1')
// const setPlayerNumber = n => playerNumber.innerHTML = `player number ${n}`
// root.appendChild(warning)
// root.appendChild(playerNumber)
// 
// 
// 
// 
// function register (id) {
//     return new Promise(resolve => {
//         socket.emit('register', id)
//         socket.once('registered', p => {
//             return resolve(p)
//         })
//     })
// }
// 
// let registered = false
// socket.on('connect', () => {
//     if (!registered) {
//         register(id).then(player => {
//             setPlayerNumber(player)
//             registered = true
//             socket.on('ceptreEvent', e => {
//                 console.log('evented')
//                 console.log(e)
//             })
//         })
//     }
//     socket.on('err', err => {
//         warning.innerHTML = err
//     })
// })
