window.onload = function () {
  let username = JSON.parse(localStorage.getItem("object"));
  let selectedLevel = localStorage.getItem("selectedLevel");
  if (username && username.name) {
    Swal.fire({
      title: `Welcome ${username.name}`,
      text: `Your Last Score was ${username.score}.\n Your Level Is ${selectedLevel}`,
      confirmButtonText: "Ok",
    });
  }
};

// timer of start
document
  .querySelector(".control-button")
  .addEventListener("click", function () {
    setTimeout(function () {
      document.querySelector(".control-button").remove();
    }, 1000);
  });
const canvas = document.getElementById("shoot");
const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

//for score;
const scoreElement = document.querySelector("#scoreElement");
const startButton = document.querySelector("#startButton");
const controlButton = document.querySelector(".control-button");
let gameInProgress = false;
let timeInSeconds = 120;
let score = 0;
let firedBulletsCount = 1; 



const player1 = new player(
  (this.width = canvas.width / 2),
  (this.height = canvas.height / 1.3),
  20,
  "#f5caca"
);

const arrpolit = [];
const arrenemies = [];


function updateTimer() {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2)}:${String(
    seconds
  ).padStart(2, "0")}`;

  document.getElementById("timer").innerText = formattedTime;

  // when time is out
  if (timeInSeconds === 0) {
    clearInterval(timerInterval); // Stop the timer
    Swal.fire({
      icon: "warning",
      title: "Oops! Time Is Out",
      text: "Do you want to end the game?",
      showCancelButton: true,
      confirmButtonText: "End Game",
      cancelButtonText: "Return to Home",
    }).then((result) => {
      if (result.isConfirmed) {
        window.close(); //
      } else {
        window.location.href = "home.html";
      }
    });
  } else {
    timeInSeconds--;
  }
}

const timerInterval = setInterval(updateTimer, 1000);

// detect the user want easy or hard level
function detectenemy() {
  let level = localStorage.getItem("selectedLevel");
  let lev = 0;
  if (level === "Easy") {
    lev = 1000;
  } else {
    lev = 100;
  }
  setInterval(() => {
    const redius = Math.random() * (50 - 8) + 8;
    let top;
    let left;

    if (Math.random() < 0.5) {
      top = Math.random() < 0.5 ? 0 - redius : canvas.width + redius;

      left = 50;

      // console.log("left", left);
      // console.log("top", top);
    } 
    else {
      top = Math.random() * canvas.width;
      left = 50;
      // console.log("left", left);
      // console.log("top", top);
    }
    const color = `hsl(${Math.random() * 360} ,50%,50%)`;

    const angle = 1.6;

    const volicity = {
      top: Math.cos(angle),
      left: Math.sin(angle),
    };

    arrenemies.push(new enemy(top, left, redius, color, volicity));
  }, lev);
}


function anemation() {
  if (!gameInProgress) {
    return;
  }

  let anemationid = requestAnimationFrame(anemation);

  // when user win
  if (score >= 300) {
    cancelAnimationFrame(anemationid);
    const username = JSON.parse(localStorage.getItem("object"));
    Swal.fire({
      icon: "success",
      title: `Congratulations ${username.name}!`,
      text: `You have won with a score of ${score}.`,
    });
  }

  context.fillStyle = "rgba(0, 0, 0, .6)";

  context.fillRect(0, 0, canvas.width, canvas.height);

  player1.draw();
  arrpolit.forEach((polit, index) => {
    polit.update();

    //to remove polit when it exit from the window when it shoot the enemy;
    if (
      polit.top + polit.redius < 0 ||
      polit.top - polit.redius > canvas.width ||
      polit.left + polit.redius < 0 ||
      polit.left - polit.redius > canvas.height
    ) {
      setTimeout(() => {
        arrpolit.splice(index, 1);
      }, 0);
    }
  });

  arrenemies.forEach((enemy, index) => {
    enemy.update();

    let dist = Math.hypot(player1.top - enemy.top, player1.left - enemy.left);

    //end the game
    if (dist - enemy.redius - player1.redius < 1) {
      cancelAnimationFrame(anemationid);

      Swal.fire({
        icon: "warning",
        title: "Oops! Game Over",
        text: " Do you want to end the game?",
        showCancelButton: true,
        confirmButtonText: "End Game",
        cancelButtonText: "Return to Home",
      }).then((result) => {
        if (result.isConfirmed) {
          window.close();
        } else {
          window.location.href = "home.html";
        }
      });
    }

    arrpolit.forEach((polit, indexpolit) => {
      let dist = Math.hypot(polit.top - enemy.top, polit.left - enemy.left);
      //console.log(dist);

      if (dist - enemy.redius - polit.redius < 1) {
        
        if (enemy.redius  > 20) {
          // end game when user kill 300ball i start from 1 so i end it with 301;
          firedBulletsCount++;
          if (firedBulletsCount >=301) {
            //console.log(firedBulletsCount);
            cancelAnimationFrame(anemationid);
            const username = JSON.parse(localStorage.getItem('object'));

            // Show congratulations message
            Swal.fire({
              icon: "success",
              title: `Congratulations ${username.name}!`,
              text: `You have won with a score of ${score}.`,
            });
          }
        }

        if (enemy.redius - 20 > 20) {
          gsap.to(enemy, {
            redius: enemy.redius - 10,
          });
          //calling score ;
          score += 15;
          scoreElement.innerHTML = score;
          enemy.redius -= 20;
          setTimeout(() => {
            arrpolit.splice(indexpolit, 1);
          }, 0);
        } else {
          score += 2;
          scoreElement.innerHTML = score;
          setTimeout(() => {
            arrenemies.splice(index, 1);
            arrpolit.splice(indexpolit, 1);
          }, 0);
        }
      }
    });
  });
}

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowLeft":
      player1.move(-20);
      break;
    case "ArrowRight":
      player1.move(20);
      break;
      case "Space":
        const angleUp = -Math.PI / 2;

    const velocityUp = {
      top: Math.cos(angleUp) * 5,
      left: Math.sin(angleUp) * 5,
    };

    arrpolit.push(
      new polit(player1.top, player1.left, 5, "#f5caca", velocityUp)
    );
    break;
    default:
      break;
  }
});

// addEventListener("keydown", (event) => {
//   if (event.code === "Space") {
//     const angleUp = -Math.PI / 2;

//     const velocityUp = {
//       top: Math.cos(angleUp) * 5,
//       left: Math.sin(angleUp) * 5,
//     };

//     arrpolit.push(
//       new polit(player1.top, player1.left, 5, "#f5caca", velocityUp)
//     );
//   }
// });

startButton.addEventListener("click", () => {
  gameInProgress = true;
  anemation();
  detectenemy();
  updateTimer();
  controlButton.style.display = "none";

  clearInterval(timerInterval);
});
