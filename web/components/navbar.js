
class NavBarComponent extends Component {

	constructor() {
		super('NavBarComponent');

		const title = this.getArgValue('Title');

		this.rights = appDataManager.getvar('rights');
		const rnames = [];
		if (hasRight('admin')) {
			rnames.push('read_idea');
			rnames.push('read_project');
			rnames.push('read_task');
			rnames.push('read_user');
			rnames.push('read_category');
			rnames.push('read_resource');
			rnames.push('read_settings');
		}

		this.rights.forEach(element => {
			rnames.push(element.name);
		});

		// Navigation : [right, href, label, icon]
		const projectLinks = [
			['read_project', 'dashboard-projects.html', 'Projects', 'fa-diagram-project'],
			['read_task', 'dashboard-tasks.html', 'Tasks', 'fa-list-check'],
		];
		const adminLinks = [
			['read_user', 'dashboard-users.html', 'Profiles', 'fa-users'],
			['read_category', 'dashboard-categories.html', 'Categories', 'fa-tags'],
			['read_resource', 'dashboard-ressources.html', 'Files', 'fa-folder-open'],
			['read_settings', 'dashboard-settings.html', 'Settings', 'fa-sliders'],
		];

		const current = window.location.pathname.split('/').pop();
		const link = (href, label, icon, extra = '') => `
			<a class="nav-link ${current === href ? 'active' : ''} ${extra}" href="${href}">
				<i class="fas ${icon}"></i><span class="nav-text">${label}</span>
			</a>`;
		const section = (label, items) => items.length === 0 ? '' : `
			<div class="nav-section">
				<div class="nav-label">${label}</div>
				${items.join('')}
			</div>`;

		const mainItems = [];
		mainItems.push(rnames.includes('read_project')
			? link('dashboard-projects.html', 'Projects', 'fa-diagram-project')
			: link('dashboard-projects.html', 'Home', 'fa-house'));
		if (rnames.includes('read_project') || rnames.includes('read_task') || rnames.includes('read_idea'))
			mainItems.push(link('search.html', 'Search', 'fa-magnifying-glass'));

		const workItems = projectLinks.filter(l => rnames.includes(l[0]) && l[1] !== 'dashboard-projects.html')
			.map(l => link(l[1], l[2], l[3]));
		if (rnames.includes('read_idea'))
			workItems.push(link('dashboard-ideas.html', 'Ideas', 'fa-lightbulb'));

		const adminItems = adminLinks.filter(l => rnames.includes(l[0])).map(l => link(l[1], l[2], l[3]));

		let pinnedTasks = [];
		try {
			pinnedTasks = JSON.parse(localStorage.getItem('pinnedTasks')) || [];
		} catch (e) {
			pinnedTasks = [];
		}
		const pinnedItems = pinnedTasks.map(t =>
			`<a class="nav-link pinned ${current === 'taskDetails.html' && window.location.search.includes('no=' + t.id) ? 'active' : ''}" href="taskDetails.html?no=${t.id}" title="${t.name}">
				<i class="fas fa-thumbtack"></i><span class="nav-text">${t.name}</span>
			</a>`);

		// Utilisateur courant
		let username = 'Account';
		try {
			const me = appDataManager.getvar('current_user');
			username = me.username || me.name || me.email || username;
		} catch (e) { /* pas de profil en cache */ }
		const initials = String(username).trim().split(/[\s._-]+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';

		// Entrées de la palette (Ctrl+K)
		this.paletteItems = [];
		projectLinks.concat([['read_idea', 'dashboard-ideas.html', 'Ideas', 'fa-lightbulb']], adminLinks)
			.filter(l => rnames.includes(l[0]) && l[1] !== 'dashboard-projects.html')
			.forEach(l => this.paletteItems.push({ group: 'Navigate', label: l[2], icon: l[3], href: l[1] }));
		if (rnames.includes('read_project'))
			this.paletteItems.push({ group: 'Navigate', label: 'Projects', icon: 'fa-diagram-project', href: 'dashboard-projects.html' });
		if (hasRight('create_project'))
			this.paletteItems.push({ group: 'Create', label: 'New project', icon: 'fa-plus', href: 'projectForm.html' });
		if (hasRight('create_task'))
			this.paletteItems.push({ group: 'Create', label: 'New task', icon: 'fa-plus', href: 'taskForm.html' });
		if (hasRight('create_idea'))
			this.paletteItems.push({ group: 'Create', label: 'New idea', icon: 'fa-plus', href: 'ideaForm.html' });
		pinnedTasks.forEach(t => this.paletteItems.push({ group: 'Pinned tasks', label: t.name, icon: 'fa-thumbtack', href: `taskDetails.html?no=${t.id}` }));
		this.paletteItems.push({ group: 'Account', label: 'My account', icon: 'fa-user', href: 'account.html' });
		this.paletteItems.push({ group: 'Account', label: 'Toggle dark mode', icon: 'fa-moon', action: 'theme' });
		this.paletteItems.push({ group: 'Account', label: 'Edit custom CSS', icon: 'fa-paintbrush', action: 'css' });
		this.paletteItems.push({ group: 'Account', label: 'Logout', icon: 'fa-right-from-bracket', action: 'logout' });

		this.html = `
			<aside class="sidebar" id="sidebar">
				<a class="sidebar-brand" href="dashboard-projects.html">
					<span class="sidebar-logo"><i class="fas fa-check-double"></i></span>
					Task Manager
				</a>
				<nav class="sidebar-nav">
					${section('Workspace', mainItems)}
					${section('Pinned', pinnedItems)}
					${section('Work', workItems)}
					${section('Administration', adminItems)}
				</nav>
				<div class="sidebar-foot">
					<div class="sidebar-user">
						<span class="avatar-sm">${initials}</span>
						<div class="sidebar-user-info">
							<div class="sidebar-user-name">${username}</div>
							<a class="sidebar-user-link" href="account.html">My account</a>
						</div>
					</div>
					<a class="sidebar-logout" href="#" id="logoutBtn" title="Logout"><i class="fas fa-right-from-bracket"></i></a>
				</div>
			</aside>
			<div class="sidebar-backdrop" id="sidebarBackdrop"></div>

			<header class="topbar">
				<button class="icon-btn" id="menuToggle" aria-label="Menu"><i class="fas fa-bars"></i></button>
				<div class="topbar-title">${title}</div>
				<div class="topbar-spacer"></div>
				<button class="quick-search" id="paletteOpen" aria-label="Quick search">
					<i class="fas fa-magnifying-glass"></i><span>Quick search…</span><kbd>Ctrl K</kbd>
				</button>
				<button class="icon-btn" id="cssEditBtn" title="Edit CSS" aria-label="Edit CSS"><i class="fas fa-paintbrush"></i></button>
				<button class="icon-btn" id="themeToggle" title="Toggle dark mode" aria-label="Toggle dark mode"><i class="fas fa-moon"></i></button>
			</header>

			<div class="palette" id="palette">
				<div class="palette-box">
					<div class="palette-input-wrap">
						<i class="fas fa-magnifying-glass"></i>
						<input type="text" id="paletteInput" placeholder="Go to a page, create something, or search…" autocomplete="off">
					</div>
					<div class="palette-list" id="paletteList"></div>
					<div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
				</div>
			</div>

			<div class="css-modal" id="cssModal">
				<div class="css-modal-box">
					<div class="css-modal-head">
						<h2><i class="fas fa-paintbrush"></i> Custom CSS</h2>
						<button class="icon-btn" id="cssClose" aria-label="Close"><i class="fas fa-xmark"></i></button>
					</div>
					<p class="css-modal-hint">Applied live on every page and saved in this browser. Try <code>:root { --accent: #7c3aed; --accent-hover: #6d28d9; }</code> to change the main color. To restyle the loader, define your own <code>.loader</code> (any <code>&lt;div class="loader"&gt;&lt;/div&gt;</code> snippet works).</p>
					<textarea id="cssEditor" spellcheck="false" placeholder=":root {\n\t--accent: #7c3aed;\n\t--radius: 4px;\n}\n\n.sidebar {\n\t--side-bg: #1a1033;\n}"></textarea>
					<div class="css-modal-foot">
						<button class="btn-secondary" id="cssReset"><i class="fas fa-rotate-left"></i> Reset</button>
						<span class="spacer"></span>
						<button class="btn-secondary" id="cssCancel">Cancel</button>
						<button id="cssSave"><i class="fas fa-check"></i> Save</button>
					</div>
				</div>
			</div>
		`;
	}

	// ---- CSS personnalisé -------------------------------------------------
	openCssEditor() {
		this.cssSaved = window.customCss ? window.customCss.get() : '';
		this.cssEditor.value = this.cssSaved;
		this.cssModal.classList.add('open');
		this.cssEditor.focus();
	}

	// Ferme en restaurant le CSS enregistré (annule l'aperçu en direct)
	closeCssEditor() {
		if (!this.cssModal.classList.contains('open')) return;
		this.cssModal.classList.remove('open');
		if (window.customCss) window.customCss.apply(this.cssSaved);
	}

	// ---- Thème clair / sombre -------------------------------------------
	static isDark() {
		const forced = document.documentElement.getAttribute('data-theme');
		if (forced) return forced === 'dark';
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	static toggleTheme() {
		const next = NavBarComponent.isDark() ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', next);
		try { localStorage.setItem('theme', next); } catch (e) { /* stockage indisponible */ }
		NavBarComponent.syncThemeIcon();
	}

	static syncThemeIcon() {
		const icon = document.querySelector('#themeToggle i');
		if (icon) icon.className = 'fas ' + (NavBarComponent.isDark() ? 'fa-sun' : 'fa-moon');
	}

	// ---- Palette de commandes -------------------------------------------
	openPalette() {
		this.palette.classList.add('open');
		this.paletteInput.value = '';
		this.filterPalette('');
		this.paletteInput.focus();
	}

	closePalette() {
		this.palette.classList.remove('open');
	}

	filterPalette(query) {
		const q = query.trim().toLowerCase();
		this.visible = this.paletteItems.filter(i => !q || i.label.toLowerCase().includes(q));
		if (q)
			this.visible.push({ group: 'Search', label: `Search “${query.trim()}” in projects, tasks and ideas`, icon: 'fa-magnifying-glass', href: `search.html?q=${encodeURIComponent(query.trim())}` });
		this.selected = 0;
		this.renderPalette();
	}

	renderPalette() {
		let html = '';
		let lastGroup = null;
		this.visible.forEach((item, idx) => {
			if (item.group !== lastGroup) {
				html += `<div class="palette-group">${item.group}</div>`;
				lastGroup = item.group;
			}
			html += `<div class="palette-item ${idx === this.selected ? 'selected' : ''}" data-idx="${idx}">
						<i class="fas ${item.icon}"></i><span>${item.label}</span>
					</div>`;
		});
		this.paletteList.innerHTML = html || `<div class="palette-empty">No result</div>`;
		const sel = this.paletteList.querySelector('.selected');
		if (sel) sel.scrollIntoView({ block: 'nearest' });
	}

	runPaletteItem(item) {
		if (!item) return;
		this.closePalette();
		if (item.action === 'theme') return NavBarComponent.toggleTheme();
		if (item.action === 'css') return this.openCssEditor();
		if (item.action === 'logout') return logout();
		window.location.href = item.href;
	}

	render() {
		super.render();

		document.getElementById('logoutBtn').addEventListener('click', (e) => {
			e.preventDefault();
			logout();
		});

		// Menu mobile
		const closeNav = () => document.body.classList.remove('nav-open');
		document.getElementById('menuToggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
		document.getElementById('sidebarBackdrop').addEventListener('click', closeNav);

		// Thème
		document.getElementById('themeToggle').addEventListener('click', NavBarComponent.toggleTheme);
		NavBarComponent.syncThemeIcon();

		// Éditeur de CSS
		this.cssModal = document.getElementById('cssModal');
		this.cssEditor = document.getElementById('cssEditor');
		this.cssSaved = '';
		document.getElementById('cssEditBtn').addEventListener('click', () => this.openCssEditor());
		document.getElementById('cssClose').addEventListener('click', () => this.closeCssEditor());
		document.getElementById('cssCancel').addEventListener('click', () => this.closeCssEditor());
		this.cssModal.addEventListener('mousedown', (e) => { if (e.target === this.cssModal) this.closeCssEditor(); });
		this.cssEditor.addEventListener('input', () => window.customCss && window.customCss.apply(this.cssEditor.value));
		this.cssEditor.addEventListener('keydown', (e) => {
			// Tab insère une tabulation au lieu de quitter le champ
			if (e.key === 'Tab') {
				e.preventDefault();
				const { selectionStart: a, selectionEnd: b, value } = this.cssEditor;
				this.cssEditor.value = value.slice(0, a) + '\t' + value.slice(b);
				this.cssEditor.selectionStart = this.cssEditor.selectionEnd = a + 1;
			}
		});
		document.getElementById('cssSave').addEventListener('click', () => {
			if (window.customCss) window.customCss.save(this.cssEditor.value);
			this.cssSaved = this.cssEditor.value;
			this.closeCssEditor();
		});
		document.getElementById('cssReset').addEventListener('click', () => {
			if (!confirm('Remove all custom CSS?')) return;
			if (window.customCss) window.customCss.save('');
			this.cssSaved = '';
			this.cssEditor.value = '';
		});

		// Palette
		this.palette = document.getElementById('palette');
		this.paletteInput = document.getElementById('paletteInput');
		this.paletteList = document.getElementById('paletteList');
		this.visible = [];
		this.selected = 0;

		document.getElementById('paletteOpen').addEventListener('click', () => this.openPalette());
		this.palette.addEventListener('mousedown', (e) => { if (e.target === this.palette) this.closePalette(); });
		this.paletteInput.addEventListener('input', () => this.filterPalette(this.paletteInput.value));
		this.paletteList.addEventListener('click', (e) => {
			const row = e.target.closest('.palette-item');
			if (row) this.runPaletteItem(this.visible[+row.dataset.idx]);
		});
		this.paletteInput.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowDown') { e.preventDefault(); this.selected = Math.min(this.selected + 1, this.visible.length - 1); this.renderPalette(); }
			else if (e.key === 'ArrowUp') { e.preventDefault(); this.selected = Math.max(this.selected - 1, 0); this.renderPalette(); }
			else if (e.key === 'Enter') { e.preventDefault(); this.runPaletteItem(this.visible[this.selected]); }
		});

		document.addEventListener('keydown', (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				this.palette.classList.contains('open') ? this.closePalette() : this.openPalette();
			} else if (e.key === 'Escape') {
				this.closePalette();
				this.closeCssEditor();
				closeNav();
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {

	const navbar = new NavBarComponent();
	navbar.render();
});
