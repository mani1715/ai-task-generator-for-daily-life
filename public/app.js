// public/app.js
async function fetchPlans() {
  const resp = await fetch('/api/plans');
  const data = await resp.json();
  if (!data.success) {
    document.getElementById('history').innerText = 'Failed to load history';
    return;
  }
  const html = data.plans.map(p => {
    return `<div class="plan-card">
      <strong>${p.goal}</strong> <small>(${new Date(p.createdAt).toLocaleString()})</small>
      <pre>${p.aiResp?.planText ?? JSON.stringify(p.aiResp, null, 2)}</pre>
    </div>`;
  }).join('\n');
  document.getElementById('history').innerHTML = html || 'No saved plans';
}

document.getElementById('generate').addEventListener('click', async () => {
  const goal = document.getElementById('goal').value.trim();
  const days = parseInt(document.getElementById('days').value) || undefined;
  if (!goal) {
    alert('Enter a goal first');
    return;
  }
  document.getElementById('result').innerText = 'Generating...';
  try {
    const resp = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, days })
    });
    const data = await resp.json();
    if (!data.success) {
      document.getElementById('result').innerText = 'Error: ' + (data.error || JSON.stringify(data));
      return;
    }
    const text = data.plan.aiResp?.planText || JSON.stringify(data.plan.aiResp, null, 2);
    document.getElementById('result').innerText = text;
    fetchPlans();
  } catch (err) {
    document.getElementById('result').innerText = 'Request failed: ' + err.message;
  }
});

// Load history on start
fetchPlans();
