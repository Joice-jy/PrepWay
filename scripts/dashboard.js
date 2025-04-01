// Utility Functions
function getToken() {
    return localStorage.getItem('token');
}

function getUserData() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
}

function getHeaders() {
    return {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
    };
}

function showError(message) {
    const toast = document.getElementById('errorToast');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    toast.classList.remove('translate-y-full', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
    }, 3000);
}

// Profile Functions
function toggleProfile() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('hidden');
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('quizScores');
    window.location.href = '/';
}

// Notification Functions
function toggleNotif() {
    const box = document.getElementById('notif-box');
    box.classList.toggle('hidden');
}

// Data Loading Functions
function getUserProfile() {
    try {
        const userData = getUserData();
        if (!userData) {
            throw new Error('No user data found');
        }
        
        // Update profile elements
        document.getElementById('profileName').textContent = userData.name || 'User';
        document.getElementById('profileImg').src = userData.avatar || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}`;
        document.getElementById('welcomeMessage').textContent = 
            `Welcome back, ${userData.firstName || userData.name?.split(' ')[0] || 'User'}! 👋`;
        
        return userData;
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Unable to load profile data');
    }
}

function loadQuizScore() {
    try {
        const quizScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        const scoreElement = document.getElementById('quizScore');
        
        if (quizScores.length > 0) {
            // Calculate average score
            const averageScore = Math.round(
                quizScores.reduce((acc, score) => acc + score, 0) / quizScores.length
            );
            scoreElement.textContent = `${averageScore}%`;
        } else {
            scoreElement.textContent = 'No Quiz';
        }
        
        scoreElement.classList.add('animate-fade-in');
        return quizScores;
    } catch (error) {
        console.error('Error loading quiz score:', error);
        showError('Unable to load quiz score');
    }
}

function loadStudyStats() {
    try {
        const stats = {
            studyTime: { 
                id: 'studyTime', 
                value: localStorage.getItem('totalStudyTime') || '0 hrs' 
            },
            completedTasks: { 
                id: 'completedTasks', 
                value: `${localStorage.getItem('completedTasks') || '0'} Tasks` 
            },
            flashcardCount: { 
                id: 'flashcardCount', 
                value: localStorage.getItem('flashcardCount') || '0' 
            }
        };

        Object.values(stats).forEach(({ id, value }) => {
            const element = document.getElementById(id);
            element.textContent = value;
            element.classList.add('animate-fade-in');
        });
        
        return stats;
    } catch (error) {
        console.error('Error loading study stats:', error);
        showError('Unable to load study statistics');
    }
}

function loadActivityFeed() {
    try {
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        const feedContainer = document.getElementById('activityFeed');
        
        if (activities.length === 0) {
            feedContainer.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    No activities yet
                </div>
            `;
            return [];
        }
        
        feedContainer.innerHTML = activities.map(activity => `
            <div class="activity-item animate-fade-in">
                <div class="activity-icon bg-${activity.iconBg || 'indigo'}-100">
                    <i class="fas fa-${activity.icon || 'check'} text-${activity.iconColor || 'primary'}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-title">${activity.title}</p>
                    <p class="activity-meta">${activity.meta}</p>
                </div>
            </div>
        `).join('');
        
        return activities;
    } catch (error) {
        console.error('Error loading activity feed:', error);
        showError('Unable to load activity feed');
    }
}

function loadStudyMaterials() {
    try {
        const materials = JSON.parse(localStorage.getItem('studyMaterials') || '[]');
        const materialsContainer = document.getElementById('studyMaterialsList');
        
        if (materials.length === 0) {
            materialsContainer.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    No study materials available
                </div>
            `;
            return [];
        }
        
        materialsContainer.innerHTML = materials.map(material => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-fade-in">
                <div class="flex items-center">
                    <i class="fas fa-${material.icon || 'file'} text-${material.iconColor || 'primary'} text-xl mr-3"></i>
                    <div>
                        <p class="text-sm font-medium text-gray-900">${material.title}</p>
                        <p class="text-xs text-gray-500">${material.meta}</p>
                    </div>
                </div>
                <button onclick="downloadMaterial('${material.id}')" class="text-primary hover:text-indigo-600">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `).join('');
        
        return materials;
    } catch (error) {
        console.error('Error loading study materials:', error);
        showError('Unable to load study materials');
    }
}

function loadNotifications() {
    try {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notificationList = document.getElementById('notificationList');
        const notificationCount = document.getElementById('notificationCount');
        
        notificationCount.textContent = notifications.length;
        
        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <p class="text-center text-gray-500">No new notifications</p>
            `;
            return [];
        }
        
        notificationList.innerHTML = notifications.map(notif => `
            <p class="mb-2">${notif.icon} ${notif.message}</p>
        `).join('');
        
        return notifications;
    } catch (error) {
        console.error('Error loading notifications:', error);
        showError('Unable to load notifications');
    }
}

// Update Functions
function updateQuizScore(newScore) {
    try {
        const quizScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        quizScores.push(newScore);
        localStorage.setItem('quizScores', JSON.stringify(quizScores));
        loadQuizScore(); // Refresh the display
        
        // Add to activity feed
        addActivity({
            title: 'Quiz Completed',
            meta: `Scored ${newScore}%`,
            icon: 'star',
            iconBg: 'yellow',
            iconColor: 'yellow-600'
        });
    } catch (error) {
        console.error('Error updating quiz score:', error);
        showError('Unable to update quiz score');
    }
}

function addActivity(activity) {
    try {
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        activities.unshift({
            ...activity,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('activities', JSON.stringify(activities.slice(0, 10))); // Keep only last 10 activities
        loadActivityFeed(); // Refresh the display
    } catch (error) {
        console.error('Error adding activity:', error);
        showError('Unable to add activity');
    }
}

function updateStudyTime(minutes) {
    try {
        const currentTime = parseInt(localStorage.getItem('totalStudyTime')) || 0;
        const newTime = currentTime + minutes;
        localStorage.setItem('totalStudyTime', `${Math.round(newTime / 60)} hrs`);
        loadStudyStats(); // Refresh the display
        
        // Add to activity feed
        addActivity({
            title: 'Study Session',
            meta: `Studied for ${minutes} minutes`,
            icon: 'clock',
            iconBg: 'indigo',
            iconColor: 'primary'
        });
    } catch (error) {
        console.error('Error updating study time:', error);
        showError('Unable to update study time');
    }
}

// Initialize Demo Data
function initializeDemoData() {
    // Only initialize if data doesn't exist
    if (!localStorage.getItem('userData')) {
        // Demo user data
        localStorage.setItem('userData', JSON.stringify({
            name: 'John Doe',
            firstName: 'John',
            email: 'john@example.com',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe'
        }));

        // Demo quiz scores
        localStorage.setItem('quizScores', JSON.stringify([85, 92, 78, 95]));

        // Demo study stats
        localStorage.setItem('totalStudyTime', '12 hrs');
        localStorage.setItem('completedTasks', '24');
        localStorage.setItem('flashcardCount', '150');

        // Demo activities
        localStorage.setItem('activities', JSON.stringify([
            {
                title: 'Quiz Completed',
                meta: 'Scored 95% on Advanced Math',
                icon: 'star',
                iconBg: 'yellow',
                iconColor: 'yellow-600',
                timestamp: new Date().toISOString()
            },
            {
                title: 'Study Session',
                meta: 'Studied for 45 minutes',
                icon: 'clock',
                iconBg: 'indigo',
                iconColor: 'primary',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
                title: 'Flashcards Created',
                meta: 'Added 10 new flashcards',
                icon: 'layer-group',
                iconBg: 'purple',
                iconColor: 'purple-600',
                timestamp: new Date(Date.now() - 7200000).toISOString()
            }
        ]));

        // Demo study materials
        localStorage.setItem('studyMaterials', JSON.stringify([
            {
                id: '1',
                title: 'Advanced Mathematics Notes',
                meta: 'Updated 2 hours ago',
                icon: 'book',
                iconColor: 'primary'
            },
            {
                id: '2',
                title: 'Physics Formulas',
                meta: 'Updated yesterday',
                icon: 'atom',
                iconColor: 'green-600'
            },
            {
                id: '3',
                title: 'Chemistry Lab Guide',
                meta: 'Updated 3 days ago',
                icon: 'flask',
                iconColor: 'purple-600'
            }
        ]));

        // Demo notifications
        localStorage.setItem('notifications', JSON.stringify([
            {
                icon: '🎯',
                message: 'You\'ve completed today\'s study goal!'
            },
            {
                icon: '📚',
                message: 'New study materials available'
            },
            {
                icon: '🌟',
                message: 'You\'ve earned a new achievement!'
            }
        ]));

        // Demo token
        localStorage.setItem('token', 'demo-token-123');
    }
}

// Initialize Dashboard
function loadDashboard() {
    // Initialize demo data
    initializeDemoData();

    if (!getToken()) {
        window.location.href = '/';
        return;
    }

    try {
        // Load all dashboard data
        getUserProfile();
        loadQuizScore();
        loadStudyStats();
        loadActivityFeed();
        loadStudyMaterials();
        loadNotifications();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Some dashboard components failed to load');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadDashboard);

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const profileDropdown = document.getElementById('profile-dropdown');
    const notifBox = document.getElementById('notif-box');
    
    if (!event.target.closest('.profile-button') && !profileDropdown.classList.contains('hidden')) {
        profileDropdown.classList.add('hidden');
    }
    
    if (!event.target.closest('.notification-button') && !notifBox.classList.contains('hidden')) {
        notifBox.classList.add('hidden');
    }
});

// Export update functions for external use
window.updateQuizScore = updateQuizScore;
window.updateStudyTime = updateStudyTime;
window.addActivity = addActivity;



function openProfile() {
  document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfile() {
  document.getElementById('profileModal').classList.add('hidden');
}

function saveProfile() {
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('profileEmail').value;

  const profileNameDisplay = document.querySelector('.profile-button span');
  if (profileNameDisplay) profileNameDisplay.textContent = name;

  closeProfile();
  alert("Profile updated!");
}










