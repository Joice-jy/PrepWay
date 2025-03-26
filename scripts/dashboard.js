// document.addEventListener('DOMContentLoaded', function() {
//     // DOM Elements
//     const flashcardsList = document.getElementById('flashcardsList');
//     const quizzesList = document.getElementById('quizzesList');
//     const materialsList = document.getElementById('materialsList');
//     const groupsList = document.getElementById('groupsList');
//     const logoutBtn = document.getElementById('logoutBtn');
    
//     // Get auth token from localStorage
//     function getToken() {
//         return localStorage.getItem('token');
//     }
    
//     // API headers with authentication
//     function getHeaders() {
//         return {
//             'Authorization': `Bearer ${getToken()}`,
//             'Content-Type': 'application/json'
//         };
//     }
    
//     // Load flashcards
//     function loadFlashcards() {
//         if (!flashcardsList) return;
    
//         fetch('/api/study/flashcards', {
//             method: 'GET',
//             headers: getHeaders()
//         })
//         .then(response => response.json())
//         .then(flashcards => {
//             flashcardsList.innerHTML = flashcards.map(card => `
//                 <div class="bg-white p-4 rounded-lg shadow">
//                     <h3 class="font-bold">${card.title}</h3>
//                     <p class="text-gray-600">${card.front}</p>
//                 </div>
//             `).join('');
//         })
//         .catch(error => console.error('Error loading flashcards:', error));
//     }
    
//     // Load quizzes
//     function loadQuizzes() {
//         if (!quizzesList) return;
    
//         fetch('/api/study/quizzes', {
//             method: 'GET',
//             headers: getHeaders()
//         })
//         .then(response => response.json())
//         .then(quizzes => {
//             quizzesList.innerHTML = quizzes.map(quiz => `
//                 <div class="bg-white p-4 rounded-lg shadow">
//                     <h3 class="font-bold">${quiz.title}</h3>
//                     <p class="text-gray-600">${quiz.questions.length} questions</p>
//                 </div>
//             `).join('');
//         })
//         .catch(error => console.error('Error loading quizzes:', error));
//     }
    
//     // Load study materials
//     function loadMaterials() {
//         if (!materialsList) return;
    
//         fetch('/api/study/materials', {
//             method: 'GET',
//             headers: getHeaders()
//         })
//         .then(response => response.json())
//         .then(materials => {
//             materialsList.innerHTML = materials.map(material => `
//                 <div class="bg-white p-4 rounded-lg shadow">
//                     <h3 class="font-bold">${material.title}</h3>
//                     <p class="text-gray-600">${material.description}</p>
//                     ${material.fileUrl ? `<a href="${material.fileUrl}" class="text-blue-600">Download</a>` : ''}
//                 </div>
//             `).join('');
//         })
//         .catch(error => console.error('Error loading materials:', error));
//     }
    
//     // Load study groups
//     function loadGroups() {
//         if (!groupsList) return;
    
//         fetch('/api/study/groups', {
//             method: 'GET',
//             headers: getHeaders()
//         })
//         .then(response => response.json())
//         .then(groups => {
//             groupsList.innerHTML = groups.map(group => `
//                 <div class="bg-white p-4 rounded-lg shadow">
//                     <h3 class="font-bold">${group.name}</h3>
//                     <p class="text-gray-600">${group.members.length} members</p>
//                 </div>
//             `).join('');
//         })
//         .catch(error => console.error('Error loading groups:', error));
//     }
    
//     // Handle file upload
//     const uploadForm = document.getElementById('uploadForm');
//     if (uploadForm) {
//         uploadForm.addEventListener('submit', function(e) {
//             e.preventDefault();
//             const formData = new FormData(uploadForm);
            
//             fetch('/api/study/materials', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${getToken()}`
//                 },
//                 body: formData
//             })
//             .then(response => response.json())
//             .then(() => {
//                 loadMaterials();
//                 uploadForm.reset();
//             })
//             .catch(error => console.error('Error uploading file:', error));
//         });
//     }
    
//     // Handle logout
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', function() {
//             localStorage.removeItem('token');
//             window.location.href = '/';
//         });
//     }
    
//     // Load all data when page loads
//     function loadDashboard() {
//         loadFlashcards();
//         loadQuizzes();
//         loadMaterials();
//         loadGroups();
//     }
    
//     // Check if user is authenticated
//     if (!getToken()) {
//         window.location.href = '/';
//     } else {
//         loadDashboard();
//     }
//     });
   

config/database.js

const mongoose = require('mongoose');

const connectDB = async () => {
try {
await mongoose.connect('mongodb://localhost:27017/prepway', {
useNewUrlParser: true,
useUnifiedTopology: true
});
console.log('MongoDB connected successfully');
} catch (error) {
console.error('MongoDB connection error:', error);
process.exit(1);
}
};

module.exports = connectDB;
