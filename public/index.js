const apiBaseUrl = '';

let token = '';
let userId = '';

const API_PREFIX = '/api/lab2/'

const registrationForm = document.querySelector('.registration-form');
const loginForm = document.querySelector('.login-form');
const getProfile = document.querySelector('.get-profile');
const deleteAccount = document.querySelector('.delete-account');

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.querySelector('.reg-firstName').value.trim();
    const lastName = document.querySelector('.reg-lastName').value.trim();
    const username = document.querySelector('.reg-username').value.trim();
    const password = document.querySelector('.reg-password').value;
    const role = document.querySelector('.reg-role').value;

    try {
        const response = await fetch(apiBaseUrl + `${API_PREFIX}auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({firstName, lastName, username, password, role})
        });

        const data = await response.json();
        const msgDiv = document.querySelector('.registration-message');

        if (response.ok) {
            msgDiv.textContent = data.message;
            msgDiv.className = 'message';
        } else {
            msgDiv.textContent = data.message || 'Ошибка регистрации';
            msgDiv.className = 'error';
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.login-username').value.trim();
    const password = document.querySelector('.login-password').value;

    try {
        const response = await fetch(apiBaseUrl + `${API_PREFIX}auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });

        const data = await response.json();
        const msgDiv = document.querySelector('.login-message');

        if (response.ok && data.token) {
            token = data.token;
            localStorage.setItem('token', token);
            msgDiv.textContent = 'Вход выполнен успешно. Токен сохранён.';
            msgDiv.className = 'message';
        } else {
            msgDiv.textContent = data.message || 'Ошибка авторизации';
            msgDiv.className = 'error';
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

getProfile.addEventListener('click', async () => {
    if (!token) {
        alert('Пожалуйста, выполните вход.');
        return;
    }
    try {
        const response = await fetch(apiBaseUrl + `${API_PREFIX}user/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();
        const resultPre = document.querySelector(".profile-result");
        if (response.ok) {
            resultPre.textContent = JSON.stringify(data, null, 2);
            if (data._id) {
                userId = data._id;
            }
        } else {
            resultPre.textContent = data.message || 'Ошибка получения профиля';
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

deleteAccount.addEventListener('click', async () => {
    if (!token) {
        alert('Пожалуйста, выполните вход.');
        return;
    }
    if (!userId) {
        alert('Сначала получите данные профиля, чтобы узнать ваш ID.');
        return;
    }
    if (!confirm('Вы уверены, что хотите удалить свой аккаунт?')) return;

    try {
        const response = await fetch(apiBaseUrl + `${API_PREFIX}user/` + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();
        const msgDiv = document.querySelector('.delete-message');

        if (response.ok) {
            localStorage.removeItem('token');
            msgDiv.textContent = data.message;
            msgDiv.className = 'message';
        } else {
            msgDiv.textContent = data.message || 'Ошибка удаления аккаунта';
            msgDiv.className = 'error';
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

const createForm = document.getElementById('create-course-form');
const createMsg = document.getElementById('create-course-message');
const listBtn = document.getElementById('list-courses-btn');
const listPre = document.getElementById('courses-list');
const getIdInput = document.getElementById('get-course-id');
const getBtn = document.getElementById('get-course-btn');
const detailPre = document.getElementById('course-detail');
const updateForm = document.getElementById('update-course-form');
const updateMsg = document.getElementById('update-course-message');
const deleteIdInput = document.getElementById('delete-course-id');
const deleteBtn = document.getElementById('delete-course-btn');
const deleteMsg = document.getElementById('delete-course-message');

const authHeader = () => ({
    'Authorization': token ? 'Bearer ' + token : ''
});

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!token) return alert('Please login first');

    const formData = new FormData();
    formData.append('title', document.getElementById('course-title').value);
    formData.append('description', document.getElementById('course-description').value);
    formData.append('price', document.getElementById('course-price').value);
    formData.append('category', document.getElementById('course-category').value);
    formData.append('level', document.getElementById('course-level').value);
    formData.append('published', document.getElementById('course-published').checked);
    formData.append('tags', document.getElementById('course-tags').value);
    const img = document.getElementById('course-image').files[0];
    formData.append('image', img);

    try {
        const res = await fetch(apiBaseUrl + API_PREFIX + 'courses', {
            method: 'POST',
            headers: authHeader(),
            body: formData
        });
        const data = await res.json();
        createMsg.textContent = res.ok ? 'Created: ' + JSON.stringify(data) : 'Error: ' + data.message;
        createMsg.className = res.ok ? 'message' : 'error';
    } catch (err) {
        console.error(err);
    }
});

listBtn.addEventListener('click', async () => {
    try {
        const res = await fetch(apiBaseUrl + API_PREFIX + 'courses');
        const data = await res.json();
        listPre.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        console.error(err);
    }
});

getBtn.addEventListener('click', async () => {
    const id = getIdInput.value.trim();
    if (!id) return;
    try {
        const res = await fetch(apiBaseUrl + API_PREFIX + 'courses/' + id);
        const data = await res.json();
        detailPre.textContent = res.ok ? JSON.stringify(data, null, 2) : 'Error: ' + data.message;
    } catch (err) {
        console.error(err);
    }
});

updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!token) return alert('Please login first');

    const id = document.getElementById('update-course-id').value.trim();
    const title = document.getElementById('update-course-title').value.trim();
    if (!id || !title) return;

    try {
        const res = await fetch(apiBaseUrl + API_PREFIX + 'courses/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader()
            },
            body: JSON.stringify({ title })
        });
        const data = await res.json();
        updateMsg.textContent = res.ok ? 'Updated: ' + JSON.stringify(data) : 'Error: ' + data.message;
        updateMsg.className = res.ok ? 'message' : 'error';
    } catch (err) {
        console.error(err);
    }
});

deleteBtn.addEventListener('click', async () => {
    if (!token) return alert('Please login first');
    const id = deleteIdInput.value.trim();
    if (!id) return;
    try {
        const res = await fetch(apiBaseUrl + API_PREFIX + 'courses/' + id, {
            method: 'DELETE',
            headers: authHeader()
        });
        const data = await res.json();
        deleteMsg.textContent = res.ok ? data.message : 'Error: ' + data.message;
        deleteMsg.className = res.ok ? 'message' : 'error';
    } catch (err) {
        console.error(err);
    }
});
