// CSS personnalisé : stocké dans localStorage, injecté après theme.css à chaque page.
// Chargé de façon synchrone dans le <head> pour éviter tout flash de style.
(function () {
	const KEY = 'custom-css';

	function read() {
		try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; }
	}

	function apply(css) {
		let style = document.querySelector('style[data-source="localstorage"]');
		if (!style) {
			style = document.createElement('style');
			style.setAttribute('data-source', 'localstorage');
			// Après la dernière feuille de style, pour gagner la cascade
			const links = document.querySelectorAll('link[rel="stylesheet"]');
			if (links.length) links[links.length - 1].after(style);
			else document.head.appendChild(style);
		}
		style.textContent = css;
		// Un `.loader` personnalisé remplace entièrement le loader par défaut
		document.documentElement.classList.toggle('custom-loader', /\.loader(?![\w-])/.test(css));
	}

	window.customCss = {
		get: read,
		apply: apply,
		save(css) {
			try {
				if (css.trim()) localStorage.setItem(KEY, css);
				else localStorage.removeItem(KEY);
			} catch (e) { /* stockage indisponible */ }
			apply(css);
		}
	};

	apply(read());
})();
