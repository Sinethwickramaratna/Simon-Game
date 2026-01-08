let boxCollection = [];
let level=1;
let sounds = {
    1: "./sounds/green.mp3",
    2: "./sounds/red.mp3",
    3: "./sounds/yellow.mp3",
    4: "./sounds/blue.mp3"
};
const regEx = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;


function flashBox(box){
    return new Promise(resolve=>{
        let originalColor = box.css("background-color");
        let values = originalColor.match(regEx);
        let flashColor = "rgba("+values[1]+","+values[2]+","+values[3]+", 0.5)";
        box.css("background-color",flashColor);
        let audio = new Audio(sounds[box.attr("id").split("-")[1]]);
        audio.play();
        setTimeout(()=>{
            box.css("background-color",originalColor);
            resolve();
        },300);
    });
}

function waitForClick(){
    return new Promise(resolve =>{
        $(".game-btn").one("click", function(){
            resolve($(this).attr("id"));
        });
    });
}

async function playerTurn(){
    for (let i=0; i<boxCollection.length; i++){
        let clickedButton = await waitForClick();
        await flashBox($("#"+clickedButton));
        if (clickedButton !== boxCollection[i]){
            await gameOver();
            return false;
        }
    }
    return true;
}

async function gameOver(){
    $("body").css("background-color","red");
    let audio = new Audio("./sounds/wrong.mp3");
    audio.play();
    await new Promise(r=> setTimeout(r,600));
    $("body").css("background-color","rgb(0, 1, 40)");
    $("h1").text("Game Over!");

    boxCollection = [];
    level = 1;

    setTimeout(()=>{
        $("h1").text("Click Any Key to Start");
        $(document).one("keydown", function(){
            nextLevel();
        })
    }, 1000);
}

async function nextLevel(){
    $("h1").text("Level "+level);
    let randomNum = Math.floor(Math.random()*4)+1;
    let boxID = "box-"+randomNum;
    boxCollection.push(boxID);
    await flashBox($("#"+boxID));
    let success = await playerTurn();
    
    if(success){
        level++;
        await new Promise(r => setTimeout(r, 500));
        nextLevel();
    }
}

let day = new Date().getFullYear();

$("footer").text("© "+day+" Sineth Wickramaratna");

$(document).one("keydown", function () {
 nextLevel();
})