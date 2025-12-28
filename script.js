document.addEventListener('DOMContentLoaded', () => {

    // --- Ambil semua elemen yang dibutuhkan ---
    const loginPage = document.getElementById('login-page');
    const successPage = document.getElementById('success-page');
    const adminPage = document.getElementById('admin-page');
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    // === Kumpulan Elemen Admin Panel & Modal ===
    // Tombol di Panel
    const showCreateUserBtn = document.getElementById('show-create-user-modal');
    const showUserDbBtn = document.getElementById('show-user-db-modal');
    const showChangeLinkBtn = document.getElementById('show-change-link-modal');
    
    // Modal & Form
    const createUserModal = document.getElementById('create-user-modal');
    const userDbModal = document.getElementById('user-db-modal');
    const changeLinkModal = document.getElementById('change-link-modal');
    const allCloseModalBtns = document.querySelectorAll('.close-modal-btn');
    
    // Form Create User
    const createUserForm = document.getElementById('create-user-form');
    const newUsernameInput = document.getElementById('new-username');
    const newPasswordInput = document.getElementById('new-password');
    const createUserMsg = document.getElementById('create-user-msg');
    
    // Database User
    const userListContainer = document.getElementById('user-list-container');
    
    // Form Ubah Link
    const changeLinkForm = document.getElementById('change-link-form');
    const newTelegramLinkInput = document.getElementById('new-telegram-link');
    const changeLinkMsg = document.getElementById('change-link-msg');

    // Pengaturan
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const groupLinkBtn = document.getElementById('group-link');

    // --- FUNGSI DATABASE LOKAL (localStorage) ---
    const getUsers = () => JSON.parse(localStorage.getItem('website_users')) || [];
    const saveUsers = (users) => localStorage.setItem('website_users', JSON.stringify(users));
    const getTelegramLink = () => localStorage.getItem('telegram_link') || 'https://t.me/Fonx14'; // Link default
    const saveTelegramLink = (link) => localStorage.setItem('telegram_link', link);

    // --- Inisialisasi awal saat halaman dimuat ---
    const loadInitialData = () => {
        groupLinkBtn.href = getTelegramLink();
    };
    loadInitialData();

    // --- Fungsi untuk menampilkan pesan di modal ---
    const showModalMessage = (element, message, isSuccess) => {
        element.textContent = message;
        element.className = isSuccess ? 'msg-success' : 'msg-error';
        setTimeout(() => element.textContent = '', 3000);
    };

    // === FUNGSI-FUNGSI ADMIN PANEL ===

    // 1. Membuat User Baru
    showCreateUserBtn.addEventListener('click', () => createUserModal.classList.remove('hidden'));
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const users = getUsers();
        const newUsername = newUsernameInput.value.trim();
        if (users.some(user => user.username === newUsername)) {
            showModalMessage(createUserMsg, 'Username ini sudah ada!', false);
        } else {
            users.push({ username: newUsername, password: newPasswordInput.value.trim() });
            saveUsers(users);
            showModalMessage(createUserMsg, 'User berhasil dibuat!', true);
            createUserForm.reset();
        }
    });

    // 2. Menampilkan & Mengelola Database User
    const renderUserDatabase = () => {
        const users = getUsers();
        userListContainer.innerHTML = ''; // Kosongkan daftar sebelum render ulang
        if (users.length === 0) {
            userListContainer.innerHTML = '<p>Belum ada user yang dibuat.</p>';
            return;
        }
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <div class="user-item-info">
                    ${user.username}
                    <span>Pass: ${user.password}</span>
                </div>
                <button class="delete-user-btn" data-username="${user.username}" title="Hapus user ini">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            userListContainer.appendChild(userDiv);
        });
    };
    showUserDbBtn.addEventListener('click', () => {
        renderUserDatabase();
        userDbModal.classList.remove('hidden');
    });

    // 3. Menghapus User dari Database
    userListContainer.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-user-btn');
        if (deleteButton) {
            const usernameToDelete = deleteButton.dataset.username;
            if (confirm(`Anda yakin ingin menghapus user "${usernameToDelete}"?`)) {
                let users = getUsers();
                users = users.filter(user => user.username !== usernameToDelete);
                saveUsers(users);
                renderUserDatabase();
            }
        }
    });

    // 4. Mengubah Link Grup Telegram
    showChangeLinkBtn.addEventListener('click', () => {
        newTelegramLinkInput.value = getTelegramLink();
        changeLinkModal.classList.remove('hidden');
    });
    changeLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newLink = newTelegramLinkInput.value.trim();
        saveTelegramLink(newLink);
        loadInitialData();
        showModalMessage(changeLinkMsg, 'Link berhasil disimpan!', true);
    });

    // Fungsi untuk menutup semua modal
    allCloseModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            createUserModal.classList.add('hidden');
            userDbModal.classList.add('hidden');
            changeLinkModal.classList.add('hidden');
        });
    });

    // === LOGIKA LOGIN UTAMA ===
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        errorMessage.style.display = 'none';

        if (username === 'AdminSedz14@@' && password === '02082012*') {
            loginPage.classList.add('hidden');
            adminPage.classList.remove('hidden');
            return;
        }

        const foundUser = getUsers().find(user => user.username === username && user.password === password);
        if (foundUser) {
            loginPage.classList.add('hidden');
            successPage.classList.remove('hidden');
            document.getElementById('info-username').textContent = foundUser.username;
            document.getElementById('info-password').textContent = '********';
            document.getElementById('info-date').textContent = new Date().toLocaleDateString('id-ID');
        } else {
            errorMessage.style.display = 'block';
        }
    });
    
    // === FUNGSI-FUNGSI LAINNYA (Tetap Sama) ===
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
    settingsToggle.addEventListener('click', () => settingsDropdown.classList.toggle('hidden'));
    logoutBtn.addEventListener('click', () => location.reload());
});