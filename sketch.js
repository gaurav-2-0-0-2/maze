let mx = 150
let my = 150
let ms = 500 

function setup() {
  // size of canvas
  createCanvas(800, 800);
  // color of the background
  background(205);
  // block size
  let bs = ms/5;

  // Draw blocks for maze
  for (let i=0; i<5; i++){
    for (let j=0; j<5; j++){
      const b = new Block(mx+(i*bs),my+(j*bs),bs, false, false)
      b.drawBlock()
    }
  }

  let playerColor = color(255,0,0)
  const p = new Player(mx+(ms/2), my+(ms/2), 30, playerColor)
  p.drawPlayer()

  let goalColor = color(0,255,0)
  const g = new Goal(mx+(bs/2), my+(bs/2), 30, goalColor)
  g.drawGoal()

  // Blockages
  const bb1 = new Block(mx+(1*bs),my+(1*bs),bs, true, false)
  bb1.drawBlock()
  const bb2 = new Block(mx+(2*bs),my+(1*bs),bs, true, false)
  bb2.drawBlock()
  const bb3 = new Block(mx+(3*bs),my+(1*bs),bs, true, false)
  bb3.drawBlock()
  const bb4 = new Block(mx+(3*bs),my+(2*bs),bs, true, false)
  bb4.drawBlock()
  const bb5 = new Block(mx+(1*bs),my+(2*bs),bs, true, false)
  bb5.drawBlock()
  const bb6 = new Block(mx+(1*bs),my+(3*bs),bs, true, false)
  bb6.drawBlock()
  const bb7 = new Block(mx+(3*bs),my+(3*bs),bs, false, true)
  bb7.drawBlock()

}

function draw() {
}

function bfs(){
}

class Block{
  constructor(x, y, s, blockage, path){
    this.x = x
    this.y = y
    this.s = s
    this.blockage = blockage
    this.path = path
  } 

  drawBlock(){
    if(this.blockage){
      fill(0)
    }else{
      if(this.path){
        fill(101, 201, 152)
      }else{
        fill(200)
      }
    }
    square(this.x, this.y, this.s)
  }

}

class Player{
  constructor(x,y,r,c){
    this.x = x
    this.y = y
    this.r = r
    this.c = c
  } 

  drawPlayer(){
    fill(this.c)
    noStroke();
    circle(this.x, this.y, this.r)
  }
}

class Goal{
  constructor(x,y,r,c){
    this.x = x
    this.y = y
    this.r = r
    this.c = c
  } 

  drawGoal(){
    fill(this.c)
    noStroke();
    circle(this.x, this.y, this.r)
  }
}
