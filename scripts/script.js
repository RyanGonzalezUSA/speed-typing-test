// sound related variables
const errorAudio = new Audio('./style/sounds/erro.mp3');
const applauseAudio = new Audio('./style/sounds/app-8.mp3');
let withSound = false;

// dom variables
const scriptContainer = document.querySelector('#scriptContainer');
const btnToggleSound = document.querySelector('#toggleSound');
const testInput = document.querySelector('#testInput');
const wordCount = document.querySelector('#wordCount');
const timer = document.querySelector('#timer');
const testResultSpeed = document.querySelector('#testResultSpeed');
const testResultAccuracy = document.querySelector('#testResultAccuracy');
const btnAddTest = document.querySelector('#btnAddTest');
const btnEndTest = document.querySelector('#btnEndTest');
const mainContainer = document.querySelector('main');

// timer variables
let startTime, testSetInterval, secs;

// car related variables
const carEle = document.querySelector("#car");
const carContainer = document.querySelector("#carContainer");
let carTrackWidth = 0;
let carStep = 0;

// other variables
let inTestMode = false;
let scriptWordCount, scriptCharsCount;
let totalErrors = 0;

// get car track width
function updateCarTrackWidth() {
  carTrackWidth = carContainer.clientWidth;
  carStep = carTrackWidth / scriptCharsCount;
}

// convert text to spans, in order to apply css for each individual character.
function initiateTestScript() {
  const storedTestScript = localStorage.getItem('test')
  if (storedTestScript) {
    scriptContainer.innerText = storedTestScript;
  }
  const testScript = scriptContainer.innerText.trim();
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

// timer related functions
// invoke updateCarTrackWidth at test start

function startTimer() {
  updateCarTrackWidth();
  startTime = new Date();
  testSetInterval = setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000);
};

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

// end test function
function endTest(event) {
  if (event) event.preventDefault();
  if (withSound) applauseAudio.play();
  inTestMode = false;
  totalErrors = 0;
  stopTimer();
}

// typing speed and accuracy calculation
function updateSpeedAndAccuracyCalc(allTypedEntries, uncorrectedErrors) {
  // calc speed
  let mins = secs / 60;
  const netSpeed = (((allTypedEntries - uncorrectedErrors) / 5) / mins);
  testResultSpeed.innerText = `${netSpeed.toFixed(2)} WPM`

  // calc accuracy
  const accuracy = (((allTypedEntries - totalErrors) / allTypedEntries) * 100)
  testResultAccuracy.innerText = `${accuracy.toFixed(2)} %`
}

// event listeners
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
      if (withSound) {
        errorAudio.play();
      }
      inCorrectChars += 1;
    }
    moveCar(arrayValues.length - inCorrectChars);
  });

  totalErrors += inCorrectChars;
  // update typing speed
  updateSpeedAndAccuracyCalc(arrayValues.length, inCorrectChars);

  // stop timer automatically if test taker finished
  if (arrayValues.length >= arraySpans.length) {
    
    openCongratsModal();
    endTest();
  }
});

btnAddTest.addEventListener('click', (e) => {
  e.preventDefault();
  fetch('add_test.html')
    .then(data => data.text())
    .then(html => mainContainer.innerHTML = html);
});

// btnToggleSound event listener
function toggleSoundEffects() {
  btnToggleSound.className = '';
  withSound = !withSound;
  if (withSound) {
    btnToggleSound.classList.add("mic", "fas", "fa-volume-up")
  } else {
    btnToggleSound.classList.add("mic", "fas", "fa-volume-mute")
  }
};


btnEndTest.addEventListener('click', endTest);


// car functionality


function moveCar(steps) {
  const moveTo = steps * carStep;
  setTimeout(function () {
    carEle.style.webkitTransitionDuration = "0.3s";
    carEle.style.webkitTransitionTimingFunction = "ease-out";
    carEle.style.webkitTransform = `translate3d(${moveTo}px, 0, 0)`;
  }, 0);
}