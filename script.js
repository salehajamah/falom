'use strict';

// ربط عناصر واجهة النسخة الأحادية
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const certificateScreen = document.getElementById('certificate-screen');

const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const issueCertBtn = document.getElementById('issue-certificate-btn');
const printBtn = document.getElementById('print-btn');
const backHomeBtn = document.getElementById('back-home-btn');

const progressBar = document.getElementById('progress-bar');
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const finalScoreEl = document.getElementById('final-score');
const certificatePrompt = document.getElementById('certificate-prompt');
const studentNameInput = document.getElementById('student-name-input');
const certName = document.getElementById('cert-name');
const certDate = document.getElementById('cert-date');

// بنك الأسئلة المطلوب حرفيًا
const questionBank = [
  { question: "أي مما يلي يشمل أكبر عدد من الأنواع؟", options: ["المملكة", "الشعبة", "الطائفة"], answer: "المملكة" },
  { question: "أي الممالك التالية يصنع جميع أفرادها غذاءه بنفسه؟", options: ["الفطريات", "الطلائعيات", "النباتات"], answer: "النباتات" },
  { question: "مخلوق حي عديد الخلايا وليس له جدار خلوي. إلى أي مملكة ينتمي؟", options: ["النباتات", "الحيوانات", "الفطريات"], answer: "الحيوانات" },
  { question: "ما هو أصغر مستوى في التصنيف وتضم أفراده مخلوقات متشابهة جدًا؟", options: ["الجنس", "الرتبة", "النوع"], answer: "النوع" },
  { question: "مملكة مخلوقاتها وحيدة الخلية وبدون نواة، وتعيش في الظروف القاسية.", options: ["البكتيريا", "البدائيات", "الطلائعيات"], answer: "البدائيات" },
  { question: "المشروم والخميرة من أمثلة مملكة...", options: ["النباتات", "الفطريات", "الحيوانات"], answer: "الفطريات" },
  { question: "كيف تحصل الحيوانات على غذائها؟", options: ["تصنعه بنفسها", "تحلل المواد الميتة", "تتغذى على مخلوقات أخرى"], answer: "تتغذى على مخلوقات أخرى" },
  { question: "ما هي الوظيفة الأساسية لعملية التصنيف؟", options: ["تسمية المخلوقات فقط", "تسهيل دراسة المخلوقات", "معرفة أعداد المخلوقات"], answer: "تسهيل دراسة المخلوقات" },
  { question: "البراميسيوم والأميبا من أمثلة مملكة...", options: ["البكتيريا", "الطلائعيات", "البدائيات"], answer: "الطلائعيات" },
  { question: "أي مستوى تصنيفي يجمع الرتب المتقاربة؟", options: ["الشعبة", "الطائفة", "الفصيلة"], answer: "الطائفة" }
];

// حالة التطبيق
let currentIndex = 0;
let selectedSet = [];
let score = 0;
const QUIZ_LENGTH = questionBank.length; // 10
const AUTO_NEXT_DELAY_MS = 1200;

function pickRandomQuestions() {
	// اختيار كل الأسئلة وترتيبها عشوائيًا
	const copy = questionBank.slice();
	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function showOnly(screenEl) {
	[startScreen, quizScreen, resultScreen, certificateScreen].forEach(s => s?.classList.remove('active'));
	screenEl?.classList.add('active');
}

function resetState() {
	currentIndex = 0;
	selectedSet = pickRandomQuestions();
	score = 0;
	updateProgress();
	questionContainer.textContent = '';
	optionsContainer.innerHTML = '';
	certificatePrompt?.classList.add('hidden');
	studentNameInput && (studentNameInput.value = '');
}

function updateProgress() {
	const answered = Math.min(currentIndex, QUIZ_LENGTH);
	const percent = Math.round((answered / QUIZ_LENGTH) * 100);
	progressBar.style.width = `${percent}%`;
}

function renderQuestion() {
	updateProgress();
	const q = selectedSet[currentIndex];
	if (!q) return;

	questionContainer.textContent = `${currentIndex + 1}. ${q.question}`;
	optionsContainer.innerHTML = '';
	const optionEls = q.options.map(opt => {
		const el = document.createElement('div');
		el.className = 'option';
		el.textContent = opt;
		el.addEventListener('click', () => handleOptionClick(el, q.answer, Array.from(optionsContainer.children)));
		return el;
	});
	optionEls.forEach(el => optionsContainer.appendChild(el));
}

function disableOptions(optionEls) {
	optionEls.forEach(l => l.classList.add('disabled'));
}

function handleOptionClick(clickedEl, correctAnswer, optionEls) {
	if (clickedEl.classList.contains('disabled')) return;

	optionEls.forEach(el => { if (el.textContent === correctAnswer) el.classList.add('correct'); });
	if (clickedEl.textContent === correctAnswer) {
		score += 1;
	} else {
		clickedEl.classList.add('incorrect');
	}
	disableOptions(optionEls);
	updateProgress();
	setTimeout(() => {
		currentIndex += 1;
		if (currentIndex >= QUIZ_LENGTH) {
			showResults();
		} else {
			renderQuestion();
		}
	}, AUTO_NEXT_DELAY_MS);
}

function showResults() {
	showOnly(resultScreen);
	finalScoreEl.textContent = `${score} / ${QUIZ_LENGTH}`;
	certificatePrompt?.classList.toggle('hidden', score !== QUIZ_LENGTH);
}

function issueCertificate() {
	const name = studentNameInput?.value.trim();
	if (!name) { 
		studentNameInput?.focus(); 
		return; 
	}
	certName.textContent = name;
	const today = new Date();
	certDate.textContent = new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long' }).format(today);
	showOnly(certificateScreen);
}

// ربط الأحداث
startBtn?.addEventListener('click', () => { 
	resetState(); 
	showOnly(quizScreen); 
	renderQuestion(); 
});

retryBtn?.addEventListener('click', () => { 
	resetState(); 
	showOnly(quizScreen); 
	renderQuestion(); 
});

issueCertBtn?.addEventListener('click', issueCertificate);
printBtn?.addEventListener('click', () => window.print());
backHomeBtn?.addEventListener('click', () => { showOnly(startScreen); });

// إظهار التاريخ الحالي
function updateDate() {
	const today = new Date();
	const dateStr = new Intl.DateTimeFormat('ar-SA', { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	}).format(today);
	document.getElementById('current-date').textContent = dateStr;
}

// إظهار شاشة البداية
updateDate();
showOnly(startScreen);
