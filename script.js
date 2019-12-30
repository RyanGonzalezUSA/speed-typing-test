// const scriptContainer = document.querySelector('#scriptContainer');
// scriptContainer.addEventListener('blur',function(e){
//   console.dir(e.target.value)
// })


const scriptContainer = document.querySelector('#scriptContainer');
const testInput = document.querySelector('#testInput');
const wordCount = document.querySelector('#wordCount');
const timer = document.querySelector('#timer');
let inTestMode = false;

function initiateTestScript(params) {
  const testScript = scriptContainer.innerHTML;
  scriptContainer.innerHTML = "";
  testScript.split('').forEach(char => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = char;
    scriptContainer.appendChild(characterSpan);
  });

  wordCount.innerText = `${testScript.split(' ').length} words. ${testScript.split('').length} characters.`;
};


let startTime;
let testSetInterval;
function startTimer(params) {
  startTime = new Date();
  testSetInterval = setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000);
}
function getTimerTime() { 
 let secs = Math.floor((new Date() - startTime) / 1000);
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor((secs - (hours * 3600)) / 60);
  var seconds = secs - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

function stopTimer(params) {
  clearInterval(testSetInterval);
}


window.addEventListener('DOMContentLoaded', (event) => {
  initiateTestScript();
});

testInput.addEventListener('input', (e) => {
  // start timer once test taker start to type
  if(!inTestMode){
    inTestMode = true;
    startTimer();
  }
  const arraySpans = scriptContainer.querySelectorAll('span');
  const arrayValues = testInput.value;

  arraySpans.forEach((charSpan, idx) => {
    const currChar = arrayValues[idx];
    if (!currChar) {
      charSpan.classList.remove('correct');
      charSpan.classList.remove('incorrect');
    } else if (currChar === charSpan.innerText) {
      charSpan.classList.remove('incorrect');
      charSpan.classList.add('correct');
    } else {
      charSpan.classList.remove('correct');
      charSpan.classList.add('incorrect');
    }
  });

  
  // stop timer automatically if test taker finished
  if(arraySpans.length === arrayValues.length){
    inTestMode = false;
    stopTimer();
  }
});

