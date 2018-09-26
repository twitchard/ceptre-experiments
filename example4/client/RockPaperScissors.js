import { h, Component } from 'preact'


function renderContext(context) {
    return JSON.stringify(context)
}
function actionButtons(fireAction, player, transitions) {
    return (
        transitions
            .filter(x => x.choice !== null)
            .filter(x => x.choice.terms.length > 0 && x.choice.terms[0] === player)
            .map(x =>
                <button onClick={()=>fireAction(x.n)}>
                    {x.choice.rule}
                </button>
            )
    )
}
export default class RockPaperScissors extends Component {
    render ({player, transitions, context, fireAction}, {}) {
        return (
            <div>
                <span>{ `You are player ${player}` }</span>
                <div>
                    {
                        renderContext(context)
                    }
                </div>
                <div>
                    {
                        actionButtons(fireAction, player, transitions)
                    }
                </div>
            </div>
        )
    }
}

    //state = { player: "", scores: [], choices: [] };
    //setPlayer = p => this.setState({...this.state, player: p})
    //handlePrompt = prompt => {
    //    console.log(prompt)
    //    this.setState()
    //};
    //render({ }, {player, scores, choices}) {
    //    return <h1>hello</h1>
    //}
