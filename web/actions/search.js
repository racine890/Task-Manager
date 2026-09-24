let searchTimeout = null;

function viewProject(id) {
    redirect("projectDetails.html", false, [["no", id]]);
}

function viewTask(id) {
    redirect("taskDetails.html", false, [["no", id]]);
}

function viewIdea(id) {
    redirect("ideaForm.html", false, [["idea", id]]);
}

async function performSearch(term) {
    const resultList = document.getElementById('my-table');

    if (!term || term.trim().length < 1) {
        resultList.innerHTML = '';
        return;
    }

    const allResults = [];

    const searchFunctions = [
        { hasRight: 'read_project', type: 'Project', fn: () => appSearchService.searchProject(term) },
        { hasRight: 'read_task', type: 'Task', fn: () => appSearchService.searchTask(term) },
        { hasRight: 'read_idea', type: 'Idea', fn: () => appSearchService.searchIdea(term) },
    ];

    const results = await Promise.all(
        searchFunctions.map(async (search) => {
            if (!hasRight(search.hasRight)) return { type: search.type, items: [] };
            try {
                const items = await search.fn();
                return { type: search.type, items: items || [] };
            } catch (error) {
                console.error('Search error for ' + search.type + ':', error);
                return { type: search.type, items: [] };
            }
        })
    );

    results.forEach(result => {
        result.items.forEach(item => {
            allResults.push({ id: item.key, name: item.value, type: result.type });
        });
    });

    resultList.innerHTML = '';

    if (allResults.length === 0) {
        resultList.innerHTML = '<tr><td colspan="4" style="text-align:center;">No results found</td></tr>';
        return;
    }

    allResults.forEach(item => {
        const row = `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>
                ${fillActionsForItem(item)}
            </td>
        </tr>`;
        resultList.innerHTML += row;
    });
}

function fillActionsForItem(item) {
    if (item.type === 'Project')
        return `<button class="btn btn-primary" onclick="viewProject(${item.id})">View</button>`;
    if (item.type === 'Task')
        return `<button class="btn btn-primary" onclick="viewTask(${item.id})">View</button>`;
    if (item.type === 'Idea')
        return `<button class="btn btn-primary" onclick="viewIdea(${item.id})">View</button>`;
    return '';
}

function initSearchBar() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(event.target.value);
        }, 300);
    });

    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }

    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            const resultList = document.getElementById('my-table');
            resultList.innerHTML = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSearchBar();
});
