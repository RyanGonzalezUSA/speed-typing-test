var modal = document.getElementById("myModal");

// When the user clicks on the button, open the modal
function openCongratsModal () {
  modal.style.display = "block";
}
function closeCongratsModal () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}