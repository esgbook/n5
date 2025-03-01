document.addEventListener("DOMContentLoaded", () => {
    const csvUrl = "bookex.csv"; // 假設 CSV 檔案在根目錄
    let questions = [];
    let selectedQuestions = [];
    let currentQuestionIndex = 0;

    // 解析 CSV 檔案
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            questions = parseCSV(data);
            startQuiz();
        })
        .catch(error => console.error("載入題庫失敗:", error));

    function parseCSV(data) {
        const rows = data.trim().split("\n").slice(1); // 移除標題行
        return rows.map(row => {
            const [answer, number, question, opt1, opt2, opt3, opt4, explanation] = row.split(",");
            return {
                answer: parseInt(answer),
                number,
                question,
                options: [opt1, opt2, opt3, opt4],
                explanation
            };
        });
    }

    function startQuiz() {
        // 隨機選 5 題
        selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
        showQuestion();
    }

    function showQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            showCompletion();
            return;
        }

        const q = selectedQuestions[currentQuestionIndex];
        document.getElementById("question-number").textContent = `題號: ${q.number}`;
        document.getElementById("question-text").textContent = q.question;
        
        const optionsList = document.getElementById("options");
        optionsList.innerHTML = "";
        q.options.forEach((opt, idx) => {
            const li = document.createElement("li");
            li.textContent = `${idx + 1}. ${opt}`;
            optionsList.appendChild(li);
        });

        const answerInput = document.getElementById("user-answer");
        const resultSpan = document.getElementById("result");
        const explanationDiv = document.getElementById("explanation");
        answerInput.value = "";
        resultSpan.textContent = "";
        explanationDiv.style.display = "none";

        answerInput.focus();
        answerInput.oninput = () => checkAnswer(q, answerInput.value);
    }

    function checkAnswer(question, userAnswer) {
        const resultSpan = document.getElementById("result");
        const explanationDiv = document.getElementById("explanation");
        const userAns = parseInt(userAnswer);

        if (userAns >= 1 && userAns <= 4) {
            if (userAns === question.answer) {
                resultSpan.className = "correct";
                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion();
                }, 1000); // 1秒後下一題
            } else {
                resultSpan.className = "wrong";
                explanationDiv.textContent = `答案: ${question.answer} - ${question.explanation}`;
                explanationDiv.style.display = "block";
                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion();
                }, 10000); // 10秒後下一題
            }
        }
    }

    function showCompletion() {
        const container = document.getElementById("question-container");
        container.innerHTML = "<h2>OK</h2><p>測驗完成！</p>";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000); // 3秒後返回首頁
    }

    // 中途未完成時返回首頁（假設 60 秒無操作）
    let timeout = setTimeout(() => {
        window.location.href = "index.html";
    }, 60000);

    document.addEventListener("mousemove", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            window.location.href = "index.html";
        }, 60000);
    });
});