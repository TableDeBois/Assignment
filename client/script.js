const BOARD_SIZE_PIXEL=700;
let boardSize = 4;
let squareSizePixel = BOARD_SIZE_PIXEL/boardSize

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
for (let i = 0; i < boardSize; i++)
  queens.push(new PIXI.Sprite(queenTexture))

var graphics = new PIXI.Graphics();

graphics.beginFill('white');

for (let y = 0; y < boardSize; y++)
  for (let x = y % 2 ? 0 : 1; x < boardSize; x += 2)
    graphics.drawRect(x*squareSizePixel, y*squareSizePixel, squareSizePixel, squareSizePixel);
app.stage.addChild(graphics);

for (let i = 0; i < queens.length; i++) {
  let queen = queens[i];
  queen.width = squareSizePixel*0.9;
  queen.height = squareSizePixel*0.9;
  queen.anchor.x = 0.5;
  queen.anchor.y = 0.5;
  queen.x = squareSizePixel*i + squareSizePixel/2
  queen.y = squareSizePixel*Math.floor(Math.random() * 4) +squareSizePixel/2
  app.stage.addChild(queen);
}
