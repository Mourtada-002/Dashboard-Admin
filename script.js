// Données des utilisateurs
let usersData = [
    { id: 1, name: "Jean Dupont", email: "jean.dupont@exemple.com", role: "admin", registrationDate: "2023-01-15", status: "active", avatarColor: "bg-blue-500" },
    { id: 2, name: "Marie Martin", email: "marie.martin@exemple.com", role: "user", registrationDate: "2023-02-20", status: "active", avatarColor: "bg-pink-500" },
    { id: 3, name: "Pierre Bernard", email: "pierre.bernard@exemple.com", role: "moderator", registrationDate: "2023-03-10", status: "inactive", avatarColor: "bg-green-500" },
    { id: 4, name: "Sophie Leroy", email: "sophie.leroy@exemple.com", role: "user", registrationDate: "2023-04-05", status: "active", avatarColor: "bg-purple-500" },
    { id: 5, name: "Thomas Petit", email: "thomas.petit@exemple.com", role: "user", registrationDate: "2023-05-18", status: "active", avatarColor: "bg-yellow-500" },
    { id: 6, name: "Julie Moreau", email: "julie.moreau@exemple.com", role: "admin", registrationDate: "2023-06-22", status: "active", avatarColor: "bg-red-500" },
    { id: 7, name: "David Laurent", email: "david.laurent@exemple.com", role: "user", registrationDate: "2023-07-30", status: "inactive", avatarColor: "bg-indigo-500" },
    { id: 8, name: "Laura Simon", email: "laura.simon@exemple.com", role: "moderator", registrationDate: "2023-08-14", status: "active", avatarColor: "bg-teal-500" },
    { id: 9, name: "Marc Lefevre", email: "marc.lefevre@exemple.com", role: "user", registrationDate: "2023-09-05", status: "active", avatarColor: "bg-orange-500" },
    { id: 10, name: "Céline Roux", email: "celine.roux@exemple.com", role: "user", registrationDate: "2023-10-11", status: "inactive", avatarColor: "bg-cyan-500" }
];

let currentPage = 1;
const usersPerPage = 5;
let usersChart, distributionChart;

// Initialisation du tableau des utilisateurs
function renderUsersTable(users = usersData, page = 1) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    // Calcul de la pagination
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        
        // Formatage de la date
        const registrationDate = new Date(user.registrationDate);
        const formattedDate = registrationDate.toLocaleDateString('fr-FR');
        
        // Détermination de la couleur du badge de statut
        const statusClass = user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const statusText = user.status === 'active' ? 'Actif' : 'Inactif';
        
        // Détermination de la couleur du badge de rôle
        let roleClass, roleText;
        switch(user.role) {
            case 'admin':
                roleClass = 'bg-blue-100 text-blue-800';
                roleText = 'Administrateur';
                break;
            case 'moderator':
                roleClass = 'bg-purple-100 text-purple-800';
                roleText = 'Modérateur';
                break;
            default:
                roleClass = 'bg-gray-100 text-gray-800';
                roleText = 'Utilisateur';
        }
        
        row.innerHTML = `
            <td class="py-4 px-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold mr-3">
                        ${user.name.charAt(0)}
                    </div>
                    <div>
                        <p class="font-medium">${user.name}</p>
                        <p class="text-gray-500 text-sm">ID: ${user.id}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-4">${user.email}</td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${roleClass}">${roleText}</span>
            </td>
            <td class="py-4 px-4">${formattedDate}</td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>
            </td>
            <td class="py-4 px-4">
                <div class="flex space-x-2">
                    <button class="edit-user text-blue-600 hover:text-blue-800" data-id="${user.id}" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="view-user text-green-600 hover:text-green-800" data-id="${user.id}" title="Voir détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="delete-user text-red-600 hover:text-red-800" data-id="${user.id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Mise à jour du compteur
    updateUserCount(users.length, page);
    updatePagination(users.length, page);
}

// Mise à jour du compteur d'utilisateurs
function updateUserCount(totalUsers, currentPage) {
    const startIndex = (currentPage - 1) * usersPerPage + 1;
    const endIndex = Math.min(currentPage * usersPerPage, totalUsers);
    document.getElementById('user-count').textContent = `Affichage de ${startIndex}-${endIndex} utilisateurs sur ${totalUsers}`;
}

// Mise à jour de la pagination
function updatePagination(totalUsers, currentPage) {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pageBtns = document.querySelectorAll('.page-btn');
    
    pageBtns.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        if (parseInt(btn.dataset.page) === currentPage) {
            btn.classList.add('active', 'bg-blue-600', 'text-white');
        } else {
            btn.classList.add('text-gray-700', 'hover:bg-gray-50');
        }
    });
    
    // Gestion des boutons précédent/suivant
    const prevBtn = document.querySelector('.prev-page');
    const nextBtn = document.querySelector('.next-page');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Afficher seulement les pages nécessaires
    pageBtns.forEach((btn, index) => {
        if (index + 1 <= totalPages) {
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none';
        }
    });
}

// Filtrage des utilisateurs
function filterUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const roleFilter = document.getElementById('filter-role').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    const filteredUsers = usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    currentPage = 1;
    renderUsersTable(filteredUsers, currentPage);
}

// Initialisation des graphiques
function initCharts() {
    // Graphique des utilisateurs actifs
    const usersCtx = document.getElementById('usersChart').getContext('2d');
    usersChart = new Chart(usersCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [{
                label: 'Utilisateurs actifs',
                data: [650, 700, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1248],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 14
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('fr-FR');
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
    
    // Graphique de répartition
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    distributionChart = new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Administrateurs', 'Modérateurs', 'Utilisateurs'],
            datasets: [{
                data: [15, 25, 60],
                backgroundColor: [
                    '#3b82f6',
                    '#8b5cf6',
                    '#10b981'
                ],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// Animation des statistiques
function animateStats() {
    const stats = {
        totalUsers: { element: document.getElementById('total-users'), target: 1248, duration: 2000 },
        newUsers: { element: document.getElementById('new-users'), target: 48, duration: 1500 },
        activityRate: { element: document.getElementById('activity-rate'), target: 68, duration: 1800 },
        avgTime: { element: document.getElementById('avg-time'), target: 4.2, duration: 1600 }
    };
    
    Object.values(stats).forEach(stat => {
        const increment = stat.target / (stat.duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
                current = stat.target;
                clearInterval(timer);
            }
            
            // Formatage spécial pour le temps moyen
            if (stat.element.id === 'avg-time') {
                stat.element.textContent = current.toFixed(1) + 'm';
            } else if (stat.element.id === 'activity-rate') {
                stat.element.textContent = Math.floor(current) + '%';
            } else if (stat.element.id === 'total-users') {
                stat.element.textContent = Math.floor(current).toLocaleString('fr-FR');
            } else {
                stat.element.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Gestion des onglets
function initTabs() {
    const tabLinks = document.querySelectorAll('.sidebar-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer la classe active de tous les onglets
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
            
            // Mettre à jour le titre du header
            const tabName = this.querySelector('i').nextSibling.textContent.trim();
            document.querySelector('header h2').textContent = tabName;
            
            // Fermer le menu mobile si ouvert
            if (window.innerWidth < 768) {
                toggleMobileMenu(false);
            }
        });
    });
}

// Gestion du menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    function toggleMobileMenu(show) {
        if (show === undefined) {
            show = !sidebar.classList.contains('active');
        }
        
        if (show) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
    overlay.addEventListener('click', () => toggleMobileMenu(false));
    
    // Fermer le menu lors du clic sur un lien
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleMobileMenu(false);
            }
        });
    });
}

// Gestion des modales
function initModals() {
    const addUserBtn = document.getElementById('add-user-btn');
    const addUserModal = document.getElementById('add-user-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const addUserForm = document.getElementById('add-user-form');
    
    addUserBtn.addEventListener('click', () => {
        addUserModal.classList.remove('hidden');
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addUserModal.classList.add('hidden');
        });
    });
    
    addUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Créer un nouvel utilisateur
        const newId = usersData.length > 0 ? Math.max(...usersData.map(u => u.id)) + 1 : 1;
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newUser = {
            id: newId,
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            role: this.querySelector('select').value,
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'active',
            avatarColor: randomColor
        };
        
        usersData.unshift(newUser);
        renderUsersTable(usersData, currentPage);
        
        // Fermer la modal et réinitialiser le formulaire
        addUserModal.classList.add('hidden');
        this.reset();
        
        // Mettre à jour les statistiques
        updateStats();
        
        alert('Utilisateur ajouté avec succès !');
    });
    
    // Fermer la modal en cliquant à l'extérieur
    addUserModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
}

// Mise à jour des statistiques après ajout d'utilisateur
function updateStats() {
    const totalUsers = usersData.length;
    const newUsers = usersData.filter(u => {
        const regDate = new Date(u.registrationDate);
        const now = new Date();
        const diffTime = Math.abs(now - regDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }).length;
    
    // Mettre à jour l'affichage
    document.getElementById('total-users').textContent = totalUsers.toLocaleString('fr-FR');
    document.getElementById('new-users').textContent = newUsers;
}

// Gestion des événements de pagination
function initPagination() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.page-btn')) {
            const page = parseInt(e.target.closest('.page-btn').dataset.page);
            currentPage = page;
            renderUsersTable(usersData, currentPage);
        }
        
        if (e.target.closest('.prev-page')) {
            if (currentPage > 1) {
                currentPage--;
                renderUsersTable(usersData, currentPage);
            }
        }
        
        if (e.target.closest('.next-page')) {
            const totalPages = Math.ceil(usersData.length / usersPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderUsersTable(usersData, currentPage);
            }
        }
    });
}

// Gestion des actions sur les utilisateurs
function initUserActions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-user')) {
            const userId = parseInt(e.target.closest('.delete-user').dataset.id);
            const user = usersData.find(u => u.id === userId);
            
            if (confirm(`Voulez-vous vraiment supprimer l'utilisateur "${user.name}" ?`)) {
                usersData = usersData.filter(u => u.id !== userId);
                renderUsersTable(usersData, currentPage);
                updateStats();
                alert(`Utilisateur "${user.name}" supprimé !`);
            }
        }
        
        if (e.target.closest('.edit-user')) {
            const userId = parseInt(e.target.closest('.edit-user').dataset.id);
            const user = usersData.find(u => u.id === userId);
            alert(`Édition de l'utilisateur "${user.name}" (fonctionnalité en développement)`);
        }
        
        if (e.target.closest('.view-user')) {
            const userId = parseInt(e.target.closest('.view-user').dataset.id);
            const user = usersData.find(u => u.id === userId);
            alert(`Détails de l'utilisateur:\n\nNom: ${user.name}\nEmail: ${user.email}\nRôle: ${user.role}\nStatut: ${user.status}\nDate d'inscription: ${user.registrationDate}`);
        }
    });
}

// Recherche globale
function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.search-input, .mobile-search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Pour l'instant, on filtre seulement les utilisateurs
            // On pourrait étendre cette fonctionnalité pour rechercher dans tous les onglets
            filterUsers();
        });
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    renderUsersTable();
    initCharts();
    animateStats();
    initTabs();
    initMobileMenu();
    initModals();
    initPagination();
    initUserActions();
    initGlobalSearch();
    
    // Événements de filtrage
    document.getElementById('user-search').addEventListener('input', filterUsers);
    document.getElementById('filter-role').addEventListener('change', filterUsers);
    document.getElementById('filter-status').addEventListener('change', filterUsers);
    
    // Gestion du changement de période du graphique
    document.getElementById('chart-period').addEventListener('change', function() {
        const period = this.value;
        let newData, labels;
        
        if (period === 'week') {
            newData = [1100, 1150, 1200, 1220, 1230, 1240, 1248];
            labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        } else if (period === 'month') {
            newData = [650, 700, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1248];
            labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        } else {
            newData = [400, 500, 600, 700, 800, 900, 1000, 1100, 1150, 1200, 1220, 1248];
            labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        }
        
        usersChart.data.datasets[0].data = newData;
        usersChart.data.labels = labels;
        usersChart.update();
    });
    
    // Adapter les graphiques au redimensionnement
    window.addEventListener('resize', function() {
        if (usersChart) usersChart.resize();
        if (distributionChart) distributionChart.resize();
    });
});