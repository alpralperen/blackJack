let deck = [];
const suits = ['♠️', '♣️', '♥️', '♦️'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let playerHand = [];
let dealerHand = [];

let playerTotalWin = 0;
let dealerTotalWin= 0;

let playerWin = document.getElementById('playerWin');
let dealerWin = document.getElementById('dealerWin');

const playerHandElement = document.getElementById('player-hand').querySelector('.cards');
const dealerHandElement = document.getElementById('dealer-hand').querySelector('.cards');
const playerValueElement = document.getElementById('player-value');
const dealerValueElement = document.getElementById('dealer-value');
const messageElement = document.getElementById('message');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value: value, suit: suit });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard() {
    return deck.pop();
}

function calculateHandValue(hand){
    let value = 0;
    let aceCount = 0;
    for(let card of hand){
        if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            value += 10;
        } else if (card.value === 'A') {
            value += 11;
            aceCount++;
        } else {
            value += parseInt(card.value);
        }
    }
    while(value > 21 && aceCount > 0){
        value -= 10;
        aceCount--;
    }
    return value;
}

function updateHandDisplay(hand, handElement){
    handElement.innerHTML = '';
    hand.forEach(card => {
        let cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.value}${card.suit}`;
        handElement.appendChild(cardElement);
    });
}

function startGame(){
    createDeck();
    shuffleDeck();
    
    playerHand = [dealCard(), dealCard()];
    dealerHand = [dealCard(), dealCard()];

    updateHandDisplay(playerHand, playerHandElement);
    updateHandDisplay(dealerHand, dealerHandElement);

    playerValueElement.textContent = calculateHandValue(playerHand);
    dealerValueElement.textContent = calculateHandValue(dealerHand);

    messageElement.textContent = '';
    hitButton.disabled = false;
    standButton.disabled = false;
}

function playerTurn(){
    let playerValue = calculateHandValue(playerHand);
    if(playerValue > 21){
        dealerTotalWin++; 
        playerWin.innerHTML = 'Player: ' + playerTotalWin;
        dealerWin.innerHTML = 'Dealer: ' + dealerTotalWin;
        messageElement.textContent = 'Oyuncu battı! Krupiye kazandı.';
        hitButton.disabled = true;
        standButton.disabled = true;
        return;
    }

    let action = prompt ("Kart çekmek ister misiniz (c) yoksa durmak mı (d)?");
    if (action.toLowerCase() === 'c') {
        playerHand.push(dealCard());
        updateHandDisplay(playerHand, playerHandElement);
        playerValueElement.textContent = calculateHandValue(playerHand);
        playerTurn();
    } else if (action.toLowerCase() === 'd') {
        dealerTurn();
    }
}

function dealerTurn() {
    let dealerValue = calculateHandValue(dealerHand);
    while (dealerValue < 17) {
        dealerHand.push(dealCard());
        dealerValue = calculateHandValue(dealerHand);
    }
    
    updateHandDisplay(dealerHand, dealerHandElement);
    dealerValueElement.textContent = dealerValue;

    determineWinner();
}

function determineWinner() {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    if (dealerValue > 21 || playerValue > dealerValue) {
        messageElement.textContent = 'Oyuncu kazandı!';
        playerTotalWin++; 
        playerWin.innerHTML = 'Player: ' + playerTotalWin;
        dealerWin.innerHTML = 'Dealer: ' + dealerTotalWin;
    } else if (playerValue < dealerValue) {
        messageElement.textContent = 'Krupiye kazandı!';
        dealerTotalWin++; 
        playerWin.innerHTML = 'Player: ' + playerTotalWin;
        dealerWin.innerHTML = 'Dealer: ' + dealerTotalWin;
    } else {
        messageElement.textContent = 'Berabere!';
        playerWin.innerHTML = 'Player: ' + playerTotalWin;
        dealerWin.innerHTML = 'Dealer: ' + dealerTotalWin;
    }

    hitButton.disabled = true;
    standButton.disabled = true;
}

document.getElementById('start-game').addEventListener('click', startGame);
hitButton.addEventListener('click', () => {
    playerHand.push(dealCard());
    updateHandDisplay(playerHand, playerHandElement);
    playerValueElement.textContent = calculateHandValue(playerHand);
    if (calculateHandValue(playerHand) > 21) {
        messageElement.textContent = 'Oyuncu battı! Krupiye kazandı.';
        hitButton.disabled = true;
        standButton.disabled = true;
    }
});
standButton.addEventListener('click', dealerTurn);
