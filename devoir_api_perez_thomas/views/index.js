/* views/index.js - simple client-side login helper
   Example usage: include this script into a public/index.html
*/

async function submitLogin(email, password) {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || JSON.stringify(data));
      return null;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    alert('Erreur réseau: ' + err.message);
    return null;
  }
}

// Helper to fetch protected endpoints
async function apiGet(path) {
  const token = localStorage.getItem('token');
  const res = await fetch(path, { headers: { Authorization: 'Bearer ' + token } });
  if (res.status === 401) {
    alert('Non autorisé. Connecte-toi à nouveau.');
    return null;
  }
  return res.json();
}

// Example: load users and display in console
async function loadUsers() {
  const users = await apiGet('/api/users');
  console.log(users);
}

/* Expose helpers */
window.russellAuth = { submitLogin, apiGet, loadUsers };
