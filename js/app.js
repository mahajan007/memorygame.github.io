/*
 * Create a list that holds all of your cards
 */

let cardTypes = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];

let openCards = []; //list storing currently uncovered cards
let matchedCards = []; //list storing the figures that were matched already
let score = 3; //current score
let counter = 0;
let FirstClick = true;
let currentTypes = [];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 //Timer for the game 
var timer = setInterval(countTimer, 1000);
var totalSeconds = 0;
function countTimer() {
   ++totalSeconds;
   var hour = Math.floor(totalSeconds /3600);
   var minute = Math.floor((totalSeconds - hour*3600)/60);
   var seconds = totalSeconds - (hour*3600 + minute*60);

   document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}

function resetTimer() {
	clearInterval(timer);
	totalSeconds = 0;
	timer = setInterval(countTimer, 1000);
}

 function newGame() {
 	let cards = $('.card');
 	cards.removeClass('match open show'); //hides all images

 	let newCardTypes = shuffle(cardTypes);

 	currentTypes = cards.children('i');
 	currentTypes.removeClass('fa-diamond fa-paper-plane-o fa-anchor fa-bolt fa-cube fa-leaf fa-bicycle fa-bomb');
 	currentTypes.each( function(index, item) {
 		$(item).addClass(newCardTypes[index]); //assign re-shuffled classes to the cards
 	});
 	//reset global variables and counter
 	openCards = []; 
 	matchedCards = [];
 	score = 3;
 	counter = 0;
 	FirstClick = true;
 	$('.moves').text(0);
 	$('.fa-star').css('color','#000');
 	clearInterval(timer);
 }

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function showSymbol(card) {
	card.addClass('open show');
}

function hideSymbol(card) {
	card.removeClass('open show');
}

function keepOpenOnMatch(card) {
	card.addClass('match');
	card.removeClass('open show');
}

function showWinnigMessage() {
	let modalWin = $('#winner');
	let hours = Math.floor(totalSeconds /3600);
    let minutes = Math.floor((totalSeconds - hours*3600)/60);
    let seconds = totalSeconds - (hours*3600 + minutes*60);
	$('#winningWord').text('You\'ve won with score '+score+' and it took you '+hours+' hour(s) '+minutes+' minute(s) and '+seconds+' second(s). Well Done!');
	modalWin.css('display','block');
}

function showLosingMessage() {
	let modalLoose = $('#loser');
	$('#losingWord').text('Better Luck Next time.');
	modalLoose.css('display','block');
}

function addToOpen(card) {
	let cardPic=card.children('i').attr('class').split(' ')[1];
	openCards.push(cardPic);
}

function increaseCounter() {
	counter += 1;
	$('.moves').text(counter);
// decrease the score depending on the amount of moves made	
	if (counter===30) { 
		$('#third-star').css('color','#fefefe');
		score=2;
	} else if (counter===40) {
		$('#second-star').css('color','#fefefe');
		score=1;
	} else if (counter>50) {
		showLosingMessage();
	}
}

function checkMatch() {
	if (openCards.length==2) { //if two cards are uncovered
		if (openCards[0]==openCards[1]) { //if they show the same image
			keepOpenOnMatch($('.card:has(.'+openCards[0]+')'));
			matchedCards.push(openCards[0]);
			if (matchedCards.length===8) { //the game is won
			 	clearInterval(timer);
			 	showWinnigMessage();	
			  }
		} else { //hide the uncovered cards
			hideSymbol($('.card:has(.'+openCards[0]+')'));
			hideSymbol($('.card:has(.'+openCards[1]+')'));
		}
		openCards=[];
	} 
}

$('.card').click( function(event) {
	if (FirstClick) {
		resetTimer();
		FirstClick = false;
	}
	let card = $(event.target); 
	if (!card.hasClass('match') && !card.hasClass('show')) { 
		if (openCards.length<=1) { 
			showSymbol(card);
			addToOpen(card);
			increaseCounter();
			setTimeout(checkMatch,1000); //give some time to the user to see both cards
		}
	}
});

$('.restart').click(newGame);

$(document).ready(newGame);

// When the user clicks on (x), close the pop up.
$('.close').click(function() {
    $('.structure').css('display', 'none');
});

// When the user clicks anywhere outside of the pop up, close it
window.onclick = function(event) {
    $('.structure').css('display', 'none');
};

// When play again button is clicked, new game is started
$('.play').click(newGame);

// When player doesn't want to play anymore
$('.not-playing').click(function() {
    $('.structure').css('display', 'none');
    clearInterval(timer);
});


