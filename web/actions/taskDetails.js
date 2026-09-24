current_task_id = null;
edited_note_id = null;

const PIN_STORAGE_KEY = 'pinnedTasks';

function getPinnedTasks() {
    try {
        return JSON.parse(localStorage.getItem(PIN_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function savePinnedTasks(tasks) {
    localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(tasks));
}

function isTaskPinned(taskId) {
    return getPinnedTasks().some(t => t.id == taskId);
}

function togglePinTask(taskId, taskName) {
    let pinned = getPinnedTasks();
    const index = pinned.findIndex(t => t.id == taskId);
    if (index >= 0) {
        pinned.splice(index, 1);
    } else {
        pinned.push({id: taskId, name: taskName});
    }
    savePinnedTasks(pinned);
}

function updatePinButton() {
    const btn = document.getElementById('pin-btn');
    if (!btn || !current_task_id) return;
    if (isTaskPinned(current_task_id)) {
        btn.classList.add('pinned');
        btn.title = 'Unpin';
    } else {
        btn.classList.remove('pinned');
        btn.title = 'Pin';
    }
}

function togglePin() {
    if (!current_task_id) return;
    const taskName = document.getElementById("title").innerText;
    togglePinTask(current_task_id, taskName);
    updatePinButton();
}

const langagesList = [
    "DFS",
    "abap",
    "abnf",
    "actionscript",
    "ada",
    "adoc",
    "agda",
    "al",
    "antlr4",
    "apacheconf",
    "apex",
    "apl",
    "applescript",
    "aql",
    "arduino",
    "arff",
    "armasm",
    "art",
    "arturo",
    "asciidoc",
    "asm6502",
    "asmatmel",
    "aspnet",
    "atom",
    "autohotkey",
    "autoit",
    "avdl",
    "avisynth",
    "avs",
    "awk",
    "bash",
    "basic",
    "batch",
    "bbcode",
    "bbj",
    "bicep",
    "birb",
    "bison",
    "bnf",
    "bqn",
    "brainfuck",
    "brightscript",
    "bro",
    "bsl",
    "c",
    "cfc",
    "cfscript",
    "chaiscript",
    "cil",
    "cilk",
    "cilkc",
    "cilkcpp",
    "clike",
    "clojure",
    "cmake",
    "cobol",
    "coffee",
    "coffeescript",
    "conc",
    "concurnas",
    "context",
    "cooklang",
    "coq",
    "cpp",
    "crystal",
    "cs",
    "csharp",
    "cshtml",
    "csp",
    "css",
    "csv",
    "cue",
    "cypher",
    "d",
    "dart",
    "dataweave",
    "dax",
    "dhall",
    "diff",
    "django",
    "docker",
    "dockerfile",
    "dot",
    "dotnet",
    "ebnf",
    "editorconfig",
    "eiffel",
    "ejs",
    "elisp",
    "elixir",
    "elm",
    "emacs",
    "emacs-lisp",
    "erb",
    "erlang",
    "eta",
    "etlua",
    "excel-formula",
    "extend",
    "factor",
    "false",
    "firestore-security-rules",
    "flow",
    "fortran",
    "fsharp",
    "ftl",
    "g4",
    "gamemakerlanguage",
    "gap",
    "gawk",
    "gcode",
    "gdscript",
    "gedcom",
    "gettext",
    "gherkin",
    "git",
    "gitignore",
    "glsl",
    "gml",
    "gn",
    "gni",
    "go",
    "go-mod",
    "go-module",
    "gradle",
    "graphql",
    "groovy",
    "gv",
    "haml",
    "handlebars",
    "haskell",
    "haxe",
    "hbs",
    "hcl",
    "hgignore",
    "hlsl",
    "hoon",
    "hpkp",
    "hs",
    "hsts",
    "html",
    "http",
    "ichigojam",
    "icon",
    "icu-message-format",
    "idr",
    "idris",
    "iecst",
    "ignore",
    "inform7",
    "ini",
    "ino",
    "insertBefore",
    "io",
    "j",
    "java",
    "javadoc",
    "javadoclike",
    "javascript",
    "javastacktrace",
    "jexl",
    "jinja2",
    "jolie",
    "jq",
    "js",
    "jsdoc",
    "json",
    "json5",
    "jsonp",
    "jsstacktrace",
    "jsx",
    "julia",
    "keepalived",
    "keyman",
    "kotlin",
    "kt",
    "kts",
    "kum",
    "kumir",
    "kusto",
    "latex",
    "latte",
    "ld",
    "less",
    "lilypond",
    "linker-script",
    "liquid",
    "lisp",
    "livescript",
    "llvm",
    "log",
    "lolcode",
    "lua",
    "ly",
    "magma",
    "makefile",
    "markdown",
    "markup",
    "markup-templating",
    "mata",
    "mathematica",
    "mathml",
    "matlab",
    "maxscript",
    "md",
    "mel",
    "mermaid",
    "metafont",
    "mizar",
    "mongodb",
    "monkey",
    "moon",
    "moonscript",
    "mscript",
    "mustache",
    "n1ql",
    "n4js",
    "n4jsd",
    "nand2tetris-hdl",
    "nani",
    "naniscript",
    "nasm",
    "nb",
    "neon",
    "nevod",
    "nginx",
    "nim",
    "nix",
    "npmignore",
    "nsis",
    "objc",
    "objectivec",
    "objectpascal",
    "ocaml",
    "odin",
    "opencl",
    "openqasm",
    "oscript",
    "oz",
    "parigp",
    "parser",
    "pascal",
    "pascaligo",
    "pbfasm",
    "pcaxis",
    "pcode",
    "peoplecode",
    "perl",
    "php",
    "phpdoc",
    "plain",
    "plaintext",
    "plantuml",
    "plsql",
    "po",
    "powerquery",
    "powershell",
    "pq",
    "processing",
    "prolog",
    "promql",
    "properties",
    "protobuf",
    "psl",
    "pug",
    "puppet",
    "pure",
    "purebasic",
    "purescript",
    "purs",
    "px",
    "py",
    "python",
    "q",
    "qasm",
    "qml",
    "qore",
    "qs",
    "qsharp",
    "r",
    "racket",
    "razor",
    "rb",
    "rbnf",
    "reason",
    "regex",
    "rego",
    "renpy",
    "res",
    "rescript",
    "rest",
    "rip",
    "rkt",
    "roboconf",
    "robot",
    "robotframework",
    "rpy",
    "rq",
    "rss",
    "ruby",
    "rust",
    "sas",
    "sass",
    "scala",
    "scheme",
    "sclang",
    "scss",
    "sh",
    "sh-session",
    "shell",
    "shell-session",
    "shellsession",
    "shortcode",
    "sln",
    "smali",
    "smalltalk",
    "smarty",
    "sml",
    "smlnj",
    "sol",
    "solidity",
    "solution-file",
    "soy",
    "sparql",
    "splunk-spl",
    "sqf",
    "sql",
    "squirrel",
    "ssml",
    "stan",
    "stata",
    "stylus",
    "supercollider",
    "svg",
    "swift",
    "systemd",
    "t4",
    "t4-cs",
    "t4-templating",
    "t4-vb",
    "tap",
    "tcl",
    "tex",
    "text",
    "textile",
    "toml",
    "treeview",
    "tremor",
    "trickle",
    "trig",
    "troy",
    "ts",
    "tsconfig",
    "tsx",
    "tt2",
    "turtle",
    "twig",
    "txt",
    "typescript",
    "typoscript",
    "uc",
    "unrealscript",
    "uorazor",
    "uri",
    "url",
    "uscript",
    "v",
    "vala",
    "vb",
    "vba",
    "vbnet",
    "velocity",
    "verilog",
    "vhdl",
    "vim",
    "visual-basic",
    "warpscript",
    "wasm",
    "web-idl",
    "webidl",
    "webmanifest",
    "wgsl",
    "wiki",
    "wl",
    "wolfram",
    "wren",
    "xeora",
    "xeoracube",
    "xls",
    "xlsx",
    "xml",
    "xojo",
    "xquery",
    "yaml",
    "yang",
    "yml",
    "zig"
];

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById("noteCreation").style.display = 'none';
    const params = new URLSearchParams(window.location.search);
    current_task_id = params.get('no');

    if (current_task_id) {
		globalLoaderComponent.render(true);
        getTask(current_task_id).then((task) => {
            const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Feedback", "Delivered", "Abandoned"];

            document.getElementById("title").innerText = task.name;
            updatePinButton();
            setTimeout(() => {
                const descEl = document.getElementById("description");
                descEl.innerText = task.description;
                Prism.highlightElement(descEl);
            }, 0);
            document.getElementById("status").innerText = statuses[task.status];
            document.getElementById("status").classList.add(statuses[task.status]);

			if (task.status == 2) {
				document.getElementById('progress-section').hidden = false;
				document.getElementById('action_bar').hidden = false;
				updateProgress(task.progress || 0);
			} else {
				document.getElementById('progress-section').hidden = true;
				document.getElementById('action_bar').hidden = true;
			}
            getCategory(task.category_id).then((category) => {
                document.getElementById("category").innerText = category.name;

                const allowedStatuses = category.allowed_statuses && category.allowed_statuses.length > 0
                    ? category.allowed_statuses
                    : [0, 1, 2, 3, 4, 5, 6, 7, 8];

                const statusButtons = document.querySelectorAll('#status + .line button');
                if (allowedStatuses.length <= 1) {
                    statusButtons.forEach(btn => btn.style.display = 'none');
                } else {
                    if (task.status == STATUS.NEW) {
                        if (allowedStatuses.includes(STATUS.TODO)) document.getElementById("todo").style.display = 'block';
                        if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                    } else if (task.status == STATUS.PAUSED) {
                        if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                    } else if (task.status == STATUS.STARTED) {
                        if (allowedStatuses.includes(STATUS.PAUSED)) document.getElementById("pause").style.display = 'block';
                        if (allowedStatuses.includes(STATUS.ABANDONED)) document.getElementById("abandon").style.display = 'block';
                        if (allowedStatuses.includes(STATUS.FINISHED)) document.getElementById("finish").style.display = 'block';
                    } else if (task.status == STATUS.TESTING) {
                        if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                        if (allowedStatuses.includes(STATUS.FINISHED)) document.getElementById("finish").style.display = 'block';
                    } else if (task.status == STATUS.TODO) {
                        if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                    } else if (task.status == STATUS.FINISHED) {
                        if (allowedStatuses.includes(STATUS.FEEDBACK)) document.getElementById("feedback").style.display = 'block';
                        if (allowedStatuses.includes(STATUS.DELIVERED)) document.getElementById("delivered").style.display = 'block';
                    } else if (task.status == STATUS.FEEDBACK) {
                        if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                    }
                }

                // Check evaluation validation for external projects
                if (task.project_id) {
                    getProject(task.project_id).then((project) => {
                        if (project && project.external && task.evaluated_hours != null) {
                            const evalSection = document.getElementById("evaluation-section");
                            const evalBlocked = document.getElementById("evaluation-blocked");
                            const evalHours = document.getElementById("evaluated-hours");
                            const evalStatus = document.getElementById("evaluation-validated");

                            evalHours.innerText = task.evaluated_hours;
                            evalSection.style.display = 'block';

                            if (!task.evaluation_validated) {
                                evalStatus.innerText = 'Non';
                                evalBlocked.style.display = 'block';

                                statusButtons.forEach(btn => btn.style.display = 'none');

                                if (hasRight('validate_task_evaluation')) {
                                    document.getElementById("validate-evaluation").style.display = 'block';
                                }
                            } else {
                                evalStatus.innerText = 'Oui';
                            }
                        }
                    }).catch(() => {});
                }
            })

            document.getElementById("parent-project").addEventListener('click', () => {
                openProject(task.project_id);
            });

            getWorkersByTask(current_task_id).then((workers) => {
                workers.forEach(worker => {
                    preloadUser(worker);
                });
            });

            getNotesByTask(current_task_id).then((notes) => {
                notes.forEach(note => {
                    preloadNote(note);
                });
                refreshPrismStyles();
                globalLoaderComponent.render(false);
            });

            getResourcesByTask(current_task_id).then((resources) => {
                resources.forEach(resource => {
                    preloadResource(resource);
                });
            });

            todo_btn = document.getElementById("todo");
            abandon_btn = document.getElementById("abandon");
            start_btn = document.getElementById("start");
            pause_btn = document.getElementById("pause");
            test_btn = document.getElementById("test");
            finish_btn = document.getElementById("finish");
            feedback_btn = document.getElementById("feedback");
            delivered_btn = document.getElementById("delivered");

            document.getElementById("todo").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.TODO).then(() => {
                    location.reload();
                })
            });

            document.getElementById("abandon").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.ABANDONED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("start").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.STARTED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("pause").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.PAUSED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("test").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.TESTING).then(() => {
                    location.reload();
                })
            });

            document.getElementById("finish").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.FINISHED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("feedback").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.FEEDBACK).then(() => {
                    location.reload();
                })
            });

            document.getElementById("delivered").addEventListener('click', () => {
                changeTaskStatus(current_task_id, STATUS.DELIVERED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("validate-evaluation").addEventListener('click', () => {
                validateTaskEvaluation(current_task_id).then(() => {
                    location.reload();
                })
            });

            const select = document.getElementById("noteType");

            function capitalize(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            langagesList.forEach((lang, index) => {
                const option = document.createElement("option");
                option.value = lang;              // valeur envoyée
                option.textContent = capitalize(lang); // texte affiché
                if (capitalize(lang) === "Markdown") option.selected = true;
                select.appendChild(option);
            });

        });
    }
});

function preloadUser(user) {
    const li = document.createElement('li');
    li.setAttribute('data-id', user.id);
    const editp = `<i class="fas fa-edit icon" title="Edit" onclick="editUser(this.parentElement)"></i>`;
    const delp = `<i class="fas fa-trash icon" title="Delete" onclick="removeUser(this.parentElement)"></i>`;
    li.innerHTML = `
        ${user.username}
        ${hasRight('update_user') ? editp : ''}
        ${hasRight('delete_user') ? delp : ''}
    `;
    let userList = document.getElementById("users-list");
    userList.appendChild(li);
}

function copyTask(){
	getTask(current_task_id).then((task) => {
		let text = `----------\n Task name : `;
		text += task.name;
		text += `\n----------\n Description : `;
		text += task.description;
		text += `\n----------\n`;
	  navigator.clipboard.writeText(text)
		.then(() => {
		  alert('Task copied successfully!');
		})
		.catch(err => {
		  alert('Failed to copy task: ', err);
		});
	});
}

function editUser(element) {
    let userId = element.getAttribute('data-id');
}

function removeUser(element) {
    let rightId = element.getAttribute('data-id');
    dropUserRight(current_user_id, rightId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function removeNote(element) {
    let noteId = element.getAttribute('data-id');
    dropNote(current_task_id, noteId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function validateUser(element) {
    if (element.selectedItem) {
        affectWorkerToTask(current_task_id, element.selectedItem);

        const li = document.createElement('li');
        li.setAttribute('data-id', element.selectedItem);
        const editp = `<i class="fas fa-edit icon" title="Edit" onclick="editUser(this.parentElement)"></i>`;
        const delp = `<i class="fas fa-trash icon" title="Delete" onclick="removeUser(this.parentElement)"></i>`;
        li.innerHTML = `
            ${element.selectedValue}
            ${hasRight('update_user') ? editp : ''}
            ${hasRight('delete_user') ? delp : ''}
        `;

        let userList = document.getElementById("users-list");
        userList.appendChild(li);

        element.popup.style.display = 'none';
        element.searchInput.value = '';
        element.resultList.innerHTML = '';
        element.selectedItem = null;
    } else {
        alert("Veuillez sélectionner un élément.");
    }
}

function openProject(id) {
    redirect("projectDetails.html", true, [["no", id]]);
}

function preloadNote(note) {
    const li = document.createElement('li');
    li.setAttribute('data-id', note.id);
    const deln = `<i class="fas fa-trash icon" title="Delete" onclick="removeNote(this.parentElement)"></i>`;
    const updn = `<i class="fas fa-edit icon" title="Update" onclick="createNoteWithId(${note.id})"></i>`;

    const author = note.creator || '';
    const createDate = note.create_date ? new Date(note.create_date.replace(' ', 'T') + 'Z').toLocaleString('fr-FR') : '';
    const editDate = note.edit_date ? new Date(note.edit_date.replace(' ', 'T') + 'Z').toLocaleString('fr-FR') : '';
    const showEdit = editDate && editDate !== createDate;

    li.innerHTML = `
        <div class="note-meta">
            <span class="note-author">By ${author}, </span>
            <span class="note-date" style="margin-left: 1px">
                Created at ${createDate}${showEdit ? ' · Edited at ' + editDate : ''}
            </span>
        </div>
        <pre class="note-code">
            <code class="language-${note.type}">
                ${note.description}
            </code>
        </pre>
        ${hasRight('delete_note') ? deln : ''}
        ${hasRight('update_note') ? updn : ''}
    `;
    let list = document.getElementById("notes-list");
    list.appendChild(li);
    return li;
}

function preloadResource(resource) {
    const li = document.createElement('li');
    li.setAttribute('data-id', resource.id);
    const see = `<i class="fas fa-eye icon" title="Edit" onclick="seeResource(this.parentElement)"></i>`;
    const down = `<i class="fas fa-download icon" title="Download" onclick="download('${resource.path}')"></i>`;
    const delr = `<i class="fas fa-trash icon" title="Delete" onclick="removeResource(this.parentElement)"></i>`;
    li.innerHTML = `
        ${resource.path}
        ${hasRight('read_ressource') ? see : ''}
        ${hasRight('download_ressource') ? down : ''}
        ${hasRight('delete_ressource') ? delr : ''}
    `;

    let list = document.getElementById("ressources-list");
    list.appendChild(li);
}

const taskReportStatuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Feedback", "Delivered", "Abandoned"];
const taskReportStatusColors = {
    New: '#acaa21', Todo: '#0caded', Started: '#a810f0', Paused: '#0eacec',
    Testing: '#ceaaad', Finished: '#0ada91', Feedback: '#f59c0b', Delivered: '#6366f1', Abandoned: '#900010'
};
const taskReportEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeTaskReportValue(value) {
    return (value === null || value === undefined ? '' : String(value)).replace(/[&<>"']/g, char => taskReportEntities[char]);
}

function readTaskReportPath(object, path) {
    return path.split('.').reduce((value, key) => {
        return value && typeof value === 'object' && value[key] !== undefined ? value[key] : undefined;
    }, object);
}

function parseTaskReportDate(value) {
    if (value === null || value === undefined || value === '') return null;
    const date = value instanceof Date ? value : new Date(String(value).replace(' ', 'T'));
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatTaskReportDate(value) {
    const date = parseTaskReportDate(value);
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTaskReportDateTime(value) {
    const date = parseTaskReportDate(value);
    if (!date) return 'N/A';
    return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function taskReportList(value) {
    return Array.isArray(value) ? value : [];
}

function taskReportStatusBadge(statusName) {
    const color = taskReportStatusColors[statusName] || '#666';
    return `<span class="status-badge" style="background:${color}">${escapeTaskReportValue(statusName)}</span>`;
}

function taskReportStatusName(task) {
    const index = Number(task.status);
    return taskReportStatuses[index] || 'N/A';
}

function taskReportProgress(task) {
    const raw = task.progress !== undefined ? task.progress : task.progression;
    const progress = Number(raw);
    if (!Number.isFinite(progress)) return 0;
    return Math.max(0, Math.min(100, progress));
}

function taskReportAllowedStatusValues(category) {
    const raw = category && category.allowed_statuses;
    if (!raw) return [];
    const values = Array.isArray(raw) ? raw : String(raw).split(',').map(segment => parseInt(segment.trim(), 10));
    return values.map(index => taskReportStatuses[Number(index)]).filter(name => Boolean(name));
}

function taskReportPage(content, pageNumber, refCode) {
    return `<section class="page">
<div class="page-footer"><span>Task Manager</span><span>Page ${pageNumber}</span><span>${escapeTaskReportValue(refCode)}</span></div>
${content}
</section>`;
}

async function generateTaskReport() {
    if (!current_task_id) {
        alert('No task selected.');
        return;
    }

    if (typeof html2pdf === 'undefined') {
        alert('The PDF export library is not available.');
        return;
    }

    if (typeof globalLoaderComponent !== 'undefined' && globalLoaderComponent) {
        globalLoaderComponent.render(true);
    }

    try {
        const task = await getTask(current_task_id);
        if (!task) {
            throw new Error('Task not found.');
        }

        const [category, project, workers, notes, resources] = await Promise.all([
            task.category_id ? getCategory(task.category_id).catch(() => null) : Promise.resolve(null),
            task.project_id ? getProject(task.project_id).catch(() => null) : Promise.resolve(null),
            getWorkersByTask(current_task_id),
            getNotesByTask(current_task_id),
            getResourcesByTask(current_task_id)
        ]);

        const categoryAvailable = category && typeof category === 'object' && category.id !== undefined;
        const projectAvailable = project && typeof project === 'object' && project.id !== undefined;

        const statusName = taskReportStatusName(task);
        const progress = taskReportProgress(task);
        const workerList = taskReportList(workers);
        const noteList = taskReportList(notes);
        const resourceList = taskReportList(resources);

        const now = new Date();
        const reportDate = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
        const refCode = `TSK/${task.id}/${now.getFullYear()}/${String(workerList.length).padStart(2, '0')}${String(noteList.length).padStart(2, '0')}${String(resourceList.length).padStart(2, '0')}`;

        const taskName = escapeTaskReportValue(task.name);
        const taskDescription = escapeTaskReportValue(task.description);
        const categoryName = categoryAvailable ? escapeTaskReportValue(category.name) : (task.category_id ? escapeTaskReportValue(task.category_id) : 'N/A');
        const creatorName = escapeTaskReportValue(readTaskReportPath(task, 'creator.username') || 'N/A');
        const creatorEmail = escapeTaskReportValue(readTaskReportPath(task, 'creator.email') || 'N/A');
        const taskCreated = formatTaskReportDate(task.create_date);
        const startDate = formatTaskReportDate(task.start_date);
        const endDate = formatTaskReportDate(task.end_date);
        const taskActive = task.active === false ? 'No' : 'Yes';
        const scheduleState = !task.end_date ? 'No end date' : computeScheduleState(task, now);
        const allowedStatusText = taskReportAllowedStatusValues(category).join(', ') || 'Not specified';
        const categoryDescription = categoryAvailable ? escapeTaskReportValue(category.description) : 'No category description available.';
        const categoryTarget = categoryAvailable ? escapeTaskReportValue(category.target) : 'N/A';

        const projectName = projectAvailable ? (project.name ? escapeTaskReportValue(project.name) : `Project #${escapeTaskReportValue(project.id)}`) : (task.project_id ? `Project #${escapeTaskReportValue(task.project_id)}` : 'Not assigned');
        const projectStatus = projectAvailable ? taskReportStatusBadge(taskReportStatuses[Number(project.status)] || 'N/A') : 'N/A';
        const projectDescription = projectAvailable && project.description ? escapeTaskReportValue(project.description) : 'No project description available.';
        const projectCategory = projectAvailable ? (project.category_name ? escapeTaskReportValue(project.category_name) : (project.category_id ? escapeTaskReportValue(project.category_id) : 'N/A')) : 'N/A';
        const projectStart = projectAvailable ? formatTaskReportDate(project.start_date) : 'N/A';
        const projectEnd = projectAvailable ? formatTaskReportDate(project.end_date) : 'N/A';
        const projectCreated = projectAvailable ? formatTaskReportDate(project.create_date) : 'N/A';
        const projectHourlyRate = projectAvailable && project.hourly_rate != null ? escapeTaskReportValue(project.hourly_rate) : 'N/A';
        const projectExternal = projectAvailable ? (project.external ? 'Yes' : 'No') : 'N/A';
        const evaluatedHours = task.evaluated_hours != null ? escapeTaskReportValue(task.evaluated_hours) : 'Not evaluated';
        const evaluationValidated = task.evaluated_hours != null ? (task.evaluation_validated ? 'Yes' : 'No') : 'N/A';

        const workerRows = workerList.length
            ? workerList.map(worker => `<tr><td>${escapeTaskReportValue(worker.id)}</td><td>${escapeTaskReportValue(worker.username)}</td><td style="text-align:center;">Yes</td></tr>`).join('')
            : '<tr><td colspan="3" style="text-align:center;">No workers assigned to this task.</td></tr>';

        const resourceRows = resourceList.length
            ? resourceList.map(resource => `<tr><td>${escapeTaskReportValue(resource.id)}</td><td>${escapeTaskReportValue(resource.path)}</td></tr>`).join('')
            : '<tr><td colspan="2" style="text-align:center;">No resources attached to this task.</td></tr>';

        const notePages = noteList.map((note, index) => {
            const noteType = escapeTaskReportValue(note.type || 'text');
            const noteCreated = formatTaskReportDateTime(note.create_date);
            const noteEdited = note.edit_date && note.edit_date !== note.create_date ? formatTaskReportDateTime(note.edit_date) : null;
            const noteMeta = [];
            if (note.creator !== undefined && note.creator !== null) noteMeta.push(`Creator #${escapeTaskReportValue(note.creator)}`);
            noteMeta.push(`Created ${noteCreated}`);
            if (noteEdited) noteMeta.push(`Edited ${noteEdited}`);

            return taskReportPage(`
<div class="section">
  <div class="section-header">Note ${escapeTaskReportValue(index + 1)} of ${escapeTaskReportValue(noteList.length)}</div>
  <div class="section-content">
    <div class="note-meta">${noteMeta.join(' · ')}</div>
    <pre class="report-code">${escapeTaskReportValue(note.description)}</pre>
    <p style="font-size:10px;">Language: <code class="language-${noteType.toLowerCase().replace(/[^a-z0-9_-]/g, '')}">${noteType}</code></p>
  </div>
</div>
`, index + 2, refCode);
        });

        const pages = [];
        let pageNumber = 1;

        pages.push(taskReportPage(`
<div class="official-header">
  <h1>Task Manager - Task Report</h1>
  <p class="subtitle">Confidential operational record</p>
  <div class="divider"></div>
</div>
<div class="document-title">
  <h2>${taskName}</h2>
  <p class="subtitle">Task #${escapeTaskReportValue(task.id)} &middot; ${categoryName}</p>
</div>
<div class="doc-info">
  <div class="doc-info-item"><label>Reference</label><div class="value">${escapeTaskReportValue(refCode)}</div></div>
  <div class="doc-info-item"><label>Date Issued</label><div class="value">${reportDate}</div></div>
  <div class="doc-info-item"><label>Classification</label><div class="value">Confidential</div></div>
  <div class="doc-info-item"><label>Task ID</label><div class="value">#${escapeTaskReportValue(task.id)}</div></div>
</div>
<div style="padding:15px;background:#fff9e6;border-left:4px solid var(--gold);">
  <p style="font-size:11px;line-height:1.6;"><strong>Important note:</strong> This document contains confidential information intended exclusively for project stakeholders. Unauthorized disclosure is strictly prohibited.</p>
</div>
`, pageNumber++, refCode));

        pages.push(taskReportPage(`
<div class="section">
  <div class="section-header">I. Executive Summary</div>
  <div class="section-content">
    <p style="margin-bottom:15px;"><strong>Task:</strong> ${taskName}</p>
    <p style="margin-bottom:15px;"><strong>Description:</strong></p>
    <pre class="report-description">${taskDescription || 'No description available.'}</pre>
    <p style="margin-bottom:15px;"><strong>Creator:</strong> ${creatorName} ${creatorEmail ? `(${creatorEmail})` : ''}</p>
    <p style="margin-bottom:15px;"><strong>Category:</strong> ${categoryName}${categoryAvailable ? ` (${escapeTaskReportValue(category.target)} / ${allowedStatusText})` : ''}</p>
    <p style="margin-bottom:15px;"><strong>Parent Project:</strong> ${projectName}</p>
    <p style="margin-bottom:15px;"><strong>Current Status:</strong> ${taskReportStatusBadge(statusName)}</p>
    <p style="margin-bottom:15px;"><strong>Schedule:</strong> ${scheduleState} (planned start: ${startDate}, planned end: ${endDate})</p>
    <p style="margin-bottom:15px;"><strong>Progression:</strong> ${progress}%</p>
  </div>
</div>
<div class="section">
  <div class="section-header">II. Key Indicators</div>
  <div class="stats-grid">
    <div class="stat-box"><div class="number">${escapeTaskReportValue(workerList.length)}</div><div class="label">Assigned Workers</div></div>
    <div class="stat-box"><div class="number">${escapeTaskReportValue(noteList.length)}</div><div class="label">Notes</div></div>
    <div class="stat-box"><div class="number">${escapeTaskReportValue(resourceList.length)}</div><div class="label">Resources</div></div>
    <div class="stat-box"><div class="number">${progress}%</div><div class="label">Progress</div></div>
  </div>
</div>
`, pageNumber++, refCode));

        pages.push(taskReportPage(`
<div class="section">
  <div class="section-header">III. Task Information</div>
  <table class="info-table">
    <tbody>
      <tr><td>Task ID</td><td>#${escapeTaskReportValue(task.id)}</td></tr>
      <tr><td>Name</td><td>${taskName}</td></tr>
      <tr><td>Status</td><td>${taskReportStatusBadge(statusName)}</td></tr>
      <tr><td>Creator</td><td>${creatorName} ${creatorEmail ? `(${creatorEmail})` : ''}</td></tr>
      <tr><td>Category</td><td>${categoryName}</td></tr>
      <tr><td>Parent Project</td><td>${projectName}</td></tr>
      <tr><td>Planned Start</td><td>${startDate}</td></tr>
      <tr><td>Planned End</td><td>${endDate}</td></tr>
      <tr><td>Creation Date</td><td>${taskCreated}</td></tr>
      <tr><td>Active</td><td>${taskActive}</td></tr>
      <tr><td>Progression</td><td>${progress}%</td></tr>
       <tr><td>Schedule</td><td>${scheduleState}</td></tr>
       <tr><td>Evaluated Hours</td><td>${evaluatedHours}</td></tr>
       <tr><td>Evaluation Validated</td><td>${evaluationValidated}</td></tr>
    </tbody>
  </table>
</div>
<div class="section">
  <div class="section-header">IV. Category Details</div>
  <table class="info-table">
    <tbody>
      <tr><td>Category</td><td>${categoryName}</td></tr>
      <tr><td>Target</td><td>${categoryTarget}</td></tr>
      <tr><td>Allowed Statuses</td><td>${allowedStatusText}</td></tr>
    </tbody>
  </table>
  <p style="font-size:11px;line-height:1.6;padding:0 15px;">${categoryDescription || 'No category description available.'}</p>
</div>
`, pageNumber++, refCode));

        if (projectAvailable) {
            pages.push(taskReportPage(`
<div class="section">
  <div class="section-header">V. Project Context</div>
  <table class="info-table">
    <tbody>
      <tr><td>Project ID</td><td>#${escapeTaskReportValue(project.id)}</td></tr>
      <tr><td>Name</td><td>${projectName}</td></tr>
      <tr><td>Status</td><td>${projectStatus}</td></tr>
      <tr><td>Category</td><td>${projectCategory}</td></tr>
      <tr><td>Start Date</td><td>${projectStart}</td></tr>
      <tr><td>End Date</td><td>${projectEnd}</td></tr>
      <tr><td>Creation Date</td><td>${projectCreated}</td></tr>
      <tr><td>Hourly Rate</td><td>${projectHourlyRate}</td></tr>
      <tr><td>External</td><td>${projectExternal}</td></tr>
    </tbody>
  </table>
  <p style="font-size:11px;line-height:1.6;padding:0 15px;">${projectDescription || 'No project description available.'}</p>
</div>
`, pageNumber++, refCode));
        }

        if (workerList.length > 0) {
            pages.push(taskReportPage(`
<div class="section">
  <div class="section-header">Assigned Team (${workerList.length})</div>
  <table>
    <thead><tr><th>#</th><th>Username</th><th>Active</th></tr></thead>
    <tbody>
      ${workerRows}
    </tbody>
  </table>
</div>
`, pageNumber++, refCode));
        }

        pages.push(...notePages);

        if (resourceList.length > 0) {
            pages.push(taskReportPage(`
<div class="section">
  <div class="section-header">Resources (${resourceList.length})</div>
  <table>
    <thead><tr><th>#</th><th>Path</th></tr></thead>
    <tbody>
      ${resourceRows}
    </tbody>
  </table>
</div>
`, pageNumber++, refCode));
        }

        pages.push(taskReportPage(`
<div class="section">
  <div class="section-header">Approval</div>
  <div class="signature-block">
    <div class="signature"><div class="title">Prepared by</div><div class="name">Task Manager - Auto-generated</div></div>
  </div>
</div>
`, pageNumber, refCode));

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Task Report - ${taskName}</title>
<style>
:root { --primary:#1a1a2e; --secondary:#16213e; --accent:#0f3460; --gold:#c5a572; --light:#f8f9fa; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Times New Roman',serif; background:#e8e8e8; padding:20px; color:var(--primary); position:relative; }
body::before { content:'CONFIDENTIAL'; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-45deg); font-size:120px; font-weight:bold; color:rgba(197,165,114,0.08); z-index:0; pointer-events:none; white-space:nowrap; }
.no-print { text-align:center; margin-bottom:20px; }
button { padding:12px 30px; background:var(--accent); color:white; border:none; font-size:16px; border-radius:4px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.2); }
button:hover { background:var(--secondary); }
.page { background:white; width:210mm; min-height:297mm; margin:0 auto 20px; padding:25mm 20mm; box-shadow:0 0 15px rgba(0,0,0,0.2); position:relative; z-index:1; page-break-after:always; break-after:page; }
.official-header { border:3px double var(--gold); padding:20px; margin-bottom:30px; text-align:center; background:linear-gradient(to bottom,#fff 0%,#f9f9f9 100%); }
.official-header h1 { font-size:16px; text-transform:uppercase; letter-spacing:2px; color:var(--primary); margin-bottom:5px; }
.official-header .subtitle { font-size:14px; color:var(--accent); margin-bottom:10px; }
.official-header .divider { width:200px; height:2px; background:var(--gold); margin:10px auto; }
.doc-info { display:flex; justify-content:space-between; margin-bottom:30px; padding:15px; background:#f8f9fa; border-left:4px solid var(--gold); flex-wrap:wrap; gap:10px; }
.doc-info-item { flex:1; min-width:120px; }
.doc-info-item label { font-weight:bold; font-size:11px; color:var(--accent); text-transform:uppercase; }
.doc-info-item .value { font-size:13px; margin-top:3px; }
.document-title { text-align:center; margin:40px 0; padding:20px; background:var(--accent); color:white; }
.document-title h2 { font-size:24px; letter-spacing:1px; text-transform:uppercase; }
.document-title .subtitle { font-size:14px; margin-top:10px; opacity:0.9; }
.section { margin-bottom:30px; }
.section-header { background:var(--secondary); color:white; padding:10px 15px; font-size:14px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin-bottom:15px; }
.section-content { padding:0 15px; text-align:justify; line-height:1.8; font-size:12px; }
.report-description { white-space:pre-wrap; background:#f8f9fa; border:1px solid #ddd; border-radius:4px; padding:12px; font-size:11px; line-height:1.6; word-break:break-word; }
.report-code { white-space:pre-wrap; background:#1e1e2e; color:#d4d4d4; border-radius:4px; padding:12px; font-size:11px; line-height:1.5; word-break:break-word; overflow-x:auto; }
table { width:100%; border-collapse:collapse; margin:20px 0; font-size:11px; }
th { background:var(--accent); color:white; padding:12px 8px; text-align:left; font-weight:bold; text-transform:uppercase; font-size:10px; letter-spacing:0.5px; }
td { padding:10px 8px; border-bottom:1px solid #ddd; }
tr:nth-child(even) { background:#f8f9fa; }
tr:hover { background:#e8f4f8; }
.page-footer { position:absolute; bottom:15mm; left:20mm; right:20mm; border-top:2px solid var(--gold); padding-top:10px; font-size:10px; color:#666; display:flex; justify-content:space-between; }
.signature-block { margin-top:50px; display:flex; justify-content:space-between; }
.signature { text-align:center; flex:1; }
.signature .title { font-weight:bold; margin-bottom:60px; font-size:12px; text-transform:uppercase; }
.signature .name { border-top:2px solid #333; padding-top:10px; font-size:11px; }
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:15px; margin:20px 0; }
.stat-box { background:linear-gradient(135deg,var(--accent)0%,var(--secondary)100%); color:white; padding:20px; text-align:center; border-radius:5px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
.stat-box .number { font-size:32px; font-weight:bold; margin-bottom:5px; }
.stat-box .label { font-size:11px; opacity:0.9; text-transform:uppercase; }
.status-badge { display:inline-block; padding:3px 10px; border-radius:3px; color:white; font-size:10px; font-weight:bold; text-transform:uppercase; }
.info-table { width:100%; margin:20px 0; }
.info-table td { padding:8px 12px; border:none; }
.info-table tr:nth-child(even) { background:transparent; }
.info-table td:first-child { font-weight:bold; color:var(--accent); width:40%; text-transform:uppercase; font-size:10px; }
.note-meta { font-size:10px; color:#666; margin-bottom:8px; }
@media print { body { background:white; padding:0; } body::before { color:rgba(197,165,114,0.05); } .no-print { display:none; } .page { margin:0; box-shadow:none; page-break-after:always; } .page-footer { position:fixed; bottom:15mm; } thead { display:table-header-group; } tr { page-break-inside:avoid; } }
</style>
</head>
<body>
<div class="no-print"><button onclick="window.print()">Print Report</button></div>
${pages.join('')}
</body>
</html>`;

        const reportWindow = window.open('', '_blank');
        if (reportWindow) {
            reportWindow.document.write(html);
            reportWindow.document.close();
        } else {
            alert('Unable to open the report preview. Please allow pop-ups for this site.');
        }
    } catch (error) {
        console.error('Error generating report:', error);
        alert('An error occurred while generating the report!');
    } finally {
        if (typeof globalLoaderComponent !== 'undefined' && globalLoaderComponent) {
            globalLoaderComponent.render(false);
        }
    }
}

function computeScheduleState(task, now) {
    const endDate = parseTaskReportDate(task.end_date);
    const statusIndex = Number(task.status);
    if (!endDate) return 'No end date';
    const completedStatuses = [5, 6, 7, 8];
    if (completedStatuses.includes(statusIndex)) return 'Completed';
    if (!Number.isNaN(endDate.getTime()) && endDate < now) return 'Overdue';
    return 'On schedule';
}

function download(path) {
    downloadRessource(path);
}

function changeNote(note) {
    const li = document.querySelector(`li[data-id="${note.id}"]`);
    console.log(li.outerHTML);

    const code = li.querySelector("code");

    code.className = `language-${note.type}`;
    code.textContent = note.description;

    Prism.highlightElement(code);

    return li;
}

function saveNote() {
    let note = document.getElementById("newNote").value;
    let noteType = document.getElementById("noteType").value;

    document.getElementById("newNote").value = '';
    document.getElementById("noteCreation").style.display = 'none';
    globalLoaderComponent.render(true);
    
    if (edited_note_id == null) {
		addNoteToTask(current_task_id, note, noteType).then((note) => {
			const noteElement = preloadNote(note);
			const codeBlocks = noteElement.querySelectorAll("code");

			codeBlocks.forEach(code => {
				Prism.highlightElement(code);
				code.classList.add("my-class");
			});
			globalLoaderComponent.render(false);
		});
	} else {
		updateNote(edited_note_id, note).then((note) => {
			globalLoaderComponent.render(false);
            location.reload();
			/*const noteElement = changeNote(note);
			const codeBlocks = noteElement.querySelectorAll("code");

			codeBlocks.forEach(code => {
				Prism.highlightElement(code);
				code.classList.add("my-class");
			});*/
		});
	}
}

function seeResource(element) {
    let resId = element.getAttribute('data-id');

	globalLoaderComponent.render(true);
    getRessource(resId).then((resource) => {
        path = resource.path;
        getRessourceUrl(path).then((url) => {
			globalLoaderComponent.render(false);
            const popup = window.open('', 'popup', 'width=600,height=400,scrollbars=yes');
            if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif') || path.endsWith('.webp')) {
                const img = document.createElement('img');
                img.src = url;
                img.style.width = '100%';
                popup.document.body.appendChild(img);
            } else if (path.endsWith('.pdf')) {
                const canvas = document.createElement('canvas');
                canvas.id = 'pdf-canvas';
                const context = canvas.getContext('2d');

                function renderPage(pdf, pageNum) {
                    pdf.getPage(pageNum).then(page => {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale: scale });

                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');

                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        popup.document.body.appendChild(canvas);

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };

                        page.render(renderContext);
                    });

                }

                pdfjsLib.getDocument(url).promise.then(pdf => {
                    const numPages = pdf.numPages;

                    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                        renderPage(pdf, pageNum);
                    }
                }).catch(error => {
                    console.error('Erreur lors du chargement du PDF :', error);
                });
            } else {
                fetch(url)
                    .then(response => response.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onload = function () {
                            const pre = document.createElement("pre");

                            const code = document.createElement("code");
                            code.classList.add('language-javascript');
                            code.textContent = reader.result;
                            Prism.highlightElement(code);

                            pre.appendChild(code);
                            pre.style.background = 'white';
                            pre.style.color = 'black';
                            popup.document.body.appendChild(pre);
                        };
                        reader.readAsText(blob);
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération du fichier texte :", error);
                    });
            }
        });
    })
}

function removeResource(element) {
    let resId = element.getAttribute('data-id');
    dropTaskResource(current_task_id, resId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function createNote() {
    document.getElementById("noteCreation").style.display = 'block';
    document.getElementById("createNoteButton").text = 'Create Note';
    redirect('#noteCreation');
}

function createNoteWithId(noteId) {
	edited_note_id = noteId;
    document.getElementById("noteCreation").style.display = 'block';
    document.getElementById("createNoteButton").textContent = 'Update Note';
    redirect('#noteCreation');
}

function uploadFileAsResource() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];

	globalLoaderComponent.render(true);
    uploadRessource(file).then((path) => {
        saveRessource('tr-' + current_task_id, path).then((response) => {
			if (response != null) {
				assignLastResourceToTask(current_task_id).then(() => {
					globalLoaderComponent.render(false);
					alert("Resource successfully added !");
					location.reload();
				})
			}
			else {
				alert("Resource upload failed !");
			}
        })
    })
});

function refreshPrismStyles() {
    // To highlight all elements with the 'language-' class
    console.time("Prism");
    Prism.highlightAll();
    console.timeEnd("Prism");

    const codeElements = document.querySelectorAll('.language-javascript');

    codeElements.forEach(el => {
        el.classList.add('my-class');
    });
}

const progressInput = document.getElementById("progress-input");
const progressBar = document.getElementById("progress-bar");
const progressValue = document.getElementById("progress-value");

function updateProgress(value) {
    progressBar.style.width = value + "%";
    progressValue.textContent = value + "%";

    if (value < 30) {
        progressBar.style.background = "#ef4444";
    } else if (value < 70) {
        progressBar.style.background = "#f59e0b";
    } else {
        progressBar.style.background = "#22c55e";
    }

    changeTaskProgress(current_task_id, value);
}

progressInput.addEventListener("change", (e) => {
    updateProgress(e.target.value);
});
