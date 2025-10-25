document.addEventListener('DOMContentLoaded', () => {

    // --- Логика для плавного появления блоков при скролле ---
    // Этот код найдет все элементы с классом .fade-in и добавит им класс .visible,
    // когда они появятся на экране, запуская CSS-анимацию.
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // отслеживать относительно вьюпорта
        rootMargin: '0px',
        threshold: 0.1 // запустить, когда 10% элемента видно
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Если элемент пересекает вьюпорт
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Прекратить наблюдение за этим элементом после того, как он появился
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Начать наблюдение за каждым элементом
    fadeInElements.forEach(el => {
        observer.observe(el);
    });


    // --- Логика для интерактивного теста ---
    // Данные для теста
    const quizData = [
        {
            question: "Что такое HTML?",
            answers: [
                { text: "Язык программирования", correct: false },
                { text: "Язык разметки для создания веб-страниц", correct: true },
                { text: "База данных", correct: false },
                { text: "Стили для сайта", correct: false }
            ]
        },
        {
            question: "Какой CSS-свойство отвечает за цвет фона?",
            answers: [
                { text: "color", correct: false },
                { text: "font-size", correct: false },
                { text: "background-color", correct: true },
                { text: "border", correct: false }
            ]
        },
        {
            question: "С помощью какого тега создаются ссылки?",
            answers: [
                { text: "<p>", correct: false },
                { text: "<div>", correct: false },
                { text: "<h1>", correct: false },
                { text: "<a>", correct: true }
            ]
        }
    ];

    // Находим все необходимые элементы на странице
    const questionElement = document.getElementById('question-text');
    const answerButtonsElement = document.getElementById('answers-buttons');
    const nextButton = document.getElementById('next-btn');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const restartButton = document.getElementById('restart-btn');

    // Проверяем, существуют ли элементы теста на текущей странице
    if (!quizContainer) {
        return; // Если это не страница с тестом, прекращаем выполнение скрипта
    }

    let currentQuestionIndex = 0;
    let score = 0;

    // Функция для запуска или перезапуска теста
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizContainer.style.display = 'block';
        resultContainer.style.display = 'none';
        nextButton.innerHTML = 'Следующий вопрос';
        showQuestion();
    }

    // Функция для отображения текущего вопроса и вариантов ответа
    function showQuestion() {
        resetState();
        let currentQuestion = quizData[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1;
        questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = answer.text;
            button.classList.add('answer-btn');
            answerButtonsElement.appendChild(button);
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
        });
    }

    // Функция для сброса состояния перед показом нового вопроса
    function resetState() {
        nextButton.style.display = 'none';
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    // Функция, которая срабатывает при выборе ответа
    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';
        if (isCorrect) {
            selectedBtn.classList.add('correct');
            score++;
        } else {
            selectedBtn.classList.add('wrong');
        }

        // Показываем правильный ответ и блокируем все кнопки
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
            button.disabled = true;
        });
        nextButton.style.display = 'block';
    }

    // Функция для отображения финального результата
    function showScore() {
        resetState();
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        const percentage = Math.round((score / quizData.length) * 100);
        resultText.innerHTML = `Вы правильно ответили на ${score} из ${quizData.length} вопросов (${percentage}%)!`;
    }

    // Обработчик для кнопки "Следующий вопрос"
    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < quizData.length) {
            handleNextButton();
        } else {
            startQuiz();
        }
    });

    restartButton.addEventListener('click', startQuiz);

    // Запускаем тест при загрузке страницы
    startQuiz();
});
