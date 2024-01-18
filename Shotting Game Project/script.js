window.onload = function () {
    let username = JSON.parse(localStorage.getItem('object'));

    // Retrieve the selected level from local storage
    let selectedLevel = localStorage.getItem('selectedLevel');

    // Code inside this block will run once the entire page has finished loading
    if (username && username.name) {
        Swal.fire({
            title: `Welcome ${username.name}`,
            text: `Your Score is ${username.score}.\n Your Level Is ${selectedLevel}`,
            confirmButtonText: "Ok",
        });
    }
    
};

// timer of start
document.querySelector(".control-button").addEventListener("click", function () {

  // Set a timeout to execute this function after 2000 milliseconds (2 seconds)
  setTimeout(function () {
      document.querySelector(".control-button").remove();
  }, 1000);
});





const canvas = document.getElementById("shoot");
//console.log(canvas);

// det the kind of canvas;
const context = canvas.getContext("2d");
//console.log(context);

//calling start button
const StartGame = document.querySelector('#startgame');

//for score calling from html by its id;
const scoreElement = document.querySelector('#scoreElement');
const model = document.querySelector('#model');

//global variables for timer function and anemation and score
let timeInSeconds = 120;
let score = 0;
let firedBulletsCount = 1; 
//the level by defult value;
let difficultyLevel = 'easy'
let gameInProgress = false;

//inner width and inner height of window
canvas.width = innerWidth;
canvas.height = innerHeight;
//console.log(canvas(circle));



//calling object from player class;
const player1 = new player(this.width = canvas.width / 2, this.height = canvas.height / 1.3, 20, '#f5caca',);
// player1.draw();
//console.log(player1);

//making array for each class of polit, enemy,particles
const arrpolit = [];
const arrenemies = [];


// Set the initial time to 2 minutes (120 seconds)
// Function to update the timer display
function updateTimer() {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  // Format minutes and seconds with leading zeros if needed
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Update the HTML
  document.getElementById('timer').innerText = formattedTime;

  // Check if the timer has reached 00:00
  if (timeInSeconds === 0) {
    clearInterval(timerInterval); // Stop the timer
    Swal.fire({
      icon: "warning",
      title: "Oops! Time Is Out",
      text: "Do you want to end the game?",
      showCancelButton: true,
      confirmButtonText: "End Game",
      cancelButtonText: "Return to Home",
    })
    .then((result) => {
      if (result.isConfirmed) {
        // User chose to end the game
        window.close(); // Close the window
      } else {
        // User chose to return to the home page
        window.location.href = "home.html";
      }
    });

      } else {
          // Decrease the time by 1 second
          timeInSeconds--;
      }
  }

// Call the updateTimer function every second
const timerInterval = setInterval(updateTimer, 1000);

// Initial call to set up the timer display we call it in onload function
// updateTimer(); 

//function for appearing enemies by time
function detectenemy() {

  let enemyInterval = 400; // قيمة افتراضية

  // if (difficultyLevel === 'medium') {
  //   enemyInterval = 300;
  if (difficultyLevel === 'hard') {
    enemyInterval = 200;
  }

  setInterval(() => {
    //math.random there makes random rediues for enemies but it starts from 8 to 50
    const redius = Math.random() * (50 - 8) + 8;
    let top;
    let left;
    //math.random make enemies appear from random places and it takes value frm 0 and 1
    if (Math.random() < .5) {
      top = Math.random() < .5 ? 0 - redius : canvas.width + redius;
      // top = 500;
      left = 50;
    }
    else {
      top = Math.random() * canvas.width;
      // top = 500
      left = 50
      //console.log('left',left);
      //console.log('top',top);
    }
    //randmaizing the color of enemies ;
    //we put `${Math.random} for making it not string `
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = 1.6;

    //volicoity their is an object;
    const volicity = {
      top: Math.cos(angle),
      left: Math.sin(angle),
    }

    //array to make contn objects of enemies every secounds;
    arrenemies.push(
      new enemy(top, left, redius, color, volicity))
    //every time we print the object of enemies its number increase;
    //console.log(arrenemies);

  },enemyInterval);
}

// function setDifficulty(level) {
//   difficultyLevel = level;
// }


function anemation() {
  if (!gameInProgress) {
    return;
  }

  let anemationid = requestAnimationFrame(anemation);
  
  // if (score >=300 ) {
  //   cancelAnimationFrame(anemationid);
  //   const username = JSON.parse(localStorage.getItem('object'));

  //   // Show congratulations message
  //   Swal.fire({
  //     icon: "success",
  //     title: `Congratulations ${username.name}!`,
  //     text: `You have won with a score of ${score}.`,
  //   });
  // }


  //for changing background and obacity of enemies and polit;
  context.fillStyle = 'rgba(0, 0, 0, .4)';

  //clearRect(top,left,width,height)
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw of object player1
  player1.draw();

  //make array of object of polit;
  arrpolit.forEach((polit, index) => {

    //update and draw array of polits ;
    polit.update();

    //to remove polit when it exit from the window when it shoot the enemy;
    if (polit.top + polit.redius < 0 ||
      polit.top - polit.redius > canvas.width ||
      polit.left + polit.redius < 0 ||
      polit.left - polit.redius > canvas.height) {
      setTimeout(() => {
        arrpolit.splice(index, 1);

      },0)

    }
  });



  //index==no of enemy
  arrenemies.forEach((enemy, index) => {
    enemy.update();
    let dist = Math.hypot(player1.top - enemy.top, player1.left - enemy.left);
    //end the game
    if (dist - enemy.redius - player1.redius < 1) {
      cancelAnimationFrame(anemationid);
      //alert ('game over')
      Swal.fire({
        icon: "warning",
        title: "Oops! Game Over",
        text: " Do you want to end the game?",
        showCancelButton: true,
        confirmButtonText: "End Game",
        cancelButtonText: "Return to Home",
      })
      .then((result) => {
        if (result.isConfirmed) {
          // User chose to end the game
          window.close(); // Close the window
        } else {
          // User chose to return to the home page
          window.location.href = "home.html";
        }
      });

  }


    ///we put arrpolit inside arrenemies untill arrenemies can detect object of polit;
    arrpolit.forEach((polit, indexpolit) => {

      // console.log(typeof polit.top);
      // console.log(typeof polit.left);
      // console.log(enemy.top);
      // console.log(typeof enemy.top);
      //console.log(typeof enemy.left);

      //detect of collition
       //math.hypot(top,left for enemy and the polit) detect collision;
      let dist = Math.hypot(polit.top - enemy.top, polit.left - enemy.left);
      //console.log(dist);

      if (dist - enemy.redius - polit.redius < 1) {
        if (enemy.redius > 20) {
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
        //to make enemy smaller if its redius larger than player and  (-20) means if it smaller of player it must diappear by else statment;
        if (enemy.redius - 20 > 20) {
          // if(enemy.redius > 20){

          //if redius of ball is larger than 20 score will increase 15;
          score += 2;
          scoreElement.innerHTML = score;
          // console.log(score);

          gsap.to(enemy, {
            //it takes object "redius" to make movment of enemies mor annimated;
            redius: enemy.redius -20
          });

          enemy.redius -= 20;
          setTimeout(() => {
            arrpolit.splice(indexpolit, 1);
          }, 0)
        }

        else {

          //if we remove small enemy we take 15 point if we remove larger one we  take 2 point;
          score += 15;
          scoreElement.innerHTML = score;
          setTimeout(() => {
            arrenemies.splice(index, 1);
            arrpolit.splice(indexpolit, 1);

          }, 0)
        }
      }

    });

  });

}


document.addEventListener('keydown', event => {
  switch (event.code) {
    case 'ArrowLeft':
      player1.move(-20);
      break;
    case 'ArrowRight':
      player1.move(20);
      break;
    default:
      break;
  }
});

addEventListener('keydown', event => {
  if (event.code === 'Space') {
    //for knowing the angle of shooting polit;
    const angleUp = -Math.PI / 2;

    //for making speed of polit
    const velocityUp = {
      top: Math.cos(angleUp) * 5,
      left: Math.sin(angleUp) * 5,
    };
     
    //for making polit shooting up
    arrpolit.push(new polit(player1.top, player1.left, 5, '#f5caca', velocityUp));
  }
});

startButton.addEventListener('click', ()=>{
  gameInProgress = true;
  anemation();
  detectenemy();
  updateTimer();
  controlButton.style.display='none';
clearInterval(timerInterval);

  //console.log("go go go go soso go");
});


 