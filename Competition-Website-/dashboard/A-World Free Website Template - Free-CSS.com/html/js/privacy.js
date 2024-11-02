// Get modal elements
const modal = document.getElementById("termsModal");
const modalTitle = document.getElementById("termsTitle");
const closeBtn = document.querySelector(".close-btn");

// Open the modal when the title is clicked
modalTitle.addEventListener("click", function() {
  modal.style.display = "flex";
});

// Close the modal when the close button is clicked
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

// Close the modal if the user clicks outside of it
window.addEventListener("click", function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
