const apiBase = 'https://smart-shopping-api-1k1z.onrender.com';
let token = '';

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log('Sending login data:', { username, password });
  
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      
      const contentType = res.headers.get("Content-Type") || "";
      let data = {};
  
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.warn("Non-JSON response:", text);
        data.message = text;
      }
  
      console.log('Server response:', res.status, data);
  
      if (res.ok) {
        token = data.token;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('grocery-section').style.display = 'block';
        loadItems();
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong during login.');
    }
  }
  async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log('Registering user:', { username, password });
  
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('User registered! Now try logging in.');
      } else {
        alert(data.message || 'Registration failed.');
      }
  
    } catch (err) {
      console.error('Register error:', err);
      alert('Something went wrong during registration.');
    }
  }
async function loadItems() {
  const res = await fetch(`${apiBase}/items`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const items = await res.json();
  const list = document.getElementById('grocery-list');
  list.innerHTML = '';

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li);
  });
}

async function addItem() {
  const itemName = document.getElementById('new-item').value;
  if (!itemName) return;

  await fetch(`${apiBase}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: itemName })
  });

  document.getElementById('new-item').value = '';
  loadItems();
}

function logout() {
  token = '';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('grocery-section').style.display = 'none';
}