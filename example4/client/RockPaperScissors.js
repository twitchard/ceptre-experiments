import { h, Component } from 'preact'


function renderContext(context) {
    return JSON.stringify(context)
}

function readNumber (pred) {
    if (pred === "zero") {
        return 0
    }
    return 1 + readNumber(pred.args[0])
}

function score (player, context) {
    let me
    let them
    let draws

    if (!context) return {me: 0, them: 0, draws: 0}
    context
        .filter(x => x.predicate === 'victories')
        .map(x => {
            if (x.args[0] === player) {
                me = readNumber(x.args[1])
            } else {
                them = readNumber(x.args[1])
            }
        })

    context
        .filter(x => x.predicate === 'draws')
        .map(x => draws = readNumber(x.args[0]))

    return {me, them, draws}

}

function otherPlayerHasMoved (player, context) {
    return context
        .filter(x => x.predicate === 'selected'
                     && x.args[0] !== player)
        .length > 0
}

function actionButtons(fireAction, player, transitions) {
    const available =
        transitions
            .filter(x => x.choice !== null)
            .filter(x => x.choice.terms.length > 0 && x.choice.terms[0] === player)

    return (
        available
            .map(x =>
                <button onClick={()=>fireAction(x.n)}>
                    {x.choice.rule}
                </button>
            )
    )
}

function interpretLastPlay (player, lastPlay) {
    if (!lastPlay) return
    if (lastPlay.command.rulename === 'draw') {
        return <div>It was a draw. You both played {lastPlay.command.args[1]}</div>
    }

    if (lastPlay.command.args[0] === player) {
        return <div>The other player played {lastPlay.command.args[1]} to your {lastPlay.command.args[3]}. You lose.</div>
    }
    return <div>The other player played {lastPlay.command.args[1]} to your {lastPlay.command.args[3]}. You win.</div>
}

export default class RockPaperScissors extends Component {
    render ({player, transitions, context, lastPlay, fireAction}, {}) {
        const {me, them, draws} = score(player, context)

        return (
            <div>
                <div>
                    Wins: {me}
                </div>
                <div>
                    Losses: {them}
                </div>
                <div>
                    Draws: {draws}
                </div>
                <div>
                    { otherPlayerHasMoved(player, context) && <span>The other player has moved</span> }
                </div>
                    { interpretLastPlay(player, lastPlay) }
                <div>
                    {
                        actionButtons(fireAction, player, transitions)
                    }
                </div>
                <hr/>
                <div>
                    {
                        renderContext(context)
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
