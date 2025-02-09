import CARDS from '../../cards'

function* followUpSaga(game, turnAction, derivedState) {
	turnAction.payload = turnAction.payload || {}
	if (!turnAction.playerId) return

	const {currentPlayer} = derivedState
	const followUpPlayer = game.state.players[turnAction.playerId]
	if (!followUpPlayer) return 'INVALID'

	const {followUp} = followUpPlayer
	if (!followUp) return 'INVALID'

	const followUpResult = game.hooks.followUp.call(turnAction, {
		...derivedState,
		followUp,
	})

	if (followUpResult === 'INVALID') {
		return 'INVALID'
	} else if (followUpResult === 'DONE') {
		followUpPlayer.followUp = null
		return 'DONE'
	} else if (followUpResult) {
		followUpPlayer.followUp = null
		currentPlayer.followUp = followUpResult
		return 'NEXT'
	}
	console.log('Followup not implemented: ', followUp)
	followUpPlayer.followUp = null
	return 'INVALID'
}

export default followUpSaga
