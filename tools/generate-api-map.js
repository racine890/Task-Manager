#!/usr/bin/env node
/**
 * Generates web/core/api-map.json from the backend sources:
 *   - app/scripts/system/apis.gcs   (routes: method, path, script)
 *   - app/scripts/<group>/<file>.gcs (params, payload fields, rights, response)
 *   - app/scripts/db/*.gcs          (response field names)
 *   - app/scripts/db/initDatabase.gcs (column types)
 *
 * Usage: node tools/generate-api-map.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APIS_FILE = path.join(ROOT, 'app/scripts/system/apis.gcs');
const SCHEMA_FILE = path.join(ROOT, 'app/scripts/db/initDatabase.gcs');
const OUT_FILE = path.join(ROOT, 'web/core/api-map.json');
const USER_FORM_FILE = path.join(ROOT, 'web/actions/userForm.js');

const BLOCK_START = '/* API_MAP_START';
const BLOCK_END = '/* API_MAP_END */';

/* ------------------------------------------------------------------ */
/* Types that cannot be derived from the schema                        */
/* ------------------------------------------------------------------ */

	const FIELD_TYPES = {
	username: 'string',
	password: 'string',
	oldPassword: 'string',
	newPassword: 'string',
	pic: 'string',
	email: 'string',
	phone: 'string',
	role: 'string',
	term: 'string',
	format: 'string',
	key: 'string',
	value: 'string',
	name: 'string',
	description: 'string',
	path: 'string',
	title: 'string',
	note: 'string',
	target: 'string (task|project|both)',
	initial_status: 'integer',
	allowed_statuses: 'array of integer',
	progress: 'integer',
	status: 'integer',
	progression: 'integer',
	start: 'integer',
	filters: 'array of objects',
	hourly_rate: 'number',
	external: 'boolean',
	evaluated_hours: 'number',
	mother_idea: 'integer',
	project_id: 'integer',
	category_id: 'integer',
	type: 'integer',
	creator: 'integer',
	active: 'integer',
	create_date: 'string (date)',
	start_date: 'string (YYYY-MM-DD)',
	end_date: 'string (YYYY-MM-DD)'
};

const PARAM_TYPES = {
	id: 'integer',
	tid: 'integer',
	nid: 'integer',
	wid: 'integer',
	pid: 'integer',
	spid: 'integer',
	rid: 'integer',
	rightId: 'integer',
	start: 'integer',
	status: 'integer',
	progress: 'integer',
	term: 'string',
	key: 'string',
	format: 'string'
};

/* Human readable descriptions, kept from the hand written API map. */
const DESCRIPTIONS = {
	'POST /api/auth': 'authenticate and get a bearer token',
	'POST /api/logout': 'logout',
	'GET /api/user/me': 'get current user',
	'PATCH /api/user/me': 'update current user',
	'GET /api/user/{start}': 'get paginated users',
	'GET /api/user/get/{id}': 'get user by id',
	'DELETE /api/user/{id}': 'delete user',
	'PATCH /api/user/enable/{id}': 'enable user',
	'POST /api/user': 'create user',
	'PATCH /api/user/{id}': 'update user',
	'GET /api/user/rights/{id}': 'get user rights',
	'DELETE /api/user/rights/{id}/{rightId}': 'drop user right',
	'POST /api/user/rights/{id}/{rightId}': 'add user right',
	'PATCH /api/user/me/password': 'update password',
	'GET /api/user/assignations/{id}': 'get user assignations',
	'POST /api/user/assignations/{id}/{start}': 'get paginated assignations',
	'GET /api/idea/get/{id}': 'get idea by id',
	'POST /api/idea': 'create idea',
	'PATCH /api/idea/{id}': 'update idea',
	'DELETE /api/idea/{id}': 'delete idea',
	'GET /api/idea/{start}': 'get paginated ideas',
	'GET /api/idea/project/{id}': 'get ideas by project',
	'GET /api/task/get/{id}': 'get task by id',
	'POST /api/task': 'create task',
	'PATCH /api/task/{id}': 'update task',
	'DELETE /api/task/{id}': 'delete task',
	'POST /api/task/{start}': 'get paginated tasks',
	'GET /api/task/workers/{id}': 'get task workers',
	'DELETE /api/task/workers/{tid}/{wid}': 'delete worker from task',
	'POST /api/task/workers/{tid}/{wid}': 'assign worker to task',
	'POST /api/task/notes/{tid}': 'add note to task',
	'PATCH /api/task/notes/{nid}': 'update note',
	'GET /api/task/notes/{id}': 'get task notes',
	'GET /api/task/ressources/{id}': 'get task resources',
	'POST /api/task/status/{id}/{status}': 'change task status',
	'POST /api/task/assign-last/{id}': 'assign last resource',
	'GET /api/task/resources/{id}': 'get task resources',
	'DELETE /api/task/resources/{id}/{rid}': 'delete resource from task',
	'DELETE /api/task/notes/{id}/{nid}': 'delete note from task',
	'POST /api/task/progress/{id}/{progress}': 'update task progress',
	'POST /api/task/validate-evaluation/{id}': 'validate evaluation',
	'GET /api/project/get/{id}': 'get project by id',
	'POST /api/project': 'create project',
	'GET /api/project/all': 'get all projects',
	'PATCH /api/project/{id}': 'update project',
	'DELETE /api/project/{id}': 'delete project',
	'POST /api/project/{start}': 'get paginated projects',
	'GET /api/project/workers/{id}': 'get project workers',
	'DELETE /api/project/workers/{pid}/{wid}': 'delete worker from project',
	'POST /api/project/workers/{pid}/{wid}': 'assign worker to project',
	'POST /api/project/sub-projects/{pid}/{spid}': 'assign sub-project',
	'POST /api/project/tasks/{id}/{tid}': 'assign task to project',
	'DELETE /api/project/sub-projects/{id}': 'unassign sub-project',
	'GET /api/project/sub-projects/{id}': 'get sub-projects',
	'GET /api/project/ressources/{id}': 'get project resources',
	'GET /api/project/tasks/{id}': 'get project tasks',
	'DELETE /api/project/tasks/{id}': 'unassign task from project',
	'POST /api/project/status/{id}/{status}': 'change project status',
	'POST /api/project/assign-last/{id}': 'assign last resource',
	'GET /api/project/resources/{id}': 'get project resources',
	'DELETE /api/project/resources/{id}/{rid}': 'delete resource from project',
	'POST /api/project/export/{id}/{format}': 'export project',
	'GET /api/search/user/{term}': 'search users',
	'GET /api/search/project/{term}': 'search projects',
	'GET /api/search/task/{term}': 'search tasks',
	'GET /api/search/idea/{term}': 'search ideas',
	'GET /api/search/right/{term}': 'search rights',
	'GET /api/category': 'get all categories',
	'GET /api/category/get/{id}': 'get category by id',
	'POST /api/category': 'create category',
	'PATCH /api/category/{id}': 'update category',
	'DELETE /api/category/{id}': 'delete category',
	'GET /api/category/{start}': 'get paginated categories',
	'GET /api/ressource/get/{id}': 'get resource by id',
	'POST /api/ressource': 'create resource',
	'PATCH /api/ressource/{id}': 'update resource',
	'DELETE /api/ressource/{id}': 'delete resource',
	'GET /api/ressource/{start}': 'get paginated resources',
	'POST /api/ressource/upload': 'upload resource',
	'GET /api/ressource/download': 'download resource',
	'GET /api/config/get/{key}': 'get config by key',
	'PATCH /api/config': 'update config',
	'GET /api/config/{start}': 'get paginated configs',
	'POST /api/telegram/notify': 'send telegram notification to contacts'
};

/* Fields added to the answer by the script itself. */
const EXTRA_RESPONSE_FIELDS = {
	'POST /api/auth': ['token', 'rights']
};

/* Answers that the scripts build by hand, they overwrite the db fields. */
const RESPONSE_OVERRIDES = {
	'POST /api/auth': { kind: 'object', fields: ['token', 'rights'] }
};

const GROUPS = [
	{ key: 'auth', label: 'AUTH', match: /^\/api\/(auth|logout)/ },
	{ key: 'user', label: 'USER', match: /^\/api\/user/ },
	{ key: 'idea', label: 'IDEA', match: /^\/api\/idea/ },
	{ key: 'task', label: 'TASK', match: /^\/api\/task/ },
	{ key: 'project', label: 'PROJECT', match: /^\/api\/project/ },
	{ key: 'search', label: 'SEARCH', match: /^\/api\/search/ },
	{ key: 'category', label: 'CATEGORY', match: /^\/api\/category/ },
	{ key: 'ressource', label: 'RESOURCE', match: /^\/api\/ressource/ },
	{ key: 'config', label: 'CONFIG', match: /^\/api\/config/ }
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function read(file) {
	return fs.readFileSync(file, 'utf8');
}

/** Removes the GCS comment lines (a line whose first non blank char is #). */
function codeLines(content) {
	return content.split(/\r?\n/)
		.map((line) => line.replace(/\s+$/, ''))
		.filter((line) => !/^\s*#/.test(line));
}

function unique(list) {
	return [...new Set(list)];
}

function schemaTypes() {
	const types = {};
	if (!fs.existsSync(SCHEMA_FILE)) return types;

	const content = read(SCHEMA_FILE);
	const blockRegex = /\[\w+\]\s*create table\s+(\w+)\s*\(([\s\S]*?)\)\s*;/g;
	let match;

	while ((match = blockRegex.exec(content)) !== null) {
		const body = match[2];
		body.split(/\r?\n/).forEach((line) => {
			const column = line.trim().replace(/,$/, '');
			if (!column || /^(primary|foreign|unique|check|constraint)/i.test(column)) return;
			const parts = column.split(/\s+/);
			if (parts.length < 2) return;
			types[parts[0]] = sqlTypeToJson(parts[1]);
		});
	}

	return types;
}

function sqlTypeToJson(sqlType) {
	const type = String(sqlType).toLowerCase();
	if (type.startsWith('int') || type.startsWith('bool')) return 'integer';
	if (type.startsWith('decimal') || type.startsWith('numeric') || type.startsWith('float') || type.startsWith('double')) return 'number';
	return 'string';
}

/** Reads the field names returned by a db script (tuple_to_dict / list_to_dict). */
function responseFields(file) {
	if (!fs.existsSync(file)) return { kind: null, fields: [] };

	const content = read(file);
	const fields = [];
	let kind = null;
	const regex = /(tuple_to_dict|list_to_dict)\s*\(\s*\{[^}]*\}\s*,\s*\(([^)]*)\)/g;
	let match;

	while ((match = regex.exec(content)) !== null) {
		kind = kind || (match[1] === 'list_to_dict' ? 'list' : 'object');
		match[2].split(',').forEach((name) => {
			const clean = name.trim().replace(/^['"]|['"]$/g, '');
			if (clean) fields.push(clean.replace(/\./g, '_'));
		});
	}

	return { kind, fields: unique(fields) };
}

/** Reads the columns written by an update statement (raw body endpoints). */
function updatedColumns(file) {
	if (!fs.existsSync(file)) return [];

	const content = read(file);
	const columns = [];
	const regex = /update\s+\w+\s+set\s+([^;]+);/gi;
	let match;

	while ((match = regex.exec(content)) !== null) {
		match[1].split(',').forEach((part) => {
			if (/current_timestamp/i.test(part)) return;
			const column = part.split('=')[0].trim();
			if (column) columns.push(column);
		});
	}

	return unique(columns);
}

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

function parseRoutes() {
	const content = read(APIS_FILE);
	const routes = [];

	content.split(/\r?\n/).forEach((rawLine) => {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) return;

		const match = line.match(/^expose\s+(public\s+)?(\S+)\s+using\s+\S+\s+from\s+(\S+)\s+with\s+(\w+)\s*$/i);
		if (!match) return;

		routes.push({
			method: match[4].toUpperCase(),
			path: match[2],
			isPublic: Boolean(match[1]),
			script: match[3]
		});
	});

	return routes;
}

function parseScript(file) {
	const result = {
		params: [],
		body: [],
		rawBody: false,
		required: [],
		rights: [],
		message: null,
		returnsJson: false,
		dbScripts: []
	};

	if (!fs.existsSync(file)) return result;

	const lines = codeLines(read(file));

	lines.forEach((line) => {
		const trimmed = line.trim();

		let match = trimmed.match(/^GetTableElement\s+(\S+)\s+of\s+API_PARAMS$/i);
		if (match) {
			result.params.push(match[1]);
			return;
		}

		match = trimmed.match(/^GetTableElement\s+(\S+)\s+of\s+API_DATA$/i);
		if (match) {
			result.body.push(match[1]);
			return;
		}

		// The whole body is used as a value (ex: PATCH /api/task/notes/{nid}).
		match = trimmed.match(/^SetVar\s+\*\w+\s+API_DATA$/i);
		if (match) {
			result.rawBody = true;
			return;
		}

		match = trimmed.match(/^compare\s+\*arg_(\S+)\s+None$/i);
		if (match) {
			result.required.push(match[1]);
			return;
		}

		match = trimmed.match(/^execute\s+(app\/scripts\/\S+\.gcs)$/i);
		if (match) {
			result.dbScripts.push(match[1]);
			return;
		}

		match = trimmed.match(/^SetVar\s+\*result\s+evaluate\(\{\s*'(msg|message)'\s*:\s*'([^']*)'\s*\}\)/i);
		if (match) {
			if (!['Forbidden', 'Unauthorized'].includes(match[2])) result.message = match[2];
			return;
		}

		if (/^SetVar\s+\*result\s+\*json$/i.test(trimmed)) {
			result.returnsJson = true;
			return;
		}

		const rightMatch = trimmed.match(/hasRight\(\s*'([^']+)'/);
		if (rightMatch) result.rights.push(rightMatch[1]);
	});

	result.params = unique(result.params);
	result.body = unique(result.body);
	result.required = unique(result.required);
	result.rights = unique(result.rights);

	return result;
}

function buildMap() {
	const types = schemaTypes();
	const routes = parseRoutes();

	const endpoints = routes.map((route) => {
		const scriptFile = path.join(ROOT, route.script);
		const script = parseScript(scriptFile);

		const pathParams = route.path.match(/\{(\w+)\}/g)?.map((token) => token.slice(1, -1)) || [];

		const paramFields = pathParams.map((name) => ({
			name,
			type: PARAM_TYPES[name] || types[name] || 'string'
		}));

		let bodyFields = script.body.map((name) => ({
			name,
			type: FIELD_TYPES[name] || types[name] || 'string',
			required: script.required.includes(name)
		}));

		const returns = { kind: null, fields: [] };
		const rawColumns = [];
		const dbFiles = script.dbScripts.map((dbScript) => path.join(ROOT, dbScript));

		dbFiles.forEach((dbFile) => {
			const info = responseFields(dbFile);
			if (info.kind) returns.kind = returns.kind || info.kind;
			info.fields.forEach((field) => returns.fields.push(field));
			updatedColumns(dbFile).forEach((column) => rawColumns.push(column));
		});
		returns.fields = unique(returns.fields);

		// Params read by the script but not in the path are query params.
		const queryFields = script.params
			.filter((name) => !pathParams.includes(name))
			.filter((name) => dbFiles.some((dbFile) => fs.existsSync(dbFile) && read(dbFile).includes(`*arg_${name}`)))
			.map((name) => ({
				name,
				type: PARAM_TYPES[name] || types[name] || 'string'
			}));

		// The whole body is the value itself (ex: PATCH /api/task/notes/{nid}).
		if (script.rawBody) {
			bodyFields = rawColumns.map((name) => ({
				name,
				type: FIELD_TYPES[name] || types[name] || 'string',
				required: true
			}));
		}

		const key = `${route.method} ${route.path}`;

		if (RESPONSE_OVERRIDES[key]) {
			returns.kind = RESPONSE_OVERRIDES[key].kind;
			returns.fields = [...RESPONSE_OVERRIDES[key].fields];
		}

		returns.fields = unique([...(EXTRA_RESPONSE_FIELDS[key] || []), ...returns.fields]);

		return {
			method: route.method,
			path: route.path,
			group: (GROUPS.find((group) => group.match.test(route.path)) || { key: 'other' }).key,
			description: DESCRIPTIONS[key] || `${route.method.toLowerCase()} ${route.path}`,
			isPublic: route.isPublic,
			script: route.script,
			missingScript: !fs.existsSync(scriptFile),
			params: paramFields,
			query: queryFields,
			body: bodyFields,
			rawBody: script.rawBody,
			required: script.required,
			rights: script.rights,
			message: script.message,
			returnsJson: script.returnsJson,
			returns
		};
	});

	return {
		source: 'app/scripts/system/apis.gcs',
		groups: GROUPS.map((group) => ({ key: group.key, label: group.label })),
		endpoints
	};
}

/* ------------------------------------------------------------------ */

/**
 * The api map is also injected in web/actions/userForm.js, the page that copies
 * the prompt. It is done here because the file server only knows the files
 * that existed when the app started, so a new file would need a restart.
 */
function injectMap(map) {
	if (!fs.existsSync(USER_FORM_FILE)) return;

	const content = read(USER_FORM_FILE);
	const start = content.indexOf(BLOCK_START);
	const end = content.indexOf(BLOCK_END);

	if (start === -1 || end === -1) {
		console.log('API_MAP markers not found in web/actions/userForm.js, skipped');
		return;
	}

	const endpoints = map.endpoints.map((endpoint) => `\t${JSON.stringify(endpoint)}`).join(',\n');
	const block = `${BLOCK_START} - generated by tools/generate-api-map.js, do not edit */\n`
		+ `var API_MAP = {\n`
		+ `\t"source": ${JSON.stringify(map.source)},\n`
		+ `\t"groups": ${JSON.stringify(map.groups)},\n`
		+ `\t"endpoints": [\n${endpoints}\n\t]\n`
		+ `};\n${BLOCK_END}`;

	fs.writeFileSync(USER_FORM_FILE, content.slice(0, start) + block + content.slice(end + BLOCK_END.length));
}

const map = buildMap();
fs.writeFileSync(OUT_FILE, `${JSON.stringify(map, null, '\t')}\n`);
injectMap(map);
console.log(`${path.relative(ROOT, OUT_FILE)} written (${map.endpoints.length} endpoints)`);
