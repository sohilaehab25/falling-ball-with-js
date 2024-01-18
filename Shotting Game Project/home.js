const submitbutton = document.getElementById("playButton");
const input = document.getElementById("username");

input.addEventListener("input", (e) => {
  submitbutton.disabled = e.currentTarget.value === "";
});

function redirectToGame() {
  const userName = document.getElementById("username").value;
  const hardLevelRadio = document.getElementById("hardLevel");
  const easyLevelRadio = document.getElementById("easyLevel");

  // Check if both username and level are selected
  if (userName !== "" && (hardLevelRadio.checked || easyLevelRadio.checked)) {
    const selectedLevel = hardLevelRadio.checked ? "Hard" : "Easy";
    localStorage.setItem(
      "object",
      JSON.stringify({ name: userName, score: 0 })
    );
    localStorage.setItem("selectedLevel", selectedLevel);
    window.location.href = `game.html?user=${userName}&level=${selectedLevel}`;
  } else {
    // Show an error dialog or handle it in some way
    Swal.fire({
      icon: "error",
      text: "Please Enter Your Name and Choose a Level!",
    });
  }
}
