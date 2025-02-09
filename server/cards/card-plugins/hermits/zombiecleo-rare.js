import HermitCard from './_hermit-card'
import {flipCoin} from '../../../utils'
import CARDS from '../../../cards'

class ZombieCleoRareHermitCard extends HermitCard {
	constructor() {
		super({
			id: 'zombiecleo_rare',
			name: 'Cleo',
			rarity: 'rare',
			hermitType: 'pvp',
			health: 290,
			primary: {
				name: 'Dismissed',
				cost: ['pvp'],
				damage: 60,
				power: null,
			},
			secondary: {
				name: 'Puppetry',
				cost: ['pvp', 'pvp', 'pvp'],
				damage: 0,
				power: 'Player uses a move from any of their AFK Hermits.',
			},
		})
	}

	register(game) {
		game.hooks.attack.tap(this.id, (target, turnAction, derivedState) => {
			const {
				attackerHermitCard,
				typeAction,
				playerActiveRow,
				opponentActiveRow,
			} = derivedState

			if (typeAction !== 'SECONDARY_ATTACK') return target
			if (!target.isActive) return target
			if (attackerHermitCard.cardId !== this.id) return target

			// uhmm, yeah...

			return target
		})
	}
}

export default ZombieCleoRareHermitCard
