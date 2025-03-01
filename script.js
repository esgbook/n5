// 載入題庫並隨機選取 5 題
let questions = [];
let currentQuestionIndex = 0;
let selectedQuestions = [];

fetch('20.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        questions = data;
        selectedQuestions = getRandomQuestions(questions, 5);
        loadQuestion();
    })
    .catch(error => {
        console.error('無法載入題庫:', error);
        document.getElementById('question-container').innerHTML = '<p>無法載入題庫，請檢查檔案或聯繫管理員。</p>';
    });

// 隨機選取指定數量的題目
function getRandomQuestions(array, num) {
    if (array.length < num) {
        console.error('題庫題目數量不足');
        return [];
    }
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// 載入當前題目
function loadQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        showCompletionScreen();
        return;
    }

    const q = selectedQuestions[currentQuestionIndex];
    document.getElementById('question-number').textContent = `題號: ${q.題號}`;
    document.getElementById('question-text').textContent = q.題目;
    document.getElementById('option1').textContent = q.選項1;
    document.getElementById('option2').textContent = q.選項2;
    document.getElementById('option3').textContent = q.選項3;
    document.getElementById('option4').textContent = q.選項4;
    document.getElementById('user-answer').value = '';
    document.getElementById('result-icon').textContent = '';
    document.getElementById('explanation').classList.add('hidden');
}

// 監聽答案輸入
document.getElementById('user-answer').addEventListener('input', function() {
    const userAnswer = parseInt(this.value);
    const correctAnswer = selectedQuestions[currentQuestionIndex].答案;

    if (userAnswer >= 1 && userAnswer <= 4) {
        if (userAnswer === correctAnswer) {
            document.getElementById('result-icon').textContent = '◯';
            document.getElementById('result-icon').className = 'correct';
            setTimeout(nextQuestion, 1000); // 1 秒後下一題
        } else {
            document.getElementById('result-icon').textContent = '✗';
            document.getElementById('result-icon').className = 'incorrect';
            showExplanation();
            setTimeout(nextQuestion, 10000); // 10 秒後下一題
        }
        this.disabled = true; // 防止重複輸入
    }
});

// 顯示解析
function showExplanation() {
    const q = selectedQuestions[currentQuestionIndex];
    const explanationDiv = document.getElementById('explanation');
    explanationDiv.innerHTML = `<strong>正確答案: ${q.答案}</strong><br>${q.解析}`;
    explanationDiv.classList.remove('hidden');
}

// 下一題
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// 顯示完成畫面
function showCompletionScreen() {
    document.getElementById('question-container').innerHTML = '<h2>OK！測驗完成</h2>';
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000); // 3 秒後返回首頁
}

// 中途未完成時返回首頁
let inactivityTimeout = setTimeout(() => {
    window.location.href = 'index.html';
}, 30000); // 30 秒無操作返回首頁

document.addEventListener('mousemove', () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        window.location.href = 'index.html';
    }, 30000);
});