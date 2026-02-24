let current_user_id;

document.addEventListener('DOMContentLoaded', () => {

	const params = new URLSearchParams(window.location.search);
	current_user_id = params.get('no');

	getUserAssignations(current_user_id).then((response) => {

		if (response.length == 0) {
			document.getElementById('container').innerHTML = "No assignations found";
			return;
		}

		user = response[0].worker;
		user_email = response[0].worker_email;

		let active_tasks = 0;
		let delayed_tasks = 0;

		rows_html = '';
		progression = 0;
		let progression_count = 0;

		response.forEach((assignation) => {

			if (assignation.status == 2) {
				active_tasks++;
			} else if (assignation.status == 0 || assignation.status == 1) {
				delayed_tasks++;
			}

			let css_class = '';

			if (assignation.effective_start != null && assignation.end_date != null && new Date(assignation.end_date) < new Date()) {
				css_class = 'class="expired-row"';
			} else if (assignation.status == 2) {
				css_class = 'class="active-row"';
			} else if (assignation.status == 3) {
				css_class = 'class="paused-row"';
			}

			const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Abandoned"];
			rows_html += `<tr ${css_class}>
					<td>${assignation.task}</td>
					<td>${assignation.project}</td>
					<td>${toDisplayDate(assignation.effective_start)}</td>
					<td>${toDisplayDate(assignation.end_date)}</td>
					<td>
						<div class="progress-container">
							<div class="progress-bar" style="width:${assignation.progression}%; background:#4e73df;"></div>
						</div>
					</td>
					<td><span class="status en-cours">${statuses[assignation.status]}</span></td>
				</tr>`;

			if (assignation.status === 2) {
				progression += (assignation.progression || 0);
				progression_count++;
			}
		});

		progression = Math.round(progression / progression_count);
		document.getElementById('progression').innerHTML = progression + ' %';

		user_initials = user[0];
		document.getElementById('initials').innerHTML = user_initials;
		document.getElementById('name').innerHTML = user;
		document.getElementById('email').innerHTML = user_email;
		document.getElementById('job').innerHTML = 'Worker';
		document.getElementById('active_tasks').innerHTML = active_tasks;
		document.getElementById('delayed').innerHTML = delayed_tasks;

		document.getElementById('activeTasks').innerHTML = rows_html;

		const now = new Date();
		const last_update = now.toLocaleString();
		document.getElementById('last_update').innerHTML = last_update;
	});
});
