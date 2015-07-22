
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
	this.gameover = false;
	this.create();
}

Match.prototype = {
	create: function(){
		this.titleElement.innerText = 'Authors';
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
		html = html.concat(html);
		html.sort(this.shuffle);
		this.cardsElement.innerHTML = html.join('');

		var elements = document.getElementsByClassName('card');
		for(var i = 0; i < elements.length; i++) {
			elements[i].addEventListener('click', this.cardClicked.bind(this));
		}
	},

	cardClicked: function(event) {
		var card = event.target.parentElement;
		var game = this;

		if (game.gameover) {
			return;
		}
		if (game.selected.length === 0) {
			card.classList.toggle('flipped');
			game.selected.push(card);
			return;
		}
		if (game.selected.length === 1) {
			card.classList.toggle('flipped');
			game.selected.push(card);
			game.setTry();

			if (game.selected[0].dataset.index ===
				game.selected[1].dataset.index) {
				//match
				game.selected = [];
				game.setMatch();
			} else {
				// no match
				setTimeout(game.resetSelected.bind(game), 1000);
			}
		}
		if (game.matches === game.cards.length) {
			// game over
			clearInterval(game.timer);
			this.gameover = true;
			setTimeout(game.renderInfo.bind(game), 1000);
		}
	},

	resetSelected: function() {
		this.selected[0].classList.toggle('flipped');
		this.selected[1].classList.toggle('flipped');
		this.selected = [];
	},

	shuffle: function() {
		return Math.random() - 0.5;
	},

	setTry: function() {
		this.tries++;
		if (this.tries === 1) {
			this.timer = setInterval(this.renderTime.bind(this), 1000);
		}
		this.renderScore();
	},

	setMatch: function() {
		this.matches++;
		this.renderScore();
	},

	renderScore: function() {
		this.scoreElement.innerText = this.tries + ' / ' + this.matches;
	},

	renderTime: function() {
		this.timeElement.innerText = this.time++;
	},

	renderInfo: function() {
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
	}

};
