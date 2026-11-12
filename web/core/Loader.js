/**
 * Global full-screen loader, shared by every pending async call.
 *
 * It is reference counted: the overlay stays visible until every call that
 * asked for it has finished, and only appears if a call lasts longer than
 * `delay` ms so fast responses do not make the interface flicker.
 *
 * Service.fetchAResource uses it automatically. For anything else:
 *   const result = await appLoader.track(somePromise);
 * The animation is the `.loader` element (customizable through the custom CSS).
 * Set `appLoader.enabled = false` on pages that handle their own loading state.
 */
class Loader {
	constructor(delay = 150) {
		this.delay = delay;
		this.enabled = true;
		this.pending = 0;
		this.timer = null;
		this.element = null;
	}

	show() {
		if (!this.enabled)
			return;

		this.pending++;
		if (this.pending == 1) {
			this.timer = setTimeout(() => this.toggle(true), this.delay);
		}
	}

	hide() {
		if (this.pending == 0)
			return;

		this.pending--;
		if (this.pending == 0) {
			clearTimeout(this.timer);
			this.timer = null;
			this.toggle(false);
		}
	}

	/**
	 * Keep the loader visible while a promise is pending.
	 *
	 * @param {Promise} promise - The pending call.
	 * @returns {Promise} The same promise, result or error untouched.
	 */
	async track(promise) {
		this.show();
		try {
			return await promise;
		} finally {
			this.hide();
		}
	}

	toggle(visible) {
		if (this.element == null) {
			if (!visible || !document.body)
				return;

			this.element = document.createElement('div');
			this.element.id = 'app-loader';
			this.element.className = 'loader-overlay';
			this.element.setAttribute('role', 'status');
			this.element.setAttribute('aria-live', 'polite');
			this.element.innerHTML = '<div class="loader"></div>';
			document.body.appendChild(this.element);
		}
		this.element.classList.toggle('show', visible);
	}
}

const appLoader = new Loader();
