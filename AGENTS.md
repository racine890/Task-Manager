# Task Manager - Frontend Rules

## Stack & Architecture
- Vanilla JS (ES6 classes), no framework.
- Custom MVC-ish pattern in `web/`:
  - `core/`: Base classes (`Component`, `Model`, `Service`, `Manager`, `Action`, `Form`, `DataManager`)
  - `pages/`: HTML pages
  - `actions/`: Page-specific JS
  - `components/`: Reusable UI components (custom HTML tags)
  - `services/`: API clients
  - `managers/`: Business logic / orchestration
  - `models/`: Data models
  - `assets/style/`: CSS

## API & Auth
- All API calls MUST go through `services/*Service.js` via `super.fetchAResource(...)`.
- Auth uses Bearer token stored in `appDataManager` (DataManager singleton from `init_global.js`).
- API base URL is in `core/app.config.json` (`server_url`). In production it auto-resolves to `window.location.origin`.

## API Discovery Workflow
- Pour chaque fonctionnalité demandée, lire d'abord `AGENTS.md` puis `app/scripts/system/apis.gcs`.
- Si une API nécessaire n'existe pas, proposer à la fin de la fonctionnalité :
  1. La ligne à ajouter dans `apis.gcs` au bon endroit.
  2. Le format de réponse JSON attendu.
  3. La requête SQL d'accès à la base, en s'appuyant sur `app/scripts/db/initDatabase.gcs` pour la structure des tables.

## Database Reference
- `app/scripts/db/initDatabase.gcs` contient le schéma SQLite/MySQL.
- Tables disponibles : `user`, `right`, `user_right`, `role`, `right_role`, `project`, `user_project`, `idea`, `task`, `user_task`, `note`, `resource`, `note_resource`, `task_resource`, `project_resource`, `category`, `config`.

## GCS Scripts
- Dans les fichiers `.gcs`, l'indentation est faite avec des **tabulations**, pas des espaces.
- Ne pas remplacer les tabulations par 4 espaces, sinon le parsing backend casse.

## Hard Constraint
- **Do NOT modify files under `app/`** unless explicitly requested by the user.
- Backend GCS files (`app/scripts/**/*.gcs`, `app/scripts/system/apis.gcs`) may be modified when implementing requested features. Code proposals should still be shown before writing when applicable.

## Routing
- Use the `redirect(path, newTarget, otherParams)` utility from `actions/utils.js`.
- Query params: `?no=<id>` for edit/view, `?project=<id>` for task creation context.

## Script Loading Order in HTML Pages
1. Core (`core/Service.js`, `core/Model.js`, `core/DataManager.js`, `core/Component.js`, optionally `core/Action.js`, `core/Form.js`)
2. Domain models
3. Domain services
4. Managers
5. Initializers (`actions/utils.js`, `actions/init_global.js`)
6. Page-specific actions (`actions/*.js`)
7. Components (`components/*.js`)

## Naming Conventions
- Component subclasses: `PascalCase` (e.g., `NavBarComponent`, `TableComponent`). Files: `components/*.js`
- Service subclasses: `camelCase` starting lowercase (e.g., `taskService`, `projectService`). Files: `services/*Service.js`
- Models: `lowercase` (e.g., `task`, `project`). Files: `models/*.js`
- Managers: plain async functions, not classes. Files: `managers/*_manager.js`
- Actions: page-specific behavior. Files: `actions/*.js`
- Pages: `pages/*.html`
- Global singletons: `appDataManager`, `appTaskService`, etc.

## Components
- Extend `Component`. Constructor: `constructor(selector, id=null, args={})`.
- Read HTML attributes with `this.getArgValue('name')`.
- Set `this.html` template string; `render()` replaces innerHTML.
- Auto-initialize in `DOMContentLoaded`.
- `TableComponent` requires global functions: `onLoadColumns`, `onLoadData`, `onLoadAction`, `paginationMethod`.
- `SelectionComponent` requires `selectionSearch` from `managers/selection_manager.js`. It references `../actions/selection.js` (currently missing; leave it as-is).

## Models
- Extend `Model`.
- `map(jsonObject)`: map API array response to properties.
- `mapLite(jsonObject)`: lightweight mapping.
- `unMap()`: return plain object for API payloads.

## Services
- Extend `Service`.
- Constructor must call `this.initConfig('../core/app.config.json')`.
- Use `super.fetchAResource(endpoint, method, headers, body)`.

## Managers
- Plain async functions, not classes.
- Wrap service calls with `try/catch` and `alert("An error occured!")` on failure.

## Forms
- Two patterns exist:
  1. `Action` + `Form` classes with validators (preferred for new forms, see `categoryForm.js`).
  2. Manual `addEventListener('submit', ...)` (see `taskForm.js`, `projectForm.js`, `userForm.js`).
- `Form` fields: `[elementId, defaultValue, validator, errorMessage]`.

## CSS
- Use CSS custom properties from `modern.css`.
- Status classes: `.New`, `.Todo`, `.Started`, `.Paused`, `.Testing`, `.Finished`, `.Abandoned`.
- Icons: Font Awesome (`fas fa-*`).

## PDF / Print
- Uses `html2pdf.bundle.min.js`.

## Search / Syntax Highlighting
- Uses `Prism.js` for code highlighting in detail views.

## Known Issues (do not fix unless asked)
- `components/selection.js` references missing `../actions/selection.js`.
- `ressource_manager.js` uses hardcoded `http://localhost:6102/upload` and `/download` instead of `Service.fetchAResource`.
