(function(global) {
'use strict';

function Match(cards) {
	this.cards = cards;
	this.cardsElement = document.getElementById('cards');
	this.scoreElement = document.getElementById('score');
	this.timeElement = document.getElementById('time');
	this.titleElement = document.getElementById('title');
	this.infoElement = document.getElementById('info');
	this.selected = [];
	this.timer = null;
	this.time = 1;
	this.tries = 0;
	this.matches = 0;
	this.create();
}

/**
 * Create cards and render them to html
 */
Match.prototype.create = function() {
	var html = [];
	this.cards.forEach(function(card, i) {
		html[i]  = '<div class="card" data-index="' + i + '">'
			+ '<div class="front"></div>'
			+ '<div class="back">'
			+ '<p class="cardname">' + card.name + '</p>'
			+ '<img src="' + card.src + '">';
		for (var n = 0; n < card.details.length; n++) {
			html[i] += '<p>' + card.details[n] + '</p>';
		}
		html[i] += '</div></div>';
	});
	// duplicate each card
	html = html.concat(html);
	// sort randomly
	html.sort(this.shuffle);
	// render to html
	this.cardsElement.innerHTML = html.join('');

	// add event handler for each card
	var elements = document.getElementsByClassName('front');
	for(var i = 0; i < elements.length; i++) {
		elements[i].addEventListener('click', this.cardClicked.bind(this));
	}
};

/**
 * Event handler for card click
 */
Match.prototype.cardClicked = function(event) {
	var card = event.target.parentElement;
	var game = this;

	// first card selected, save to array
	if (game.selected.length === 0) {
		card.classList.toggle('flipped');
		game.selected.push(card);
		return;
	}
	// second card selected, save to array and check for match
	if (game.selected.length === 1) {
		card.classList.toggle('flipped');
		game.selected.push(card);
		game.setTry();

		if (game.selected[0].dataset.index ===
			card.dataset.index) {
			//match
			game.selected = [];
			game.setMatch();
		} else {
			// no match
			setTimeout(game.resetSelected.bind(game), 1000);
		}
	}
	// check for all cards matched
	if (game.matches === game.cards.length) {
		// game over
		clearInterval(game.timer);
		setTimeout(game.renderInfo.bind(game), 1000);
	}
};

/**
 * Reset cards if no match
 */
Match.prototype.resetSelected = function() {
	this.selected[0].classList.toggle('flipped');
	this.selected[1].classList.toggle('flipped');
	this.selected = [];
};

/**
 * Return random value for sorting
 */
Match.prototype.shuffle = function() {
	return Math.random() - 0.5;
};

/**
 * Increment tries, start game timer after first try
 */
Match.prototype.setTry = function() {
	this.tries++;
	if (this.tries === 1) {
		this.timer = setInterval(this.renderTime.bind(this), 1000);
	}
	this.renderScore();
};

/**
 * Increment matches
 */
Match.prototype.setMatch = function() {
	this.matches++;
	this.renderScore();
};

/**
 * Render tries and matches to html
 */
Match.prototype.renderScore = function() {
	this.scoreElement.innerText = this.tries + ' / ' + this.matches;
};

/**
 * Render game timer to html
 */
Match.prototype.renderTime = function() {
	this.timeElement.innerText = this.time++;
};

/**
 * Render game over screen
 */
Match.prototype.renderInfo = function() {
	var msg = 'You solved the game in '
		+ this.time + ' seconds with '
		+ this.tries + ' tries.';

	document.getElementById('infotext').innerText = msg;
	this.infoElement.classList.toggle('hidden');

	document.getElementById('btnYes').addEventListener('click', function() {
		location.reload();
	});
	document.getElementById('btnNo').addEventListener('click',function() {
		this.infoElement.classList.toggle('hidden');
	}.bind(this));
};

global.Match = Match;

})(this);