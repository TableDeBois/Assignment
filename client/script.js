const BOARD_SIZE_PIXEL=700;
var boardSize = 8;

let generationHistory = []
let queenPositionsHistory = []
let scoreHistory = []


console.log(`queen history: ${queenPositionsHistory}`);

let app = new PIXI.Application({
  width: BOARD_SIZE_PIXEL,
  height: BOARD_SIZE_PIXEL,
  backgroundColor: 0x000000,
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

let queens = [];
let queenTexture = PIXI.Texture.from('../ressources/queen.png');

for (let i = 0; i < 100; i++)
  queens.push(new PIXI.Sprite(queenTexture))

var graphics = new PIXI.Graphics();

var init = false
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
    fetch('/data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text()
    })
    .then(data => {
      var lines = data.split('\n');
      boardSize = lines.shift();
      console.log(`lines: ${lines}`);
      lines.forEach(elem => {
        let array = elem.split('$');
        if (array.length < 3) return;
        generationHistory.push(array[0]);
        queenPositionsHistory.push(array[1].split(','));
        scoreHistory.push(array[2]);
      });
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.warn('Fetch error:', error);
    });
  if (queenPositionsHistory.length > 0) {
    let squareSizePixel = BOARD_SIZE_PIXEL / boardSize

    graphics.beginFill('white');
    for (let y = 0; y < boardSize; y++)
      for (let x = y % 2 ? 0 : 1; x < boardSize; x += 2)
        graphics.drawRect(x*squareSizePixel, y*squareSizePixel, squareSizePixel, squareSizePixel);
    graphics.beginFill('black');
    for (let y = 0; y < boardSize; y++)
      for (let x = y % 2 ? 1 : 0; x < boardSize; x += 2)
        graphics.drawRect(x*squareSizePixel, y*squareSizePixel, squareSizePixel, squareSizePixel);
    app.stage.addChild(graphics);

    for (let i = 0; i < boardSize; i++) {
      let queen = queens[i];
      queen.width = squareSizePixel*0.9;
      queen.height = squareSizePixel*0.9;
      queen.anchor.x = 0.5;
      queen.anchor.y = 0.5;
      queen.x = squareSizePixel*i + squareSizePixel/2
      queen.y = squareSizePixel*(queenPositionsHistory[queenPositionsHistory.length - 1][i] - 1) + squareSizePixel/2
      app.stage.addChild(queen);
    }
    init = true;
  }
});
