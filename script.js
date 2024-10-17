const musicURL = 'https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple';
const televisionURL = 'https://opentdb.com/api.php?amount=10&category=14&difficulty=easy&type=multiple';

let questions = [];
let currentQuestionIndex = 0;
let points = 0;
let tvClick = false;
let timer = 0;


const musicCategory = document.querySelector('#first-category');
const tvCategory = document.querySelector('#second-category'); 
const option1 = document.querySelector('#first-question');
const option2 = document.querySelector('#second-question');
const option3 = document.querySelector('#third-question');
const option4 = document.querySelector('#fourth-question');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button')
let scoreText = document.querySelector('#score')
let timerText = document.querySelector('#timer')
let questionHead = document.querySelector('#question');

// Containers
const startContainer = document.querySelector('#start-container');
const questionContainer = document.querySelector('#question-container');
const resultContainer = document.querySelector('#result-container');


// Visa startContainer när spelet börjar
startContainer.style.display = 'flex';
questionContainer.style.display = 'none';
resultContainer.style.display = 'none';

// Starta spelet när användaren väljer en kategori
musicCategory.addEventListener('click', () => {
    resetCategorySelection();
    musicCategory.style.backgroundColor = 'green';
    musicCategory.style.color = 'white';
    tvClick = false; // Musikkategori vald
});

tvCategory.addEventListener('click', () => {
    resetCategorySelection();
    tvCategory.style.backgroundColor = 'green';
    tvCategory.style.color = 'white';
    tvClick = true; // TV-kategori vald
});
// Starta spelet och hämta frågorna
startButton.addEventListener('click', () => {
    startContainer.style.display = 'none';
    questionContainer.style.display = 'flex';
    startTimer();
    if (tvClick) {
        fetchQuestions(televisionURL);
    } else {
        fetchQuestions(musicURL);
    }
});
restartButton.addEventListener('click', ()=>{
    location.reload()
})

// Återställ kategoriutseende
function resetCategorySelection() {
    musicCategory.style.backgroundColor = '';
    musicCategory.style.color = '';
    tvCategory.style.backgroundColor = '';
    tvCategory.style.color = '';
}

// Hämta frågorna baserat på URL
function fetchQuestions(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            currentQuestionIndex = 0;
            points = 0;
            displayQuestion();
        })
        .catch(error => console.error('Något gick fel, pröva igen!', error));
}

// Översätt API till HTML
function decodeHTML(html) {
    const text = document.createElement('textarea');
    text.innerHTML = html;
    return text.value;
}

// Lägg till eventlyssnare en gång när spelet startar
option1.addEventListener('click', () => {
    checkAnswer(option1);
});
option2.addEventListener('click', () => {
    checkAnswer(option2);
});
option3.addEventListener('click', () => {
    checkAnswer(option3);
});
option4.addEventListener('click', () => {
    checkAnswer(option4);
});

// Visa frågan och alternativen
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionHead.textContent = decodeHTML(currentQuestion.question); 

    // Shuffla svaren
    const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
    shuffleArray(answers);

    // Visa alternativen och översätt krumelurerna till HTML 
    option1.textContent = decodeHTML(answers[0]);
    option2.textContent = decodeHTML(answers[1]);
    option3.textContent = decodeHTML(answers[2]);
    option4.textContent = decodeHTML(answers[3]);

    // Spara det rätta svaret för att kunna jämföra
    option1.dataset.correct = (answers[0] === currentQuestion.correct_answer);
    option2.dataset.correct = (answers[1] === currentQuestion.correct_answer);
    option3.dataset.correct = (answers[2] === currentQuestion.correct_answer);
    option4.dataset.correct = (answers[3] === currentQuestion.correct_answer);
}

function checkAnswer(selectedOption) {
    const isCorrect = selectedOption.dataset.correct === "true"; 
    selectedOption.style.border = '6px solid green';
    selectedOption.style.zIndex = '10';

    setTimeout(() => {
        if (isCorrect) {
            selectedOption.style.backgroundColor = 'green';
            points++;
        } else {
            selectedOption.style.backgroundColor = 'red';
            showCorrectAnswer();
        }
    }, 1500);

    // Vänta 3 sekunder innan nästa fråga visas
    setTimeout(() => {
        resetOptionStyles();
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }, 3000);
}

// Återställ stilarna på alternativen
function resetOptionStyles() {
    const options = [option1, option2, option3, option4];
    options.forEach(option => {
        option.style.border = '';
        option.style.backgroundColor = '';
        option.style.zIndex = '';
    });
}


// Visa rätt svar och få det att blinka om fel svar valdes
function showCorrectAnswer() {
    const options = [option1, option2, option3, option4];

    // En loop som går igenom varje alternativ och låter det rätta svar blinka grönt OM det INTE har valts
    options.forEach(option => {
        if (option.dataset.correct === "true" && option.style.backgroundColor !== 'green') {
            let blinkInterval = setInterval(() => {
                if (option.style.backgroundColor === 'green') {
                    option.style.backgroundColor = '';
                } else {
                    option.style.backgroundColor = 'green';
                }
            }, 400);
            setTimeout(() => clearInterval(blinkInterval), 1500);
        }
    });

}

// Visa resultat
function showResults() {
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'flex';
    scoreText.textContent = `You got ${points} / ${questions.length} questions correct!`;
    timerText.textContent = `And you did it in ${timer} seconds!`;
}

function startTimer(){
    timer = 0
    const interval = setInterval(() => {
        timer++
    }, 1000);
}

// En funktion för att shuffla
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
