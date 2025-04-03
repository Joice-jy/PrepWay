class Quiz {
    constructor() {
        this.selectedQuestionCount = 0;
        this.uploadedPDF = null;
        this.currentQuiz = null;
        
        // Initialize browser functionality if we're in a browser environment
        if (typeof window !== 'undefined') {
            this.initializeBrowser();
        }
    }

    // Core functionality (works in both Node.js and browser)
    generateQuestions(text, count) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const questions = [];
        
        for (let i = 0; i < Math.min(count, sentences.length); i++) {
            const sentence = sentences[Math.floor(Math.random() * sentences.length)];
            const words = sentence.trim().split(/\s+/);
            
            const randomWordIndex = Math.floor(Math.random() * words.length);
            const answer = words[randomWordIndex];
            words[randomWordIndex] = '_____';
            
            questions.push({
                id: i + 1,
                text: words.join(' '),
                options: [
                    answer,
                    ...sentences
                        .join(' ')
                        .split(/\s+/)
                        .filter(w => w.length > 3)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                ].sort(() => Math.random() - 0.5),
                correctAnswer: answer,
                userAnswer: null
            });
        }
        
        return questions;
    }

    calculateScore(questions) {
        if (!questions || questions.length === 0) return 0;
        const totalQuestions = questions.length;
        const correctAnswers = questions.filter(q => q.userAnswer === q.correctAnswer).length;
        return Math.round((correctAnswers / totalQuestions) * 100);
    }

    validatePDF(file) {
        return file && file.type === 'application/pdf';
    }

    validateQuestionCount(count) {
        return [10, 15, 20].includes(count);
    }

    // Browser-specific functionality
    initializeBrowser() {
        // Add any initialization needed for browser environment
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupBrowserEvents());
        } else {
            this.setupBrowserEvents();
        }
    }

    setupBrowserEvents() {
        // Setup any necessary browser event listeners
    }

    async handlePDFUpload(event) {
        if (!this.isBrowser()) return;

        const file = event.target.files[0];
        if (!file) return;

        if (!this.validatePDF(file)) {
            window.showError?.('Please upload a PDF file');
            event.target.value = '';
            return;
        }

        document.getElementById('selectedFileName').textContent = file.name;
        this.uploadedPDF = file;
        this.updateGenerateButton();
    }

    setQuestionCount(count) {
        if (!this.validateQuestionCount(count)) return;
        this.selectedQuestionCount = count;
        
        if (this.isBrowser()) {
            document.querySelectorAll('[data-count]').forEach(btn => {
                if (parseInt(btn.dataset.count) === count) {
                    btn.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
                    btn.classList.add('bg-primary', 'hover:bg-primary-dark', 'text-white');
                } else {
                    btn.classList.remove('bg-primary', 'hover:bg-primary-dark', 'text-white');
                    btn.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
                }
            });
            this.updateGenerateButton();
        }
    }

    updateGenerateButton() {
        if (!this.isBrowser()) return;
        const generateBtn = document.getElementById('generateQuizBtn');
        generateBtn.disabled = !(this.uploadedPDF && this.selectedQuestionCount > 0);
    }

    async readPDFContent(file) {
        if (!this.isBrowser()) return '';

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(event) {
                try {
                    const typedarray = new Uint8Array(event.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';
                    
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + ' ';
                    }
                    
                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async generateQuiz() {
        if (!this.isBrowser()) return;

        try {
            const generateBtn = document.getElementById('generateQuizBtn');
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Generating...</span>';

            const pdfText = await this.readPDFContent(this.uploadedPDF);
            this.currentQuiz = await this.generateQuestions(pdfText, this.selectedQuestionCount);
            this.displayQuiz(this.currentQuiz);
            
        } catch (error) {
            console.error('Error generating quiz:', error);
            window.showError?.('Failed to generate quiz. Please try again.');
        } finally {
            const generateBtn = document.getElementById('generateQuizBtn');
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-magic"></i><span>Generate Quiz</span>';
        }
    }

    displayQuiz(questions) {
        if (!this.isBrowser()) return;

        const container = document.getElementById('quizQuestions');
        container.innerHTML = questions.map((q, index) => `
            <div class="dashboard-card p-4 mb-4" data-question="${q.id}">
                <p class="font-medium mb-3">Question ${index + 1}: ${q.text}</p>
                <div class="space-y-2">
                    ${q.options.map((option, optIndex) => `
                        <div class="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200" 
                            onclick="quiz.handleAnswerSelection(${q.id}, '${option}', this)">
                            <span class="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600">
                                ${String.fromCharCode(65 + optIndex)}
                            </span>
                            <span class="text-gray-700">${option}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        document.getElementById('quizSection').classList.remove('hidden');
        document.getElementById('quizSection').scrollIntoView({ behavior: 'smooth' });
    }

    handleAnswerSelection(questionId, answer, element) {
        if (!this.isBrowser()) return;

        const questionDiv = element.closest('[data-question]');
        questionDiv.querySelectorAll('.flex.items-center').forEach(opt => {
            opt.classList.remove('bg-primary', 'bg-opacity-10', 'text-primary');
        });
        element.classList.add('bg-primary', 'bg-opacity-10', 'text-primary');
        
        const question = this.currentQuiz.find(q => q.id === questionId);
        if (question) {
            question.userAnswer = answer;
        }
    }

    submitQuiz() {
        if (!this.isBrowser() || !this.currentQuiz) return;
        
        const score = this.calculateScore(this.currentQuiz);
        const totalQuestions = this.currentQuiz.length;
        const correctAnswers = this.currentQuiz.filter(q => q.userAnswer === q.correctAnswer).length;
        
        const quizSection = document.getElementById('quizSection');
        quizSection.innerHTML += `
            <div class="dashboard-card mt-6 text-center ${score >= 70 ? 'bg-green-50' : 'bg-red-50'}">
                <h3 class="text-xl font-bold mb-2 ${score >= 70 ? 'text-green-800' : 'text-red-800'}">
                    Quiz Complete! ${score >= 70 ? '🎉' : '📚'}
                </h3>
                <p class="${score >= 70 ? 'text-green-700' : 'text-red-700'}">
                    You scored ${score}% (${correctAnswers} out of ${totalQuestions} correct)
                </p>
            </div>
        `;

        window.addActivity?.({
            title: 'Quiz Completed',
            meta: `Scored ${score}% on PDF Quiz`,
            icon: 'file-pdf',
            iconBg: 'red',
            iconColor: 'red-600'
        });

        window.updateQuizScore?.(score);
        this.reset();
    }

    reset() {
        this.selectedQuestionCount = 0;
        this.uploadedPDF = null;
        this.currentQuiz = null;

        if (this.isBrowser()) {
            document.getElementById('selectedFileName').textContent = 'No file selected';
            document.getElementById('pdfFile').value = '';
            document.querySelectorAll('[data-count]').forEach(btn => {
                btn.classList.remove('bg-primary', 'hover:bg-primary-dark', 'text-white');
                btn.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
            });
            this.updateGenerateButton();
        }
    }

    // Utility method to check environment
    isBrowser() {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Quiz;
}

// Initialize for browser
if (typeof window !== 'undefined') {
    window.Quiz = Quiz;
    window.quiz = new Quiz();
}
