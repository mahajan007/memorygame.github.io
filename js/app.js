/*
 * App's JavaScript code
 */

const cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let isFirstClick = false;
let openCards = [];
let moves = 0;
let timeCount = 0;
let solvedCount = 0;
let timer;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// get class value from card DOM
function classFromCard(card){
    return card[0].firstChild.className;
}

// check open cards when count = 2
function checkOpenCards(){
    if (classFromCard(openCards[0]) === classFromCard(openCards[1])){
        solvedCount++;
        openCards.forEach(function(card){
            card.animateCss('tada', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        openCards.forEach(function(card){
            card.animateCss('shake', function(){
                card.toggleClass("open show");
            });
        });
    }
    openCards = [];
    incrementMove();
    if (solvedCount === 8){
        endGame();
    }
}

// starts the timer
function timerStart(){
    timeCount += 1;
    $("#timer").html(timeCount);
    timer = setTimeout(timerStart, 1000);
}

// increment move count
function incrementMove(){
    moves += 1;
    $("#moves").html(moves);
    if (moves === 14 || moves === 20){
        reduceStar();
    }
}

// event handler for when the card is clicked
function cardClick(event){
    // check opened or matched card
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1){
        // both should be -1
        return;
    }
    // start game if needed
    if (!isFirstClick) {
        isFirstClick = true;
        timeCount = 0;
        timer = setTimeout(timerStart, 1000);
    }
    // cards can be flipped
    if (openCards.length < 2){
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    // check if cards match
    if (openCards.length === 2){
        checkOpenCards();
    }
}

// create individual card element
function cardCreation(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// populate cards in DOM
function populateCards(){
    shuffle(cardList.concat(cardList)).forEach(cardCreation);
}

// reset game
function resetGame(){
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    incrementMove();
    isFirstClick = false;
    openCards = [];
    timeCount = 0;
    solvedCount = 0;
    clearTimeout(timer);
    $("#timer").html(0);
    // re-setup game
    initGame();
}

// runs when game has been won
function endGame(){
    // stop timer
    clearTimeout(timer);
    // show prompt
    let stars = $(".fa-star").length;
    vex.dialog.confirm({
        message: `Congrats! You won the game in ${timeCount} seconds with ${stars}/3 star rating. Do you want to play again?`,
        callback: function(value){
            if (value){
                resetGame();
            }
        }
    });
}

// initialize stars display
function initStars(){
    for (let i=0; i<3; i++){
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

// reduce star rating
function reduceStar(){
    let stars = $(".fa-star");
    $(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

// init game
function initGame(){
    populateCards();
    initStars();
    $(".card").click(cardClick);
}

// things done after DOM is loaded for the first time
$(document).ready(function(){
    initGame();
    $("#restart").click(resetGame);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes!';
    vex.dialog.buttons.NO.text = 'No';
});

// load animateCss
// taken from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});
