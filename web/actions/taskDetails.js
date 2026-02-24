current_task_id = null;

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
        getTask(current_task_id).then((task) => {
            const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Abandoned"];

            document.getElementById("title").innerText = task.name;
            document.getElementById("description").innerText = task.description;
            document.getElementById("status").innerText = statuses[task.status];
            document.getElementById("status").classList.add(statuses[task.status]);
            updateProgress(task.progress || 0);
            getCategory(task.category_id).then((category) => {
                document.getElementById("category").innerText = category.name;
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

            if (task.status == STATUS.NEW) {
                todo_btn.style.display = 'block';
                start_btn.style.display = 'block';
            } else if (task.status == STATUS.PAUSED) {
                start_btn.style.display = 'block';
            } else if (task.status == STATUS.STARTED) {
                pause_btn.style.display = 'block';
                start_btn.style.display = 'block';
                abandon_btn.style.display = 'block';
                finish_btn.style.display = 'block';
            } else if (task.status == STATUS.TESTING) {
                start_btn.style.display = 'block';
                finish_btn.style.display = 'block';
            } else if (task.status == STATUS.TODO) {
                start_btn.style.display = 'block';
            }

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
    li.innerHTML = `
        <pre class="note-code">
            <code class="language-${note.type}">
                ${note.description}
            </code>
        </pre>
        ${hasRight('delete_note') ? deln : ''}
    `;
    let list = document.getElementById("notes-list");
    list.appendChild(li);
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

function printTask() {
    setTimeout(function () {
        const options = {
            filename: `task-${current_task_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
        };

        var element = document.getElementById("to-print");
        var worker = html2pdf().set(options).from(element).save();
    }, 2000);
}

function download(path) {
    downloadRessource(path);
}

function saveNote() {
    let note = document.getElementById("newNote").value;
    let noteType = document.getElementById("noteType").value;

    document.getElementById("newNote").value = '';
    document.getElementById("noteCreation").style.display = 'none';
    addNoteToTask(current_task_id, note, noteType).then((note) => {
        preloadNote(note);
        refreshPrismStyles();
    });
}

function seeResource(element) {
    let resId = element.getAttribute('data-id');

    getRessource(resId).then((resource) => {
        path = resource.path;
        getRessourceUrl(path).then((url) => {
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
}

function uploadFileAsResource() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];

    uploadRessource(file).then((path) => {
        saveRessource('tr-' + current_task_id, path).then(() => {
            assignLastResourceToTask(current_task_id).then(() => {
                alert("Resource successfully added !");
                location.reload();
            })
        })
    })
});

function refreshPrismStyles() {
    // To highlight all elements with the 'language-' class
    Prism.highlightAll();

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
