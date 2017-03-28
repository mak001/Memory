var pairs = 0;
//if it should match colors in addition to values
var matchColor = false;

//list of all card ids
var cardArray = ['ace-of-spades', 'ace-of-clubs', 'ace-of-hearts', 'ace-of-diamonds', 
	'two-of-spades', 'two-of-clubs', 'two-of-hearts', 'two-of-diamonds', 
	'three-of-spades', 'three-of-clubs', 'three-of-hearts', 'three-of-diamonds', 
	'four-of-spades', 'four-of-clubs', 'four-of-hearts', 'four-of-diamonds', 
	'five-of-spades', 'five-of-clubs', 'five-of-hearts', 'five-of-diamonds', 
	'six-of-spades', 'six-of-clubs', 'six-of-hearts', 'six-of-diamonds', 
	'seven-of-spades', 'seven-of-clubs', 'seven-of-hearts', 'seven-of-diamonds', 
	'eight-of-spades', 'eight-of-clubs', 'eight-of-hearts', 'eight-of-diamonds', 
	'nine-of-spades', 'nine-of-clubs', 'nine-of-hearts', 'nine-of-diamonds', 
	'ten-of-spades', 'ten-of-clubs', 'ten-of-hearts', 'ten-of-diamonds', 
	'jack-of-spades', 'jack-of-clubs', 'jack-of-hearts', 'jack-of-diamonds', 
	'queen-of-spades', 'queen-of-clubs', 'queen-of-hearts', 'queen-of-diamonds', 
	'king-of-spades', 'king-of-clubs', 'king-of-hearts', 'king-of-diamonds'];
	
var startTime = -1;
var timer;

$(document).ready(function() {
	
	var defaultTime = $('#timer').html();
	
	$('.reset').click(function() {
		wipeTable();
		generateTable();
		matchColor = $('#colors').is(':checked');
		$('.screen-overlay').removeClass('show');
		stopTimer();
		$('#timer').html(defaultTime);
	});
	
	$('.close').click(function() {
		$('.screen-overlay').removeClass('show');
	});
	
	$('.revert').click(function() {
		$('#colors').prop('checked', matchColor);
		$('.screen-overlay').removeClass('show');
	});
	
	$('#colors').change(function() {
		if ($('#colors').is(':checked') != matchColor) {
			$('#change').addClass('show');
		}
	});
	
	//.on is needed because .click does not work with dynamic elements
	$('#card-table').on('click', '.card-container', function() {
		if (startTime == -1) {
			startTime = new Date().getTime();
			getRunningTime();
			timer = setInterval(getRunningTime, 1000);
		}
		var clickedCard = $(this).find('.card');
		
		// skips whatever is after this if it is already matched.
		if (clickedCard.hasClass('matched')) {
			return;
		}
		
		//will only allow to flip if there are fewer than 2 cards currently flipped(and not matched)
		if ($('#card-table').find('.flipped:not(.matched)').length <= 1) {
			clickedCard.addClass('flipped');
			//get cards that are flipped but not matched
			var flipped = $('#card-table').find('.flipped:not(.matched)');
			
			//only runs when two cards are flipped
			if (flipped.length == 2) {
				var card1ID = flipped.get(0).id;
				var card2ID = flipped.get(1).id;
				
				//if the card values are the same
				if (getCardValue(card1ID) == getCardValue(card2ID)) {
					//if we should match color too
					if (matchColor) {
						//if the card colors are the same
						if (getCardColor(card1ID) == getCardColor(card2ID)) {
							match(flipped);
						} else {
							unflip(flipped);
						}
					} else {
						match(flipped);
					}
				} else {
					unflip(flipped);
				}
			}
		}
	});
	
	$('#timer').on('click', '#cheat', function() {
		if ($('#cheat-style').length) {
			$('#cheat-style').remove();
		} else {
			$('head').append(`<style id="cheat-style">
				.card:not(.flipped) {
					transform: rotateY(0);
				}
				
				.flipped:not(.matched) + .overlay {
					transition: background-color 0.25s linear 500ms;
					background-color: rgba(139, 234, 131, 0.50);
				}
				</style>`);
		}
	});

	wipeTable();
	generateTable();
	
});

function getRunningTime() {
	var currTime = new Date().getTime();
	var diff = millisToTime(currTime - startTime, 'minutes');
	console.log(diff);
	
	$('#timer').html(diff);
}

function millisToTime(millis, leadingZero) {
	var seconds = Math.floor((millis/1000) % 60);
	var minutes = Math.floor((millis/60000) % 60 );
	var hours = Math.floor((millis/(3600000)) % 24 );
	
	if (leadingZero == 'all') {
		return zeroPad(hours, 2) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
	} else if (leadingZero == 'minutes') {
		return zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
	} else {
		if (hours > 0) {
			return zeroPad(hours, 2) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
		} else if (minutes > 0) {
			return zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
		} else {
			return zeroPad(seconds, 2);
		}
	}
}

// from http://stackoverflow.com/a/2998874
function zeroPad(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

function stopTimer() {
	clearInterval(timer);
	startTime = -1;
}

//clears the table and wipes the score
function wipeTable() {
	pairs = 0;
	$('#counter').html(pairs);
	$('#card-table').html('');
}

//creates a new table
function generateTable() {
	var shuffeled = shuffle(cardArray);
	for (var i = 0; i < shuffeled.length; i++) {
		$('#card-table').append(getCardCode(shuffeled[i]));
	}
}

function match(cards) {
	cards.addClass('matched');
	pairs++;
	$('#counter').html(pairs);
	if (pairs == (52 / 2)) {
		$('#winning').addClass('show');
		stopTimer();
	}
}

function unflip(cards) {
	setTimeout(function() {
		cards.removeClass('flipped');
	}, 1000);
}

//easiest way to make each card in html
function getCardCode(id) {
	return '<div class="card-container">' +
		'<div class="card" id="' + id + '">' +
			'<div class="front"></div>' +
			'<div class="back"></div>' +
		'</div>' +
		'<div class="overlay"></div>' +
	  '</div>';
}

//gets the color of the card
function getCardColor(id) {
	//suit of the card
	var val = id.split('-')[2];
	
	//uses fall through cases (easier than typing every case out)
	switch(val) {
		case 'spades':
		case 'clubs':
			return 'black';
			break;
		case 'hearts':
		case 'diamonds':
			return 'red';
			break;
		default:
			return 'error';
			break;
	}
}

//gets the numberic value of the card
function getCardValue(id) {
	//number on the card
	var val = id.split('-')[0];
	switch(val) {
		case 'ace':
		case 'one':
			return 1;
			break;
			
		case 'two':
			return 2;
			break;
			
		case 'three':
			return 3;
			break;
			
		case 'four':
			return 4;
			break;
			
		case 'five':
			return 5;
			break;
			
		case 'six':
			return 6;
			break;
			
		case 'seven':
			return 7;
			break;
			
		case 'eight':
			return 8;
			break;
			
		case 'nine':
			return 9;
			break;
			
		case 'ten':
			return 10;
			break;
		
		case 'eleven':
		case 'jack':
			return 11;
			break;
		
		case 'twelve':
		case 'queen':
			return 12;
			break;
		
		case 'thirteen':
		case 'king':
			return 13;
			break;
		
		default:
			return 'error';
			break;
	}
}

//from http://stackoverflow.com/a/2450976
//shuffles an array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}