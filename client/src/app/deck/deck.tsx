import classnames from 'classnames'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {CardInfoT} from 'types/cards'
import {CardT} from 'types/game-state'
import CardList from 'components/card-list'
import CARDS from 'server/cards'
import {validateDeck} from 'server/utils'
import css from './deck.module.css'
import {getPlayerDeck} from 'logic/session/session-selectors'
import {unmountComponentAtNode} from 'react-dom'

const TYPED_CARDS = CARDS as Record<string, CardInfoT>

const TYPE_ORDER = {
	hermit: 0,
	effect: 1,
	single_use: 2,
	item: 3,
	health: 4,
}

const sortCards = (cards: Array<CardT>): Array<CardT> => {
	return cards.slice().sort((a: CardT, b: CardT) => {
		const cardInfoA = TYPED_CARDS[a.cardId]
		const cardInfoB = TYPED_CARDS[b.cardId]
		if (cardInfoA.type !== cardInfoB.type) {
			return TYPE_ORDER[cardInfoA.type] - TYPE_ORDER[cardInfoB.type]
		} else if (
			cardInfoA.type === 'hermit' &&
			cardInfoB.type === 'hermit' &&
			cardInfoA.hermitType !== cardInfoB.hermitType
		) {
			return cardInfoA.hermitType.localeCompare(cardInfoB.hermitType)
		}
		return cardInfoA.name.localeCompare(cardInfoB.name)
	})
}

type Props = {
	setMenuSection: (section: string) => void
}
const Deck = ({setMenuSection}: Props) => {
	const dispatch = useDispatch()
	const playerDeck = useSelector(getPlayerDeck)
	const [pickedCards, setPickedCards] = useState<CardT[]>(
		playerDeck.map((cardId) => ({
			cardId: cardId,
			cardInstance: Math.random().toString(),
		}))
	)

	const [saveDeckName, setSaveDeckName] = useState<string>('')

	const commonCards = pickedCards.filter(
		(card) => TYPED_CARDS[card.cardId].rarity === 'common'
	)
	const rareCards = pickedCards.filter(
		(card) => TYPED_CARDS[card.cardId].rarity === 'rare'
	)
	const ultraRareCards = pickedCards.filter(
		(card) => TYPED_CARDS[card.cardId].rarity === 'ultra_rare'
	)

	const validationMessage = validateDeck(pickedCards.map((card) => card.cardId))

	const addCard = (card: CardT) => {
		setPickedCards((pickedCards) => {
			return [
				...pickedCards,
				{cardId: card.cardId, cardInstance: Math.random().toString()},
			]
		})
	}
	const removeCard = (card: CardT) => {
		setPickedCards((pickedCards) =>
			pickedCards.filter(
				(pickedCard) => pickedCard.cardInstance !== card.cardInstance
			)
		)
	}
	const backToMenu = () => {
		dispatch({
			type: 'UPDATE_DECK',
			payload: pickedCards.map((card) => card.cardId),
		})
		setMenuSection('mainmenu')
	}

	const clearDeck = () => {
		setPickedCards([])
	}
	
	const loadDeck = (loadDeckName: string) => {		
		if (localStorage.getItem('Loadout_' + loadDeckName) != null) {
			setPickedCards(JSON.parse(localStorage.getItem('Loadout_' + loadDeckName)!));
		}
	}

	const loadAllDecks = () => {
		const storageKeys = Object.keys(localStorage);
		let deckSelection = document.getElementById("loadDeckSelection");
		deckSelection?.childNodes.forEach(child => {
			child.remove(); //does not work... there is probably a react way that is using what ever...
		});
		
		let defaultOption = document.createElement("option");
		defaultOption.value = "default";
		defaultOption.innerHTML = "select deck";
		deckSelection?.appendChild(defaultOption);

		storageKeys.forEach(key => {
			if (0 === key.indexOf("Loadout_")) {
				let deckOption = document.createElement("option");
				deckOption.innerHTML = key.replace("Loadout_", "");
				deckSelection?.appendChild(deckOption);
			}
		});
	}

	const saveDeck = () => {
		localStorage.setItem('Loadout_' + saveDeckName, JSON.stringify(pickedCards));
		console.log(JSON.stringify(pickedCards));
		loadAllDecks();
	}
	
	useEffect(() => {
		loadAllDecks();	
	}, []);

	const allCards = Object.values(TYPED_CARDS).map(
		(card: CardInfoT): CardT => ({
			cardId: card.id,
			cardInstance: card.id,
		})
	)

	const sortedAllCards = sortCards(allCards)
	const sortedDeckCards = sortCards(pickedCards)

	return (
		<div className={css.deck}>
			<div className={css.header}>
				<button disabled={!!validationMessage} onClick={backToMenu}>
					Back to menu
				</button>
				<div className={css.limits}>{validationMessage}</div>
				<div className={css.dynamicSpace} />
				<button onClick={clearDeck}>Clear</button>
				<div>
					<input
						maxLength={25}
						name="saveDeckName"
						placeholder="Deck Name..."
						onBlur={(e) => {
							setSaveDeckName(e.target.value)
						}}
					/>
					<button type="button" onClick={saveDeck}>
						Save
					</button>
					<select
						id="loadDeckSelection"
						title="select Deck"
						defaultValue={"default"}
						onChange={e => loadDeck(e.target.value)}>
					</select>
				</div>
			</div>
			<div className={css.cards}>
				<div className={classnames(css.cardColumn, css.allCards)}>
					<div className={css.cardsTitle}>All cards</div>
					<CardList
						cards={sortedAllCards}
						onClick={addCard}
						size="small"
						wrap={true}
					/>
				</div>
				<div className={classnames(css.cardColumn, css.selectedCards)}>
					<div className={css.cardsTitle}>
						<span>Your deck ({pickedCards.length})</span>
						<span> - </span>
						<span className={css.commonAmount} title="Common">
							{commonCards.length}
						</span>
						<span> </span>
						<span className={css.rareAmount} title="Rare">
							{rareCards.length}
						</span>
						<span> </span>
						<span className={css.ultraRareAmount} title="Ultra rare">
							{ultraRareCards.length}
						</span>
					</div>
					<CardList
						cards={sortedDeckCards}
						onClick={removeCard}
						size="small"
						wrap={true}
					/>
				</div>
			</div>
		</div>
	)
}

export default Deck
