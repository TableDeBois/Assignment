//Authors :
//Basile Lamotte & Victor BULTEZ
const BOARD_SIZE_PIXEL=700;
var boardSize = 8;

let gen = 0;
let threats = 0;
let queenPositions = [];

let squareSizePixel = BOARD_SIZE_PIXEL / boardSize

let app = new PIXI.Application({
  width: BOARD_SIZE_PIXEL+300,
  height: BOARD_SIZE_PIXEL+100,
  backgroundColor: 0xEEEEEE,
});
document.body.appendChild(app.view);
document.body.style.overflow = 'hidden';

function resize() {
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.left = ((window.innerWidth - app.renderer.width) >> 1) + 'px';
  app.renderer.view.style.top = ((window.innerHeight - app.renderer.height) >> 1) + 'px';
}
resize();
window.addEventListener('resize', resize);

const generation = new PIXI.Text('Generation:', {
  "fontSize": 30,
  "fontWeight": "bold"
});
generation.x = 715;
generation.y = 20;
app.stage.addChild(generation);

const timerValue = new PIXI.Text('00:00:00', {
  "dropShadow": true,
  "dropShadowAlpha": 20,
  "dropShadowAngle": 0.6,
  "dropShadowDistance": 13,
  "fill": "#f9f06b",
  "fontSize": 90,
  "fontWeight": "bold",
  "strokeThickness": 5,
  "fontFamily": "Courier New"
});
timerValue.anchor.set(0.5);
timerValue.x = 400;
timerValue.y = 750;
app.stage.addChild(timerValue);

const generationValue = new PIXI.Text('0', {
  "dropShadow": true,
  "dropShadowAlpha": 20,
  "dropShadowAngle": 0.6,
  "dropShadowDistance": 13,
  "fill": "#f9f06b",
  "fontSize": 90,
  "fontWeight": "bold",
  "strokeThickness": 5,
  "fontFamily": "Courier New"
});
generationValue.anchor.set(0.5);
generationValue.x = 840;
generationValue.y = 200;
app.stage.addChild(generationValue);

const numberOfThreats = new PIXI.Text('Number of threats:', {
  "fontSize": 30,
  "fontWeight": "bold"
});
numberOfThreats.x = 715;
numberOfThreats.y = 350;
app.stage.addChild(numberOfThreats);

const numberOfThreatsValue = new PIXI.Text('0', {
    "dropShadow": true,
    "dropShadowAlpha": 20,
    "dropShadowAngle": 0.6,
    "dropShadowDistance": 13,
    "fill": "#f9f06b",
    "fontSize": 150,
    "fontWeight": "bold",
    "strokeThickness": 5,
    "fontFamily": "Courier New"
});
numberOfThreatsValue.anchor.set(0.5);
numberOfThreatsValue.x = 840;
numberOfThreatsValue.y = 535;
app.stage.addChild(numberOfThreatsValue);

let queens = [];
let queenTexture = PIXI.Texture.from('../ressources/queen.png');

var graphics = new PIXI.Graphics();

function drawBoard() {
  graphics.beginFill('white');
  for (let y = 0; y < boardSize; y++)
    for (let x = y % 2 ? 0 : 1; x < boardSize; x += 2)
      graphics.drawRect(x*squareSizePixel, y*squareSizePixel, squareSizePixel, squareSizePixel);
  graphics.beginFill('black');
  for (let y = 0; y < boardSize; y++)
    for (let x = y % 2 ? 1 : 0; x < boardSize; x += 2)
      graphics.drawRect(x*squareSizePixel, y*squareSizePixel, squareSizePixel, squareSizePixel);
  app.stage.addChild(graphics);
}

function drawQueens() {
  queens = []
  for (let i = 0; i < boardSize; i++) {
    let queen = new PIXI.Sprite(queenTexture);
    queen.anchor.x = 0.5;
    queen.anchor.y = 0.5;
    queen.width = squareSizePixel*0.9;
    queen.height = squareSizePixel*0.9;
    app.stage.addChild(queen);
    queens.push(queen)
  }
  console.log(queens.length);
}

function updateQueens() {
  for (let i = 0; i < boardSize; i++) {
    let queen = queens[i];
    queen.width = squareSizePixel*0.9;
    queen.height = squareSizePixel*0.9;
    queen.x = squareSizePixel*i + squareSizePixel/2
    queen.y = squareSizePixel*(queenPositions[i] - 1) + squareSizePixel/2
    app.stage.addChild(queen);
  }
}

function clkUpdate(){

  totalSeconds = Math.floor(counter / 1000);
  minutes = Math.floor(totalSeconds / 60);
  seconds = (totalSeconds % 60).toString().padStart(2, '0');
  milliseconds = Math.floor((counter % 1000)).toString().padStart(3, '0')
}

function clkEnd(){
  totalSeconds = Math.floor(endCounter / 1000);
  minutes = Math.floor(totalSeconds / 60);
  seconds = (totalSeconds % 60).toString().padStart(2, '0');
  milliseconds = Math.floor((endCounter % 1000)).toString().padStart(3, '0')
}

let endCounter = 0;
let counter = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let totalSeconds = 0;
app.ticker.add((delta) => {
    if(numberOfThreatsValue.text == 0){
        endCounter=counter;
    }else{
        counter += app.ticker.deltaMS
    }
  console.log(counter)
  fetch('/data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text()
    })
    .then(data => {
      var lines = data.split('\n');
      let newBoardSize = lines.shift();
      if (newBoardSize != boardSize) {
        boardSize = newBoardSize;
        squareSizePixel = BOARD_SIZE_PIXEL / boardSize;
        drawBoard();
        drawQueens();
      }
      lines.forEach(elem => {
        let array = elem.split('$');
        if (array.length != 3) return;
        gen = array[0];
        queenPositions = array[1].split(',');
        threats = array[2];
      });
    })
    .catch(error => {
      console.warn('Fetch error:', error);
  });
  if (queenPositions.length == 0){
    clkEnd();
    return
  }
  updateQueens();
  generationValue.text = gen;
  numberOfThreatsValue.text = Math.floor(threats);
  clkUpdate();
  timerValue.text = `${minutes}:${seconds}:${milliseconds}`
});
