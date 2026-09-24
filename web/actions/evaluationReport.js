current_eval_project_id = null;
eval_all_tasks = [];
eval_all_sub_projects = [];
eval_project = null;

const evalStatuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Feedback", "Delivered", "Abandoned"];
const evalStatusColors = {
    New: '#acaa21', Todo: '#0caded', Started: '#a810f0', Paused: '#0eacec',
    Testing: '#ceaaad', Finished: '#0ada91', Feedback: '#f59e0b', Delivered: '#6366f1', Abandoned: '#900010'
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    current_eval_project_id = params.get('no');

    if (current_eval_project_id) {
        loadEvaluationReport();
    }
});

async function loadEvaluationReport() {
    try {
        eval_project = await getProject(current_eval_project_id);
        eval_all_tasks = await getAllTasksByProject(current_eval_project_id);
        eval_all_sub_projects = await getAllSubProjectsByProject(current_eval_project_id);

        renderProjectInfo();
        renderSummary();
        renderTasksTable();
        renderSubProjectsTable();
    } catch (Error) {
        console.error('Error loading evaluation report:', Error);
        alert("An error occurred while loading the economic report!");
    }
}

function getProjectRateMap() {
    const rateMap = {};
    rateMap[eval_project.id] = eval_project.hourly_rate != null ? parseFloat(eval_project.hourly_rate) : null;
    eval_all_sub_projects.forEach(sp => {
        rateMap[sp.id] = sp.hourly_rate != null ? parseFloat(sp.hourly_rate) : null;
    });
    return rateMap;
}

function getTaskProjectName(task) {
    const match = eval_all_sub_projects.find(p => p.id == task.project_id);
    if (match) return match.name;
    if (task.project_name) return task.project_name;
    if (task.project_id == current_eval_project_id) return eval_project.name;
    return 'N/A';
}

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderProjectInfo() {
    document.getElementById('eval-project-name').textContent = eval_project.name || 'N/A';

    const hourlyRateEl = document.getElementById('eval-hourly-rate');
    if (eval_project.hourly_rate != null) {
        hourlyRateEl.textContent = parseFloat(eval_project.hourly_rate).toFixed(2) + ' / hour';
    } else {
        hourlyRateEl.textContent = 'Not defined';
    }

    document.getElementById('eval-external').textContent = eval_project.external ? 'Yes' : 'No';

    const periodEl = document.getElementById('eval-period');
    const start = eval_project.start_date ? new Date(eval_project.start_date).toLocaleDateString('en-US') : 'N/A';
    const end = eval_project.end_date ? new Date(eval_project.end_date).toLocaleDateString('en-US') : 'N/A';
    periodEl.textContent = `${start} to ${end}`;

    const statusEl = document.getElementById('eval-project-status');
    const statusName = evalStatuses[eval_project.status] || 'N/A';
    statusEl.textContent = statusName;
    statusEl.className = 'label ' + statusName;
}

function renderSummary() {
    const rateMap = getProjectRateMap();

    const validatedTasks = eval_all_tasks.filter(t => t.evaluated_hours != null && t.evaluation_validated);
    const pendingTasks = eval_all_tasks.filter(t => t.evaluated_hours != null && !t.evaluation_validated);
    const notEvaluatedTasks = eval_all_tasks.filter(t => t.evaluated_hours == null);

    const totalEvaluatedHours = validatedTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
    const totalValidatedAmount = validatedTasks.reduce((sum, t) => {
        const rate = rateMap[t.project_id];
        const hours = parseFloat(t.evaluated_hours) || 0;
        return sum + (rate ? hours * rate : 0);
    }, 0);

    document.getElementById('eval-total-amount').textContent = totalValidatedAmount.toFixed(2);
    document.getElementById('eval-total-hours').textContent = totalEvaluatedHours.toFixed(2);
    document.getElementById('eval-validated-count').textContent = validatedTasks.length;
    document.getElementById('eval-pending-count').textContent = pendingTasks.length;
}

function renderTasksTable() {
    const rateMap = getProjectRateMap();
    const tbody = document.getElementById('eval-tasks-tbody');

    if (eval_all_tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No tasks found.</td></tr>';
        return;
    }

    tbody.innerHTML = eval_all_tasks.map((task, i) => {
        const rate = rateMap[task.project_id];
        const evalHours = task.evaluated_hours != null ? (parseFloat(task.evaluated_hours) || 0) : null;
        const evalHoursDisplay = evalHours !== null ? evalHours.toFixed(2) + ' h' : 'Not evaluated';
        const rateDisplay = rate != null ? rate.toFixed(2) : '-';
        const amountDisplay = (evalHours !== null && rate) ? (evalHours * rate).toFixed(2) : '-';
        const validatedDisplay = task.evaluated_hours != null
            ? (task.evaluation_validated ? '<span class="eval-status-badge eval-validated-yes">Yes</span>' : '<span class="eval-status-badge eval-validated-no">No</span>')
            : '<span class="eval-status-badge eval-validated-na">N/A</span>';

        const statusName = evalStatuses[task.status] || 'N/A';
        const statusColor = evalStatusColors[statusName] || '#666';

        return `<tr>
            <td style="text-align:left;">${i + 1}</td>
            <td style="text-align:left;">${escapeHtml(task.name)}</td>
            <td style="text-align:left;">${escapeHtml(getTaskProjectName(task))}</td>
            <td>${evalHoursDisplay}</td>
            <td>${rateDisplay}</td>
            <td>${amountDisplay}</td>
            <td><span class="eval-status-badge" style="background:${statusColor}">${escapeHtml(statusName)}</span></td>
            <td>${validatedDisplay}</td>
        </tr>`;
    }).join('');
}

function renderSubProjectsTable() {
    const rateMap = getProjectRateMap();
    const tbody = document.getElementById('eval-subprojects-tbody');

    const subProjectsWithTasks = eval_all_sub_projects.map(sp => {
        const spTasks = eval_all_tasks.filter(t => t.project_id == sp.id);
        const spValidatedTasks = spTasks.filter(t => t.evaluated_hours != null && t.evaluation_validated);
        const spPendingTasks = spTasks.filter(t => t.evaluated_hours != null && !t.evaluation_validated);
        const spRate = rateMap[sp.id];
        const spValidatedHours = spValidatedTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
        const spTotalHours = spTasks.filter(t => t.evaluated_hours != null).reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
        const spAmount = spValidatedTasks.reduce((sum, t) => sum + ((parseFloat(t.evaluated_hours) || 0) * (spRate || 0)), 0);

        return {
            project: sp,
            rate: spRate,
            evaluatedHours: spValidatedHours,
            totalHours: spTotalHours,
            pendingCount: spPendingTasks.length,
            totalAmount: spAmount,
            validatedCount: spValidatedTasks.length
        };
    });

    if (subProjectsWithTasks.length === 0) {
        const allTasks = eval_all_tasks.filter(t => t.evaluated_hours != null);
        const totalHours = allTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
        const validatedHours = allTasks.filter(t => t.evaluation_validated).reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
        const rate = rateMap[eval_project.id];

        tbody.innerHTML = `<tr>
            <td style="text-align:left;">1</td>
            <td style="text-align:left;">${escapeHtml(eval_project.name)} (main project)</td>
            <td>${rate != null ? rate.toFixed(2) : 'Not defined'}</td>
            <td>${totalHours.toFixed(2)} h</td>
            <td>${validatedHours.toFixed(2)} h</td>
            <td>${totalHours > 0 && rate ? (validatedHours * rate).toFixed(2) : '-'}
            </td>
        </tr>`;
        return;
    }

    tbody.innerHTML = subProjectsWithTasks.map((sp, i) => `
        <tr>
            <td style="text-align:left;">${i + 1}</td>
            <td style="text-align:left;">${escapeHtml(sp.project.name)}</td>
            <td>${sp.rate != null ? sp.rate.toFixed(2) : 'Not defined'}</td>
            <td>${sp.totalHours.toFixed(2)} h</td>
            <td>${sp.evaluatedHours.toFixed(2)} h</td>
            <td>${sp.totalAmount.toFixed(2)}</td>
        </tr>
    `).join('');
}

async function generateEvalReport() {
    try {
        const rateMap = getProjectRateMap();

        const validatedTasks = eval_all_tasks.filter(t => t.evaluated_hours != null && t.evaluation_validated);
        const pendingTasks = eval_all_tasks.filter(t => t.evaluated_hours != null && !t.evaluation_validated);
        const notEvaluatedTasks = eval_all_tasks.filter(t => t.evaluated_hours == null);

        const totalEvaluatedHours = validatedTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
        const totalPendingHours = pendingTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
        const totalValidatedAmount = validatedTasks.reduce((sum, t) => {
            const rate = rateMap[t.project_id];
            const hours = parseFloat(t.evaluated_hours) || 0;
            return sum + (rate ? hours * rate : 0);
        }, 0);
        const totalPendingAmount = pendingTasks.reduce((sum, t) => {
            const rate = rateMap[t.project_id];
            const hours = parseFloat(t.evaluated_hours) || 0;
            return sum + (rate ? hours * rate : 0);
        }, 0);

        const now = new Date();
        const reportDate = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
        const refCode = `EVAL/${current_eval_project_id}/${now.getFullYear()}/${String(eval_all_tasks.length).padStart(4, '0')}`;

        const statuses = evalStatuses;
        const statusColors = evalStatusColors;

        const statusCounts = {};
        statuses.forEach(s => statusCounts[s] = 0);
        eval_all_tasks.forEach(t => { statusCounts[statuses[t.status]]++; });

        const finishedStatuses = [5, 6, 7, 8];
        const finished = eval_all_tasks.filter(t => finishedStatuses.includes(t.status)).length;
        const total = eval_all_tasks.length;
        const progress = total > 0 ? Math.round((finished / total) * 100) : 0;

        const projectHourlyRate = eval_project.hourly_rate != null ? parseFloat(eval_project.hourly_rate) : null;

        let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Economic Report - ${eval_project.name}</title>
  <style>
    :root { --primary:#1a1a2e; --secondary:#16213e; --accent:#0f3460; --gold:#c5a572; --light:#f8f9fa; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Times New Roman',serif; background:#e8e8e8; padding:20px; color:var(--primary); position:relative; }
    body::before { content:'CONFIDENTIEL'; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-45deg); font-size:120px; font-weight:bold; color:rgba(197,165,114,0.08); z-index:0; pointer-events:none; white-space:nowrap; }
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
    table { width:100%; border-collapse:collapse; margin:20px 0; font-size:11px; }
    th { background:var(--accent); color:white; padding:12px 8px; text-align:left; font-weight:bold; text-transform:uppercase; font-size:10px; letter-spacing:0.5px; }
    td { padding:10px 8px; border-bottom:1px solid #ddd; }
    tr:nth-child(even) { background:#f8f9fa; }
    .page-footer { position:absolute; bottom:15mm; left:20mm; right:20mm; border-top:2px solid var(--gold); padding-top:10px; font-size:10px; color:#666; display:flex; justify-content:space-between; }
    .signature-block { margin-top:50px; display:flex; justify-content:space-between; }
    .signature { text-align:center; flex:1; }
    .signature .title { font-weight:bold; margin-bottom:60px; font-size:12px; text-transform:uppercase; }
    .signature .name { border-top:2px solid #333; padding-top:10px; font-size:11px; }
    .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; margin:20px 0; }
    .stat-box { background:linear-gradient(135deg,var(--accent)0%,var(--secondary)100%); color:white; padding:20px; text-align:center; border-radius:5px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
    .stat-box .number { font-size:32px; font-weight:bold; margin-bottom:5px; }
    .stat-box .label { font-size:11px; opacity:0.9; text-transform:uppercase; }
    .stat-box.total { background:linear-gradient(135deg,#0ada91 0%,var(--accent)100%); }
    .stat-box.warning { background:linear-gradient(135deg,#f59e0b 0%,#a810f0 100%); }
    .stat-box.pending { background:linear-gradient(135deg,#6366f1 0%,var(--accent)100%); }
    .status-badge { display:inline-block; padding:3px 10px; border-radius:3px; color:white; font-size:10px; font-weight:bold; text-transform:uppercase; }
    .info-table { width:100%; margin:20px 0; }
    .info-table td { padding:8px 12px; border:none; }
    .info-table tr:nth-child(even) { background:transparent; }
    .info-table td:first-child { font-weight:bold; color:var(--accent); width:40%; text-transform:uppercase; font-size:10px; }
    @media print { body { background:white; padding:0; } body::before { color:rgba(197,165,114,0.05); } .no-print { display:none; } .page { margin:0; box-shadow:none; page-break-after:always; } .page-footer { position:fixed; bottom:15mm; } thead { display:table-header-group; } tr { page-break-inside:avoid; } }
  </style>
</head>
<body>
  <div class="no-print"><button onclick="window.print()">Print Report</button></div>
  <div class="page">
    <div class="official-header">
      <h1>Task Manager - Sprint Economic Report</h1>
      <div class="divider"></div>
    </div>
    <div class="document-title">
      <h2>${eval_project.name}</h2>
      <p class="subtitle">Category: ${eval_project.category_name || eval_project.category_id || 'N/A'}</p>
    </div>
    <div class="doc-info">
      <div class="doc-info-item"><label>Reference</label><div class="value">${refCode}</div></div>
      <div class="doc-info-item"><label>Date Issued</label><div class="value">${reportDate}</div></div>
      <div class="doc-info-item"><label>Classification</label><div class="value">Confidential</div></div>
      <div class="doc-info-item"><label>Project</label><div class="value">#${eval_project.id}</div></div>
    </div>
    <div style="padding:15px;background:#fff9e6;border-left:4px solid var(--gold);">
      <p style="font-size:11px;line-height:1.6;"><strong>Important note:</strong> This document contains confidential economic information intended exclusively for project stakeholders. Unauthorized disclosure is strictly prohibited.</p>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page 1</span><span>${refCode}</span></div>
  </div>

  <div class="page">
    <div class="section">
      <div class="section-header">I. Executive Summary</div>
      <div class="section-content">
        <p style="margin-bottom:15px;"><strong>Description:</strong> ${eval_project.description || 'No description available.'}</p>
        <p style="margin-bottom:15px;"><strong>Period:</strong> From ${eval_project.start_date ? new Date(eval_project.start_date).toLocaleDateString('en-US') : 'N/A'} to ${eval_project.end_date ? new Date(eval_project.end_date).toLocaleDateString('en-US') : 'N/A'}</p>
        <p style="margin-bottom:15px;"><strong>Current Status:</strong> ${statuses[eval_project.status] || 'N/A'}</p>
        <p style="margin-bottom:15px;"><strong>Hourly Rate:</strong> ${projectHourlyRate != null ? projectHourlyRate.toFixed(2) + ' / hour' : 'Not defined'}</p>
        <p><strong>External Project:</strong> ${eval_project.external ? 'Yes' : 'No'}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-header">II. Key Indicators</div>
      <div class="stats-grid">
        <div class="stat-box total"><div class="number">${totalValidatedAmount.toFixed(2)}</div><div class="label">Total Validated Amount</div></div>
        <div class="stat-box"><div class="number">${totalEvaluatedHours.toFixed(2)}</div><div class="label">Total Evaluated Hours</div></div>
        <div class="stat-box warning"><div class="number">${pendingTasks.length}</div><div class="label">Pending Evaluations</div></div>
        <div class="stat-box"><div class="number">${validatedTasks.length}</div><div class="label">Validated Tasks</div></div>
        <div class="stat-box"><div class="number">${progress}%</div><div class="label">Task Progress</div></div>
        <div class="stat-box pending"><div class="number">${notEvaluatedTasks.length}</div><div class="label">Not Evaluated</div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">III. Economic Breakdown</div>
      <table class="info-table">
        <tbody>
          <tr><td>Project Hourly Rate</td><td>${projectHourlyRate != null ? projectHourlyRate.toFixed(2) : 'Not defined'}</td></tr>
          <tr><td>Validated Evaluations</td><td>${validatedTasks.length} task(s)</td></tr>
          <tr><td>Total Evaluated Hours (validated)</td><td>${totalEvaluatedHours.toFixed(2)} h</td></tr>
          <tr><td>Estimated Cost (validated)</td><td style="font-weight:bold;color:var(--accent);">${totalValidatedAmount.toFixed(2)}</td></tr>
          <tr><td>Pending Evaluations</td><td>${pendingTasks.length} task(s)</td></tr>
          <tr><td>Total Evaluated Hours (pending)</td><td>${totalPendingHours.toFixed(2)} h</td></tr>
          <tr><td>Estimated Cost (pending)</td><td>${totalPendingAmount.toFixed(2)}</td></tr>
          <tr><td>Not Yet Evaluated</td><td>${notEvaluatedTasks.length} task(s)</td></tr>
          <tr><td>Potential Total Cost (validated + pending)</td><td>${(totalValidatedAmount + totalPendingAmount).toFixed(2)}</td></tr>
        </tbody>
      </table>
    </div>

    <div class="page-footer"><span>Task Manager</span><span>Page 2</span><span>${refCode}</span></div>
  </div>

  <div class="page">
    <div class="section">
      <div class="section-header">IV. Status Distribution</div>
      <table>
        <thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>
        <tbody>
          ${statuses.map(s => { const count = statusCounts[s]; const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0; return `<tr><td><span class="status-badge" style="background:${statusColors[s] || '#666'}">${s}</span></td><td style="text-align:center;">${count}</td><td style="text-align:center;">${pct}%</td></tr>`; }).join('')}
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-header">V. Evaluated Tasks (${validatedTasks.length})</div>
      <table>
        <thead><tr><th>#</th><th>Task Name</th><th>Project</th><th>Evaluated Hours</th><th>Hourly Rate</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          ${validatedTasks.map((task, i) => {
              const rate = rateMap[task.project_id];
              const hours = parseFloat(task.evaluated_hours) || 0;
              const amount = rate ? (hours * rate).toFixed(2) : '-';
              const projectName = task.project_name || (task.project_id == current_eval_project_id ? eval_project.name : 'Sub-project #' + task.project_id);
              return `<tr><td>${i + 1}</td><td>${task.name}</td><td>${projectName || 'N/A'}</td><td>${hours.toFixed(2)} h</td><td>${rate != null ? rate.toFixed(2) : '-'}</td><td>${amount}</td><td><span class="status-badge" style="background:${statusColors[statuses[task.status]] || '#666'}">${statuses[task.status] || 'N/A'}</span></td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page 3</span><span>${refCode}</span></div>
  </div>`;

        if (pendingTasks.length > 0) {
            html += `<div class="page">
    <div class="section">
      <div class="section-header">VI. Pending Evaluations (${pendingTasks.length})</div>
      <table>
        <thead><tr><th>#</th><th>Task Name</th><th>Project</th><th>Evaluated Hours</th><th>Hourly Rate</th><th>Estimated Amount</th><th>Status</th></tr></thead>
        <tbody>
          ${pendingTasks.map((task, i) => {
              const rate = rateMap[task.project_id];
              const hours = parseFloat(task.evaluated_hours) || 0;
              const amount = rate ? (hours * rate).toFixed(2) : '-';
              const projectName = task.project_name || (task.project_id == current_eval_project_id ? eval_project.name : 'Sub-project #' + task.project_id);
              return `<tr><td>${i + 1}</td><td>${task.name}</td><td>${projectName || 'N/A'}</td><td>${hours.toFixed(2)} h</td><td>${rate != null ? rate.toFixed(2) : '-'}</td><td>${amount}</td><td><span class="status-badge" style="background:${statusColors[statuses[task.status]] || '#666'}">${statuses[task.status] || 'N/A'}</span></td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page 4</span><span>${refCode}</span></div>
  </div>`;
        }

        if (eval_all_sub_projects.length > 0) {
            const subPageNum = pendingTasks.length > 0 ? 5 : 4;
            const subProjectRows = eval_all_sub_projects.map((sp, i) => {
                const spTasks = eval_all_tasks.filter(t => t.project_id == sp.id);
                const spValidatedTasks = spTasks.filter(t => t.evaluated_hours != null && t.evaluation_validated);
                const spRate = rateMap[sp.id];
                const spValidatedHours = spValidatedTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
                const spAmount = spValidatedTasks.reduce((sum, t) => sum + ((parseFloat(t.evaluated_hours) || 0) * (spRate || 0)), 0);
                const spTotalHours = spTasks.filter(t => t.evaluated_hours != null).reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
                return `<tr><td>${i + 1}</td><td>${sp.name}</td><td>${spRate != null ? spRate.toFixed(2) : 'Not defined'}</td><td>${spTotalHours.toFixed(2)} h</td><td>${spValidatedHours.toFixed(2)} h</td><td>${spAmount.toFixed(2)}</td></tr>`;
            }).join('');

            html += `<div class="page">
    <div class="section">
      <div class="section-header">VII. Sub-Projects Economic Summary</div>
      <table>
        <thead><tr><th>#</th><th>Sub-Project</th><th>Hourly Rate</th><th>Total Evaluated Hours</th><th>Validated Hours</th><th>Estimated Amount</th></tr></thead>
        <tbody>
          ${subProjectRows}
        </tbody>
      </table>
    </div>
    <div class="signature-block">
      <div class="signature"><div class="title">Project Manager</div><div class="name">Auto-generated</div></div>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${subPageNum}</span><span>${refCode}</span></div>
  </div>`;
        } else {
            const mainPageNum = pendingTasks.length > 0 ? 5 : 4;
            html += `<div class="page">
    <div class="section">
      <div class="section-header">VII. Economic Summary</div>
      <table>
        <thead><tr><th>#</th><th>Metric</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Project</td><td>${eval_project.name}</td></tr>
          <tr><td>2</td><td>Hourly Rate</td><td>${projectHourlyRate != null ? projectHourlyRate.toFixed(2) : 'Not defined'}</td></tr>
          <tr><td>3</td><td>Total Tasks</td><td>${total}</td></tr>
          <tr><td>4</td><td>Evaluated Tasks</td><td>${eval_all_tasks.filter(t => t.evaluated_hours != null).length}</td></tr>
          <tr><td>5</td><td>Validated Evaluations</td><td>${validatedTasks.length}</td></tr>
          <tr><td>6</td><td>Total Validated Hours</td><td>${totalEvaluatedHours.toFixed(2)} h</td></tr>
          <tr><td>7</td><td>Total Validated Amount</td><td style="font-weight:bold;color:var(--accent);">${totalValidatedAmount.toFixed(2)}</td></tr>
          <tr><td>8</td><td>Pending Evaluations</td><td>${pendingTasks.length}</td></tr>
          <tr><td>9</td><td>Total Pending Amount</td><td>${totalPendingAmount.toFixed(2)}</td></tr>
          <tr><td>10</td><td>Potential Total Cost</td><td>${(totalValidatedAmount + totalPendingAmount).toFixed(2)}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="signature-block">
      <div class="signature"><div class="title">Project Manager</div><div class="name">Auto-generated</div></div>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${mainPageNum}</span><span>${refCode}</span></div>
  </div>`;
        }

        html += `</body></html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
        }
    } catch (Error) {
        console.error('Error generating economic report:', Error);
        alert("An error occurred while generating the economic report!");
    }
}
