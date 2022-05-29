// helpers.js

module.exports = {
	minutes: function (x) {
		return x * 60_000 - 59_000;
	},

	randomElement: function (a) {
		return a[Math.floor(Math.random() * a.length)];
	},

	shuffleArray: function (a) {
		return a.sort(() => Math.random() - 0.5);
	},

	emojiCharacters: {
		a: '🇦',
		b: '🇧',
		c: '🇨',
		d: '🇩',
		e: '🇪',
		f: '🇫',
		g: '🇬',
		h: '🇭',
		i: '🇮',
		j: '🇯',
		k: '🇰',
		l: '🇱',
		m: '🇲',
		n: '🇳',
		o: '🇴',
		p: '🇵',
		q: '🇶',
		r: '🇷',
		s: '🇸',
		t: '🇹',
		u: '🇺',
		v: '🇻',
		w: '🇼',
		x: '🇽',
		y: '🇾',
		z: '🇿',
		0: '0️⃣',
		1: '1️⃣',
		2: '2️⃣',
		3: '3️⃣',
		4: '4️⃣',
		5: '5️⃣',
		6: '6️⃣',
		7: '7️⃣',
		8: '8️⃣',
		9: '9️⃣',
		10: '🔟',
		'#': '#️⃣',
		'*': '*️⃣',
		'!': '❗',
		'?': '❓',
	},
};
