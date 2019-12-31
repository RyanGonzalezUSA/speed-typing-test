const errorAudio = new Audio('/style/sounds/erro.mp3');
const applauseAudio = new Audio('/style/sounds/app-8.mp3');

const scriptContainer = document.querySelector('#scriptContainer');
const testInput = document.querySelector('#testInput');
const wordCount = document.querySelector('#wordCount');
const timer = document.querySelector('#timer');
const testResultSpeed = document.querySelector('#testResultSpeed');
const testResultAccuracy = document.querySelector('#testResultAccuracy');
const btnAddTest = document.querySelector('#btnAddTest');
const mainContainer = document.querySelector('main');
let inTestMode = false;
let scriptWordCount, scriptCharsCount;
let totalErrors = 0;

// convert text to spans, in order to apply css for each individual character.
function initiateTestScript(params) {
  const storedTestScript = localStorage.getItem('test')
  console.log(storedTestScript)
  if(storedTestScript){
    scriptContainer.innerHTML = storedTestScript;
  }
  const testScript = scriptContainer.innerHTML.trim();
  scriptContainer.innerHTML = "";
  testScript.split('').forEach(char => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = char;
    scriptContainer.appendChild(characterSpan);
  });
  // display passage information
  scriptWordCount = testScript.split(' ').length;
  scriptCharsCount = testScript.split('').length;
  wordCount.innerText = `${scriptWordCount} words. ${scriptCharsCount} characters.`;
};

// timer related code
let startTime, testSetInterval, secs;

function startTimer() {
  startTime = new Date();
  testSetInterval = setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000);
}
function getTimerTime() {
  secs = Math.floor((new Date() - startTime) / 1000);
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor((secs - (hours * 3600)) / 60);
  var seconds = secs - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

function stopTimer() {
  clearInterval(testSetInterval);
}

// speed calculation
function updateSpeedAndAccuracyCalc(allTypedEntries, uncorrectedErrors) {
  // calc speed
  let mins = secs / 60;
  const netSpeed = (((allTypedEntries - uncorrectedErrors) / 5) / mins);
  testResultSpeed.innerText = `${netSpeed.toFixed(2)} WPM`

  // calc accuracy
  const accuracy = (((allTypedEntries - totalErrors) / allTypedEntries) * 100)
  testResultAccuracy.innerText = `${accuracy.toFixed(2)} %`
}



window.addEventListener('DOMContentLoaded', (event) => {
  initiateTestScript();
});

testInput.addEventListener('input', (e) => {
  // start timer once test taker start to type
  if (!inTestMode) {
    inTestMode = true;
    startTimer();
  }
  const arraySpans = scriptContainer.querySelectorAll('span');
  const arrayValues = testInput.value;
  let inCorrectChars = 0;

  arraySpans.forEach((charSpan, idx) => {
    const currChar = arrayValues[idx];
    if (!currChar) {
      charSpan.classList.remove('correct');
      charSpan.classList.remove('incorrect');
    } else if (currChar === charSpan.innerText) {
      charSpan.classList.remove('incorrect');
      charSpan.classList.add('correct');
    } else {
      // incorrect inputs
      charSpan.classList.remove('correct');
      charSpan.classList.add('incorrect');
      errorAudio.play();
      inCorrectChars += 1;
    }
  });

  totalErrors += inCorrectChars;
  // update typing speed
  updateSpeedAndAccuracyCalc(arrayValues.length, inCorrectChars);

  // stop timer automatically if test taker finished
  if (arrayValues.length >= arraySpans.length) {
    applauseAudio.play();
    inTestMode = false;
    totalErrors = 0;
    stopTimer();
  }
});

btnAddTest.addEventListener('click', (e) => {
  e.preventDefault();
  fetch('add_test.html')
    .then(data => data.text())
    .then(html => mainContainer.innerHTML = html);
});
