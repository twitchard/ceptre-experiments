import { h, Component } from 'preact'
import RockPaperScissors from './RockPaperScissors'

import io from 'socket.io-client'

export default class App extends Component {
    componentWillMount() {
        const socket = io('http://localhost:3000')
        this.setState({...this.state, socket})
        socket.on('connect', () => {
            console.log('connected')
        })
    }
    register () {
        this.state.socket.emit('register')
        this.setState({...this.state, registering: true})
        this.state.socket.on('registered', player => {
            console.log(player)
            this.setState({...this.state, registering: false, player})
        })
        this.state.socket.on('reset', () => {
            this.setState({...this.state, player: null})
        })
        this.state.socket.on('ceptreEvent', (event) => {
            if (event.event === 'prompt') {
                console.log(event)
                this.setState({...this.state, transitions: event.transitions, context: event.context})
            }
            if (event.event === 'rule'
                && (event.content.command.rulename === 'win'
                    || event.content.command.rulename === 'draw')) {
                this.setState({...this.state, lastPlay: event.content})
            }
        })
    }
    reset () {
        this.state.socket.emit('reset')
    }
    render ({}, {socket, player, lastPlay, transitions, context}) {
        if (!socket) {
            return <h1>Connecting...</h1>
        }
        const ResetButton = () =>
            <button
                onClick = {this.reset.bind(this)}
            >
                Reset
            </button>

        if (!player) {
            return (
                <div>
                    <button
                        onClick = {this.register.bind(this)}
                        disabled = {this.state.registering}
                    >
                        Register
                    </button>
                    <ResetButton />
                </div>
            )
        }
        return <div>
            <h1>You are player {player}</h1>
            <RockPaperScissors
                player={player}
                transitions={transitions}
                fireAction={(n) => this.state.socket.emit('selection', `${n}`)}
                lastPlay={lastPlay}
                context={context}
            />
        </div>
    }
}
