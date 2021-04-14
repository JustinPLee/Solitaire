/*
			TODO LIST
				CONVERT TEMPLATE TO CLASS
				ADD DIFFERENT COLORED/STYLE BACKS TO THE CARDS
				ADD ANIMATION FUNCTIONS FOR
					- SHUFFLING
					- DRAWING OUT THE CARDS (TOP-DOWN-VIEW OR RIGHT-VIEW)
					- CARDS FLIPPING OVER AND REVEALING A BACK SIMILAR TO FIND THE PAIRS
					- HAVING A HAND OF CARDS
					- DRAWING A CARD FROM THE DECK
					- SEARCHING THROUGH THE DECK
				CREATE A STACK OF CARDS FOR THE DECK


		*/
const utils = {
	last: (arr, plus = 0) => arr[arr.length - 1 + plus],
	lastIndex: arr => arr.length - 1,
	shuffle(arr) {
		for(let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	},
	push(arr, value, indexNumFromStart = 1) {
		for(let i = 0; i < indexNumFromStart; i++){
			arr.push(value[i]);
		}
		return arr;
	},
	unshift(arr, value, indexNumFromStart = 1) {
		for(let i = 0; i < indexNumFromStart; i++){
			arr.unshift(value[i]);
		}
		return arr;
	},
	remove(arr, iterations = 1, backwards = false){
		for(let i = 0; i < iterations; i++){
			backwards ? arr.pop() : arr.shift();
		}
		return arr;
	},
	findDuplicates(array) {
		return [...new Set(array)]
	},
	countDuplicates() {

	},
	removeDuplicates: arr => arr.filter((x, pos) => arr.indexOf(x) === pos),
	removeDuplicatesWithArray: (arr1, arr2) =>  arr1.filter(x => !arr2.includes(x)),
	removeNonDuplicatesWithArray: (arr1, arr2) =>  arr1.filter(x => arr2.includes(x)),
	concat(arr, value) {
		arr = arr.concat(value);
		return arr;
	},
	pushUntilArr(arr, iterations = 1, backwards = false){
		if(backwards){
			arr = arr.reverse();
		}
		let result = [];
		for(let i = 0; i < iterations; i++){
			result.push(arr[i]);
		}
		return result;
	},
	randomArr(arr, iterations = 1, remove = false){
		if(remove) {
			return this.remove(arr, this.pushUntilArr(this.shuffle(arr), iterations))
		} else {
			return this.pushUntilArr(this.shuffle(arr), iterations);
		}
	}
}//end utils



class Game {
	constructor({
		include = [],
		exclude = []
	}) {
		this.stored = {};
		this.siftList = [];
		this.list = [];
		this.exclude = exclude;
		this.colorSuits = [
			'red-heart',
			'red-diamond',
			'black-spade',
			'black-clover'
		],
		this.allElements = [];
		this.colors = ['red', 'black'],
		this.faces = ['ace', 'two', 'three', 'four', 'five', 'six',
		'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
		this.include = include;
	}
}
/*
class Hand extends Game {
	constructor({
		include = [],
		exclude = []
	}) {
		super({
			include,
			exclude
		});
	}
} */

/* Helpers */

class Deck extends Game {
	constructor({
		include = [],
		exclude = [],
		render,
		direction = 'forwards',
		cardClass,
		flipStatus,
		shuffle = false,
		template = false,
		hidden = false,
		overlay = false,
	} = {}) {
		super({
			include,
			exclude
		});
		this.parent = render;
		this.flipStatus = flipStatus;
		this.direction = direction;
		this.lastResult = this;
		this.hidden = hidden;
		this.cardClass = cardClass;
		if(template){
			return this;
		}
		this.generate(this.parent);
		this.addFlip();
		if(flipStatus.desiredFace) {
			this.flipAll({
				desiredFace: flipStatus.desiredFace
			});
		}
		if(shuffle) {
			this.shuffle({
				parentId: render
			});
		}
		if(this.hidden){
			this.hide('all');
		}
		if(overlay){
			this.overlayCards(this.cardClass, {starting: overlay[0], increment: overlay[1]});
		}
		this.stored.cardsInDeck = this.list;
		this.stored.all = this.list;
	}
	overlayCards(cardClass = this.cardClass, {starting = 0, increment = 30} = {}, index = 0) {
		if(!document.getElementsByClassName(cardClass)[index]){
			return this;
		} else {
			document.getElementsByClassName(cardClass)[index].style.marginTop = `${starting}px`;
			index += 1;
			starting += increment;
			this.overlayCards(cardClass, {starting, increment}, index);
		}
	}
	overlayCardsLeft(cardClass = this.cardClass, {starting = 0, increment = 10} = {}, index = 0) {
		if(!document.getElementsByClassName(cardClass)[index]){
			return this;
		} else {
			document.getElementsByClassName(cardClass)[index].style.marginLeft = `${starting}px`;
			index += 1;
			starting += increment;
			this.overlayCardsLeft(cardClass, {starting, increment}, index);
		}
	}
	getTitle(face, suit) {
		return `${face[0].toUpperCase()}${face.substring(1, face.length)} of ${this.getSuit(suit)}`;
	}
	getSuit(name) {
		let suitUpper = name.substring(name.indexOf('-') + 1, name.length)
			[0].toUpperCase();
		return `${suitUpper}${name.substring(name.indexOf('-') + 2, name.length)}s`;
	}
	generate(idName) {
		const pushColor = (name, face, faceIndex) => {
			this.colors.forEach(color => {
				if(name.substr(0, name.indexOf('-')) === color) {
					this.list.push({
						class: this.cardClass,
						src: `assets/cards-${name}-${face}.png`,
						face,
						color,
						value: faceIndex,
						suit: name.substring(name.indexOf(
							'-') + 1, name.length),
						key: `${name.substring(name.indexOf('-') + 1, name.length)}${face}`,
						flipStatus: {
							src: `assets/cards-${this.flipStatus.color}-deck.png`,
							canBeFlipped: true,
							isFaceUp: this.flipStatus.desiredFace ?
								(
									`is${this.flipStatus.desiredFace}` ===
									'isFaceUp' ?
									true : false
								) : true,
							isFaceDown: this.flipStatus
								.desiredFace ?
								(
									`is${this.flipStatus.desiredFace}` ===
									'isFaceDown' ?
									true : false
								) : false
						}
					});
				}
			});
		}
		this.colorSuits.forEach(name => {
			this.faces.forEach(face => pushColor(name, face, this.faces
				.indexOf(face) + 1));
		});
		this.colors.forEach(color => {
			if(Array.isArray(this.include)) {
				this.include.forEach(include => {
					this.list.push({
						src: `assets/cards-${color}-${include}.png`,
						color,
						suit: color,
						face: include,
						key: `${color}${include}`,
						flipStatus: {
							src: include ===
								'deck' ?
								`assets/cards-${color}-${include}.png` :
								`assets/cards-${this.flipStatus.color}-deck.png`,
							canBeFlipped: include ===
								'deck' ? false : true,
							isFaceUp: this.flipStatus
								.desiredFace ?
								(
									`is${this.flipStatus.desiredFace}` ===
									'isFaceUp' ?
									true : false
								) :
								true,
							isFaceDown: this.flipStatus
								.desiredFace ?
								(
									`is${this.flipStatus.desiredFace}` ===
									'isFaceDown' ?
									true : false
								) :
								false
						}
					});
				});
			} else {
				this.list.push({
					class: this.cardClass,
					src: `assets/cards-${color}-${this.include}.png`,
					color,
					suit: color,
					face: this.include,
					key: `${color}${this.include}`,
					flipStatus: {
						src: this.include === 'deck' ?
							`assets/cards-${color}-${this.include}.png` :
							`assets/cards-${this.flipStatus.color}-deck.png`,
						canBeFlipped: this.include ===
							'deck' ? false : true,
						isFaceUp: this.flipStatus.desiredFace ?
							(
								`is${this.flipStatus.desiredFace}` ===
								'isFaceUp' ?
								true : false
							) : true,
						isFaceDown: this.flipStatus.desiredFace ?
							(
								`is${this.flipStatus.desiredFace}` ===
								'isFaceDown' ?
								true : false
							) : false
					}
				});
			}
		});
		console.log(this.list);
		this.renderHtml();
		return this.list;
	}
	emptyHtml(idName) {
		[...document.getElementById(idName).childNodes].forEach(x => {
			x.remove();
		})
		return idName;
	}
	remove(key, cardClass = this.cardClass, originalParent = this.parent) {
		const check = (checker) => {
			if(checker === null || checker === undefined){
				throw new Error(`checker is ${checker}`)
			}
			if(!(checker.parentNode === document.querySelector(originalParent))){
				console.log(checker, checker.parentNode);
				throw new Error(`@remove originalParent parameter is not a parent ${originalParent}`);
			}
		}
		if(Array.isArray(key) && !key[0]){
			let elements = this.findElementFromKey(key, cardClass);
			elements.forEach(x => {
				check(this.findElementFromKey(x, cardClass));
				x.parentNode.removeChild(x);
			});
		} else if(key[0] && key[0].key){
			key.forEach(x => {
				check(this.findElementFromKey(x.key, cardClass));
				this.findElementFromKey(x.key, cardClass)
				.parentNode.removeChild(this.findElementFromKey(x.key, cardClass));
			});
		} else {
			if(Array.isArray(key)){
				key.forEach(x => {
					check(this.findElementFromKey(x, cardClass));
					this.findElementFromKey(x, cardClass)
					.parentNode.removeChild(this.findElementFromKey(x, cardClass));
				});
			} else {
				check(this.findElementFromKey(key, cardClass));
				this.findElementFromKey(key, cardClass).parentNode
				.removeChild(this.findElementFromKey(key, cardClass));
			}
		}
		return this;
	}
	renderHtml(className = this.cardClass, parent = this.parent) {
		const render = (listName) => {
			if(this.exclude.includes(listName.key)) return;
			let container = document.getElementById(parent);
			let element = document.createElement('img');
			element.classList.add(className);
			element.setAttribute('data-key', `${listName.suit}${listName.face}`);
			listName.flipStatus.isFaceUp ? element.src = listName.src
				: element.src = listName.flipStatus.src;
			container.appendChild(element);
		}
		if(this.direction === 'forwards'){
			this.list.forEach(x => {
				render(x);
			});
		} else if(this.direction === 'backwards'){
			for(let i = this.list.length - 1; i >= 0; i--){
				render(this.list[i]);
			}
		}
		this.allElements = document.getElementById(this.parent).childNodes;
		return this;

	}
	renderCards(cardList, className = this.cardClass, parent = this.parent, direction = 'forwards') {
		const render = (listName) => {
			if(!listName[0] && typeof listName !== 'object'){
				listName = this.findObjectFromElement(listName);
			}
			if(this.exclude.includes(listName.key)) return;
			let element = document.createElement('img');
			let container = document.getElementById(parent);
			element.classList.add(className);
			element.setAttribute('data-key', `${listName.suit}${listName.face}`);
			listName.flipStatus.isFaceUp ? element.src = listName.src
				: element.src = listName.flipStatus.src;
			listName.class = className;
			container.appendChild(element);
		}
		if(direction === 'forwards'){
			cardList.forEach(x => {
				this.list.push(x);
				render(x);
			});
		} else if(direction === 'backwards'){
			cardList.forEach(x => {
				this.list.push(x);
			});
			for(let i = cardList.length - 1; i >= 0; i--){
				render(cardList[i]);
			}
		}
		this.allElements = document.getElementById(this.parent).childNodes;
		return this;

	}
	renderHtmlFromAllElements() {
		document.getElementById(this.parent).childNodes = this.allElements;
		return this;
	}
	findKeyFromElement(element) {
		return element.getAttribute('data-key');
	}
	findObjectFromKey(key) {
		let result = [];
		if(Array.isArray(key)) {
			key.forEach(y => result = result.concat(
				this.list.filter(x => x.key == y))
			);
			result.map(x => x = x[0]);
			return result;
		} else {
			result = result.concat(this.list.filter(x => x.key == key));
			result.map(x => x = x[0]);
			return result[0];
		}
	}
	findObjectFromElement(element) {
		return this.findObjectFromKey(this.findKeyFromElement(element));
	}
	//TODO: ADD INCLUDE FUNCTIONALITY
	shuffle({
		parentId = this.parent,
		include = []
	} = {}) {
		const parent = document.getElementById(parentId);
		let children = [...parent.children];
		const shuffled = utils.shuffle(children);
		this.allElements = shuffled;
		parent.innerHTML = '';
		shuffled.map(x => parent.appendChild(x));
		return shuffled;
	}
	parentAppend(array) {
		const parent = document.getElementById(this.parent);
		parent.innerHTML = '';
		array.map(x => parent.appendChild(x));
		return this;
	}
	addFlip({
		exclude = ['reddeck', 'blackdeck'],
		cardClass = this.cardClass
	} = {}) {
		let finalList = cardClass;
		exclude.forEach(x => {
			if(!this.findObjectFromKey(x)) {
				return false;
			}
			const notTemplate = `:not([data-key=${x}])`;
			finalList += notTemplate;
			this.findObjectFromKey(x).canBeFlipped = false;
		});
		[...document.querySelectorAll(finalList)].forEach(element => {
			element.addEventListener('click', e => {
				this.flip({
					key: this.findKeyFromElement(e.target)
				});
			});
		});
		return this;
	}
	handleFlip(e) {
		e.target ? this.handleFlipFunction(e.target)
			: this.handleFlipFunction(e);
		return this;
	}
	handleFlipFunction(e) {
		const flip = (obj, element = e) => {
			const e = element;
			if(!obj.flipStatus.canBeFlipped) return false;
			if(obj.flipStatus.isFaceDown) {
				e.src = obj.src;
				obj.flipStatus.isFaceUp = true;
				obj.flipStatus.isFaceDown = false;
			} else if(obj.flipStatus.isFaceUp) {
				e.src = obj.flipStatus.src;
				obj.flipStatus.isFaceUp = false;
				obj.flipStatus.isFaceDown = true;
			}
		}
		if(typeof e == 'string') {
			flip(this.findObjectFromKey(e), this.findElementFromKey(e));
		} else {
			flip(this.findObjectFromElement(e));
		}
		return this;
	}
	flip({
		key,
		addFlip = false
	}) {
		if(addFlip) {
			this.addFlip(addFlip.color, addFlip.exclude);
		}
		this.handleFlipFunction(key);
		return this;
	}
	flipAll({
		list = this.list,
		addFlip = false,
		desiredFace,
		except = null,
	}) {
		const changeSrc = ({
			newSrcCtx = undefined,
			isFaceUp,
			isFaceDown
		}) => {
			for(let i = 0; i < list.length; i++){
				const x = list[i];
				if(except === 'last'){
					except = utils.lastIndex(list);
				}
				if(list.indexOf(x) === except){
					continue;
				}
				const element = this.findElementFromKey(x.key);
				newSrcCtx ? element.src = x[newSrcCtx]['src'] : element.src = x.src;
				x.flipStatus.isFaceDown = isFaceDown;
				x.flipStatus.isFaceUp = isFaceUp;
			};
		}
		if(addFlip) {
			this.addFlip({
				exclude: addFlip['exclude']
			});
		}
		if(desiredFace === 'FaceDown') {
			changeSrc({
				newSrcCtx: 'flipStatus',
				isFaceUp: false,
				isFaceDown: true
			})
		} else if(desiredFace === 'FaceUp') {
			changeSrc({
				isFaceUp: true,
				isFaceDown: false
			});
		}
	}
	findElementFromKey(key, cardClass = this.cardClass) {
		const result = [];
		if(typeof key === 'object'){
			key = key.key;
		}
		if(Array.isArray(key)) {
			key.forEach(keya => {
				[...document.querySelectorAll(`.${cardClass}[data-key=${keya}]`)].forEach(x => {
					result.push(x);
				});
			});
			return result;
		} else {
			return document.querySelector(`.${cardClass}[data-key=${key}`);
		}
	}
	sift(term, termVal, {
		arr = undefined,
		ctx = undefined,
		prop = undefined
	} = {}) {
		arr = this.list;
		//beginning term
		const checkTerm = (array) => {
			let propList = [];
			if(prop){
				ctx ? array.filter(x => x[ctx][term] === termVal).map(x => propList.push(x[prop]))
				: array.filter(x => x[term] === termVal).map(x => propList.push(x[prop]));
				return propList;
			} else {
				return ctx ? array.filter(x => x[ctx][term] === termVal)
				: array.filter(x => x[term] === termVal);
			}
		}
		this.siftList = checkTerm(arr);
		this.lastResult = this.siftList;
		return this;
	}
	endSift(term = null, termVal = null, storing = false, {
		arr = undefined,
		ctx = undefined,
		prop = undefined,
		is = false
	} = {}) {
		arr = this.list;
		if(!is){
			this.sift(term, termVal,
				{
					arr,
					ctx,
					prop
				}
			);
		} else {
			this.is(term, termVal,
				{
					arr,
					ctx
				}
			)
		}
		if(term === 'key'){
			this.siftList = this.siftList[0];
		}
		if(storing){
			return this;
		} else {
			return this.siftList;
		}
	}
	end() {
		return this.siftList;
	}
	is(term, termVal, {
		arr = undefined,
		ctx = undefined,
	} = {}) {
		arr = this.list;
		this.siftList = ctx ? arr.filter(x => x[ctx][term] !== termVal) : arr.filter(x => x[term] !== termVal);
		this.lastResult = this.siftList;
		return this;
	}
	hide(key) {
		if(key === 'all'){
			[...document.getElementById(this.parent).childNodes]
				.forEach(x => x.classList.add('card-hidden'));
				return this;
		}
		const htmlElementHide = param => {
			if(Array.isArray(this.findElementFromKey(param))) {
				this.findElementFromKey(param).forEach(x => {
					x.classList.add('card-hidden');
				});
			} else {
				if(!this.findElementFromKey(param)) {
					return false
				};
				this.findElementFromKey(param).classList.add('card-hidden');
			}
		}
		if(Array.isArray(key)) {
			if(!key[0].key){
				htmlElementHide(key);
			} else {
				let keyList = [];
				key.forEach(x => keyList.push(x.key));
				htmlElementHide(keyList);
			}
		} else {
			htmlElementHide(key);
		}
		this.lastResult = key;
		return this;
	}
	show(key) {
		if(key === 'all'){
			[...document.getElementById(this.parent).childNodes]
				.forEach(x => x.classList.remove('card-hidden'));
				return this;
		}
		function htmlElementShow(param) {
			this.findElementFromKey(param).forEach(x => {
				x.classList.remove('card-hidden');
			});
		}
		let keyList = [];
		if(typeof key[0] !== 'string') {
			key.map(x => keyList.push(x.key));
			htmlElementShow(keyList);
		} else {
			htmlElementShow(key);
		}
		return this;
	}
	store({
		element = undefined, 
		key = undefined, 
		term,
		lastResult = true,
		replace = false
	}) {
		if(term && !this.stored[term]) {
			this.stored[term] = [];
		}
		if(!element && !key && !lastResult){
			throw new Error('store must have an element or key');
		}
		const replacer = (result) => {
			if(replace){
				this.stored[term] = result;
			} else {
				this.stored[term] = this.stored[term].concat(result);
			}
		}
		if(!element && key){
			replacer(key);
		} else if(!key && element){
			replacer(element);
		} else if(!element && !key && last){
			if(Array.isArray(this.lastResult)){
				replacer(this.lastResult);
			}
		} else {
			throw new Error('?');
		}
		return this.stored[term];
	}
	move({
		from,
		to,
		all = false
	}, cb) {
		if(!to instanceof Deck && !typeof to === 'string'){
			throw new Error('{to} in move must be an instance of Deck class or classname');
		} else if(typeof to === 'string'){
			to = to.split(' ');
			if(all){
			   this.renderCards(this.list, to[0], to[1]);
			   this.remove(this.list, to[0], to[2]);
			} else {
				this.renderCards(this.stored[from], to[0], to[1]);
				this.remove(this.stored[from], to[0], to[2]);
				this.overlayCards(to[0]);
			}
		} else if(all){
				to.renderCards(this.list);
				this.remove(this.list);
				this.overlayCards();
				to.overlayCards();
		} else {
			to.addToList(this.stored[from]);
			to.renderCards(this.stored[from]);
			this.remove(this.stored[from]);
			to.overlayCards();
		}
		if(cb) {
			if(to[0]){
				cb.call(this, to[0], to[1]);
			} else {
				cb.call(to);
			}
		}
		this.overlayCards();
		return this;
	}
	moveHtml({
		storedElementsTerm = null,
		storedElements = null,
		overlay = false,
		originalParent,
		newParent,
		cardClass,
	}) {
		originalParent = document.querySelector(originalParent);
		newParent = document.querySelector(newParent);
		const moveAll = () => {
			const children = originalParent.childNodes;
			this.empty(originalParent);
			newParent.appendChild(children);
			[...newParent.childNodes].forEach(x => {
				x.classList.add(cardClass);
			});
		};
		function render(elements) {
			if(elements.length > 0){
				elements.forEach(element => {
					originalParent.removeChild(element);
					element.classList.add(cardClass);
					newParent.appendChild(element);
				});
			} else {
				originalParent.removeChild(elements);
				elements.classList.add(cardClass);
				newParent.appendChild(elements);
			}
		};
		if(!storedElements && !storedElementsTerm){
			moveAll();
		} else if(storedElementsTerm){
			let neW = this.stored[storedElementsTerm].slice();
			let nEw = [];
			neW.forEach(x => {
				nEw.push(this.findElementFromKey(x.key));
			});
			render(nEw);
		} else if(storedElements){
			render(storedElements);
		}
		if(overlay){
			this.overlayCards(cardClass);
		}
		return this;
	}
	addToList(originalcontent) {
		if(Array.isArray(originalcontent)){
			originalcontent.forEach(x => this.list.push(x));
		} else {
			this.list.push(originalcontent);
		}
	}
	getList() {
		return this.list
	}
	findElementFromObject(term) {
		return this.findElementFromKey(term.key);
	}
	storage(term, replace, {html = false} = {}) {
		if(!replace){
			replace = this.stored[term];
		} else {
			this.stored[term] = replace;
		}
		if(term === '*'){
			return this.stored;
		}
		return this.stored[term];
	}
	findAllFaceUpObject() {
		return this.list.filter(x => x.flipStatus.isFaceUp);
	}
	findAllFaceUpElement() {
		if(this.findAllFaceUpObject().length < 2){
			return this.findElementFromObject(this.findAllFaceUpObject());
		} else {
			let result = [];
			this.findAllFaceUpObject().forEach(x => {
				result.push(this.findElementFromObject(x));
			});
			return result;
		}
	}
	findAllFaceDownObject() {
		return this.list.filter(x => x.flipStatus.isFaceDown);
	}
	findAllFaceDownElement() {
		if(this.findAllFaceDownObject().length < 2){
			return this.findElementFromObject(this.findAllFaceDownObject());
		} else {
			let result = [];
			this.findAllFaceDownObject().forEach(x => {
				result.push(this.findElementFromObject(x));
			});
			return result;
		}
	}
}
const deck = new Deck({
	render: 'deck-container',
	direction: 'backwards',
	cardClass: 'card',
	flipStatus: {
		desiredFace: 'FaceUp',
		color: 'red'
	}
});

const setUpBoard = () => {
	let cardsInDeck = deck.storage('cardsInDeck');
	for(let i = 1; i < 8; i++){
		const random = utils.randomArr(cardsInDeck, i);
		deck.store({element: random, term: `column${i}`});
		cardsInDeck = utils.removeDuplicatesWithArray(cardsInDeck, random);
		deck.moveHtml(
			{
				storedElementsTerm: `column${i}`,
				originalParent: '#deck-container',
				newParent: `#card-column${i}`,
				cardClass: `card${i}`,
				overlay: true
			}
		);
		deck.storage('cardsInDeck', cardsInDeck);
		deck.flipAll({list: deck.storage(`column${i}`), desiredFace: 'FaceDown', except: 'last'});
	}
	deck.flipAll({list: deck.storage(`cardsInDeck`), desiredFace: 'FaceDown'});
	console.log(deck.findAllFaceUpElement());
	deck.shuffle('deck-container');
};
setUpBoard();
function deckToTrash(e) {
	if(utils.lastIndex([...document.getElementById('deck-container').childNodes]) === -1
		|| e.target.parentNode !== document.getElementById('deck-container'
		|| document.getElementById('deck-container').childNodes.length === 0)){
		return false;
	} else {
		deck.moveHtml(
			{
				storedElements: [e.target],
				originalParent: '#deck-container',
				newParent: `#deck-container-trash`,
				cardClass: `card-trash`,
			}
		);
		deck.overlayCardsLeft('card-trash');
		deck.flip({key: deck.findKeyFromElement(e.target)});
		trashToColumn();
		//trashToAce();
	}
	function trashToColumn() {
		[...document.getElementsByClassName('card-trash')].forEach(card => {
			if(utils.last([...document.getElementsByClassName('card-trash')]) === card){
				card.addEventListener('click', autoColumn, true);
			}
			function autoColumn() {
				if(utils.last([...document.getElementsByClassName('card-trash')]) !== card){
					return false;
				}
				function checkLastColumn() {
					const trash = deck.findObjectFromElement(card);
					const columns = deck.storage('*');
					let alllast = [];
					let columnlastgroup = [];
					for(const [keys, values] of Object.entries(columns)){
						if(keys.includes('column')){
							columnlastgroup = utils.last(values);
							if(columnlastgroup.length > 1){
								columnlastgroup.forEach(x => {
									alllast.push(
										{
											value: x.value,
											color: x.color,
											columnnum: keys.substring(6, 7),
											columnkey: keys,
											key: x.key
										}
									);
								});
							} else {
								const x = columnlastgroup;
									alllast.push(
										{
											value: x.value,
											color: x.color,
											columnnum: keys.substring(6, 7),
											columnkey: keys,
											key: x.key
										}
									);
							}
						}
					}
					alllast.forEach(x => {
						if(trash.value + 1 === x.value && trash.color !== x.color){
							deck.moveHtml(
								{
									storedElements: [card],
									originalParent: '#deck-container-trash',
									newParent: `#card-${x.columnkey}`,
									cardClass: `card${x.columnnum}`,
								}
							);
							deck.overlayCards(`card${x.columnnum}`);
							card.classList.remove('card-trash');
							card.style.marginLeft = '0px';
						}
					});
					
				}
				checkLastColumn();
			}
		});
	}

}
function columnToColumn(e) {
	const columnName = parent => parent.substring(11, 12);
	const lastObj = deck.findObjectFromElement(e.target);
	if(e.target.parentNode.childNodes.length !== 1){
		deck.flip({key: deck.findKeyFromElement(utils.last([...e.target.parentNode.childNodes], -1))});
	}
	checkColumn(e);
	function checkColumn(e) {
		const columns = deck.storage('*');
		let alllast = [];
		for(const [keys, values] of Object.entries(columns)){
			if(keys.includes('column')){
				columnlastgroup = utils.last(values);
				if(columnlastgroup.length > 1){
					columnlastgroup.forEach(x => {
						alllast.push(
							{
								value: x.value,
								color: x.color,
								columnnum: keys.substring(6, 7),
								columnkey: keys,
								key: x.key
							}
						);
					});
				} else {
					const x = columnlastgroup;
						alllast.push(
							{
								value: x.value,
								color: x.color,
								columnnum: keys.substring(6, 7),
								columnkey: keys,
								key: x.key
							}
						);
				}
			}
		}
		alllast.forEach(x => {
			if(x.value === deck.findObjectFromElement(e.target).value + 1 && x.color
				!== deck.findObjectFromElement(e.target).color){
				deck.moveHtml(
					{
						storedElements: [e.target],
						originalParent: `#${e.target.parentNode.id}`,
						newParent: `#card-${x.columnkey}`,
						cardClass: `card${x.columnnum}`,
					}
				);
				e.target.style.margin = '0px';
				deck.overlayCards(`card${x.columnnum}`);
				[...e.target.classList].forEach(x => {
					if(x.match(/^card[0-9]/)){
						e.target.classList.remove(x);
					}
				});
				e.target.classList.add(`card${x.columnnum}`);
			} else {
				console.log(x, deck.findObjectFromElement(e.target));
			}
		})
	}
}
/*
const checkTopCard = deckTopCard => {
	column.last.value() = deck[0].value - 1 && deck[0].color !== colum.last.color
};

*/

window.onload = () => {
	//todo: remove node that went to trash from stored['cardsInDeck']
	[...document.getElementById('deck-container').childNodes].map(x => x.addEventListener('click', deckToTrash));
	[...document.getElementsByClassName('card-column')].map(x => [...x.childNodes]
		.map(y => y.addEventListener('click', columnToColumn)));
}
document.getElementById('cards-reload').addEventListener('click', () => {
	window.location.reload();
})
//elementnode.nextElementSibling;