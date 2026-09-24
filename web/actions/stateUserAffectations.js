let current_user_id;
let assignations = [];
let start = 0;
let isLoading = false;
let hasMore = true;

const STATUS_ORDER = ['New', 'Todo', 'Started', 'Paused', 'Testing', 'Finished', 'Feedback', 'Delivered', 'Abandoned'];
const STATUS_CLASS = {
    'New': 'status-new',
    'Todo': 'status-todo',
    'Started': 'status-started',
    'Paused': 'status-paused',
    'Testing': 'status-testing',
    'Finished': 'status-finished',
    'Feedback': 'status-feedback',
    'Delivered': 'status-delivered',
    'Abandoned': 'status-abandoned'
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    current_user_id = params.get('no');

    if (!current_user_id) {
        document.getElementById('container').innerHTML = '<div class="empty-state">No user specified</div>';
        return;
    }

    getUser(current_user_id).then((user) => {
        if (!user) {
            document.getElementById('container').innerHTML = '<div class="empty-state">User not found</div>';
            return;
        }

        const initials = user.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('initials').textContent = initials;
        document.getElementById('name').textContent = user.username;
        document.getElementById('email').textContent = user.email;
        document.getElementById('job').textContent = 'Worker';
    });

    loadMore();

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            loadMore();
        }
    }, { rootMargin: '100px' });

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);
});

async function loadMore() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';

    try {
        const response = await getUserAssignationsPaginated(current_user_id, start);
        if (!response || response.length === 0) {
            hasMore = false;
            if (loader) loader.style.display = 'none';
            isLoading = false;
            return;
        }

        assignations = assignations.concat(response);
        renderAssignations();
        start += 20;
    } catch (error) {
        alert(error);
    } finally {
        isLoading = false;
        if (loader) loader.style.display = 'none';
    }
}

function renderAssignations() {
    const now = new Date();
    let active_tasks = 0;
    let delayed_tasks = 0;
    let started_tasks = 0;
    let running_projects = new Set();
    let totalProgression = 0;
    let progressionCount = 0;

    const grouped = {};
    STATUS_ORDER.forEach(s => grouped[s] = []);

    assignations.forEach(a => {
        active_tasks++;
        totalProgression += (a.progression || 0);
        progressionCount++;

        if (a.project_status == 2) {
            running_projects.add(a.project);
        }

        const statusIndex = typeof a.status === 'number' ? a.status : parseInt(a.status, 10);
        const statusName = STATUS_ORDER[statusIndex] || 'New';
        if (a.status == 1 || a.status == 2) started_tasks++;

        const endDate = a.end_date ? new Date(a.end_date.replace(' ', 'T') + 'Z') : null;
        if (endDate && now > endDate && a.status != 5 && a.status != 6 && a.status != 7 && a.status != 8) {
            delayed_tasks++;
        }

        grouped[statusName].push(a);
    });

    const avgProgression = progressionCount > 0 ? Math.round(totalProgression / progressionCount) : 0;

    document.getElementById('active_tasks').textContent = active_tasks;
    document.getElementById('started_tasks').textContent = started_tasks;
    document.getElementById('delayed').textContent = delayed_tasks;
    document.getElementById('running_projects').textContent = running_projects.size;
    document.getElementById('progression').textContent = avgProgression + '%';

    const container = document.getElementById('sections-container');

    STATUS_ORDER.forEach(status => {
        const items = grouped[status];
        if (!items || items.length === 0) return;

        let section = document.getElementById('section-' + status);
        if (!section) {
            section = document.createElement('div');
            section.id = 'section-' + status;
            section.className = 'status-section';

            const header = document.createElement('div');
            header.className = 'status-section-header';
            header.innerHTML = `
                <div class="status-header-left">
                    <span class="section-toggle"><i class="fas fa-chevron-down"></i></span>
                    <h4 class="section-title ${STATUS_CLASS[status] || ''}">${status}</h4>
                    <span class="section-count">0</span>
                </div>
            `;

            const content = document.createElement('div');
            content.className = 'status-section-content';

            const table = document.createElement('table');
            table.className = 'assignation-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Task ID</th>
                        <th>Task</th>
                        <th>Project</th>
                        <th>Start date</th>
                        <th>Started on</th>
                        <th>Should end on</th>
                        <th>Progression</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            content.appendChild(table);
            section.appendChild(header);
            section.appendChild(content);
            container.appendChild(section);

            header.addEventListener('click', () => {
                const isOpen = section.classList.contains('open');
                section.classList.toggle('open', !isOpen);
                header.querySelector('.section-toggle i').className = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
            });
        }

        const tbody = section.querySelector('tbody');
        items.forEach(a => {
            const endDate = a.end_date ? new Date(a.end_date.replace(' ', 'T') + 'Z') : null;
            const isDelayed = endDate && now > endDate && a.status != 5 && a.status != 6 && a.status != 7 && a.status != 8;
            const rowClass = isDelayed ? 'delayed-row' : '';

            const row = document.createElement('tr');
            row.className = rowClass;
            row.innerHTML = `
                <td>${a.task_id}</td>
                <td><a href="taskDetails.html?no=${a.task_id}" class="task-link">${a.task}</a></td>
                <td><a href="projectDetails.html?no=${a.project_id}" class="project-link">${a.project}</a></td>
                <td>${toDisplayDate(a.task_start_date)}</td>
                <td>${toDisplayDate(a.effective_start)}</td>
                <td>${toDisplayDate(a.end_date)}</td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar" style="width:${a.progression || 0}%; background:${getProgressColor(a.progression)};"></div>
                    </div>
                </td>
                <td><span class="status-badge ${STATUS_CLASS[status] || ''}">${status}</span></td>
            `;
            tbody.appendChild(row);
        });

        const countEl = section.querySelector('.section-count');
        if (countEl) {
            const currentCount = parseInt(countEl.textContent) || 0;
            countEl.textContent = currentCount + items.length;
        }
    });

    document.getElementById('last_update').textContent = now.toLocaleString('fr-FR');
}

function getProgressColor(progression) {
    if (progression >= 80) return '#10b981';
    if (progression >= 50) return '#3b82f6';
    if (progression >= 25) return '#f59e0b';
    return '#ef4444';
}
