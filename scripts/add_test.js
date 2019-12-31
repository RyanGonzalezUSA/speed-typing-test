function testTemplateInputChange(e) {
  const testTemplateInfo = document.querySelector('#testTemplateInfo');
  const templateText = e.target.value;
  const wordCount = templateText.split(' ').length;
  const charCount = templateText.split('').length;
  testTemplateInfo.innerText = `${wordCount} words. ${charCount} characters.`  
}

function saveTemplate(e) {
  e.preventDefault();
  const testTemplateInput = document.querySelector('#testTemplateInput');
  const templateText = testTemplateInput.value;
  localStorage.setItem('test', templateText)
}