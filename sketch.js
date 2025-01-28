let mx = 150;
let my = 150;
let ms = 500;
let bs = ms / 5;
let xPos;
let yPos;
let speed = 100;
let p;
let g;
let blockages = [];

let pathNodes = [];
let visitedNodes = [];
let currentPathIndex = 0;
let animationStarted = false;

function setup() {
  createCanvas(800, 800);
  let playerColor = color(255, 0, 0);
  p = new Player(mx + ms / 2, my + ms / 2, 30, playerColor);
  let goalColor = color(0, 255, 0);
  g = new Goal(mx + bs / 2, my + bs / 2, 30, goalColor);

  blockages = [
    new Block(mx + 1 * bs, my + 1 * bs, bs, true, false),
    new Block(mx + 2 * bs, my + 1 * bs, bs, true, false),
    new Block(mx + 3 * bs, my + 1 * bs, bs, true, false),
    new Block(mx + 3 * bs, my + 2 * bs, bs, true, false),
    new Block(mx + 1 * bs, my + 2 * bs, bs, true, false),
    new Block(mx + 1 * bs, my + 3 * bs, bs, true, false),
  ];

  findPath();
}

function draw() {
  background(150);

  // Draw maze blocks
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const b = new Block(mx + i * bs, my + j * bs, bs, false, false);
      b.drawBlock();
    }
  }

  // Draw blockages
  for (let blockage of blockages) {
    blockage.drawBlock();
  }

  // Draw visited nodes
  for (let node of visitedNodes) {
    fill(173, 216, 230, 150); // Light blue, semi-transparent
    noStroke();
    square(node.x, node.y, bs);
  }

  // Draw path nodes
  for (let i = 0; i < currentPathIndex && i < pathNodes.length; i++) {
    fill(255, 255, 0, 150); // Yellow, semi-transparent
    noStroke();
    square(pathNodes[i].x, pathNodes[i].y, bs);
  }

  // Store current position before movement
  let nextX = p.x;
  let nextY = p.y;

  // Calculate next position based on key press
  //if (keyIsDown(DOWN_ARROW)) {
  //  nextY += 2;
  //}
  //if (keyIsDown(UP_ARROW)) {
  //  nextY -= 2;
  //}
  //if (keyIsDown(RIGHT_ARROW)) {
  //  nextX += 2;
  //}
  //if (keyIsDown(LEFT_ARROW)) {
  //  nextX -= 2;
  //}

  // Only move if there's no collision with blockages or maze boundaries
  //if (!detectCollision(nextX, nextY) && !detectMazeCollision(nextX, nextY)) {
  //  p.movePlayer(nextX, nextY);
  //}

  g.drawGoal();
  p.drawPlayer();

  // Animate path
  if (
    animationStarted &&
    frameCount % 20 === 0 &&
    currentPathIndex < pathNodes.length
  ) {
    currentPathIndex++;
    if (currentPathIndex < pathNodes.length) {
      p.movePlayer(
        pathNodes[currentPathIndex].x + bs / 2,
        pathNodes[currentPathIndex].y + bs / 2,
      );
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    animationStarted = true;
  }
  if (keyCode === 82) {
    // 'R' key
    resetAnimation();
  }
}

function resetAnimation() {
  currentPathIndex = 0;
  animationStarted = false;
  p.movePlayer(mx + 2 * bs + bs / 2, my + 2 * bs + bs / 2);
}

function findPath() {
  let startX = Math.floor((p.x - mx) / bs) * bs + mx;
  let startY = Math.floor((p.y - my) / bs) * bs + my;
  let goalX = Math.floor((g.x - mx) / bs) * bs + mx;
  let goalY = Math.floor((g.y - my) / bs) * bs + my;

  let queue = [
    {
      x: startX,
      y: startY,
      path: [{ x: startX, y: startY }],
    },
  ];
  let visited = new Set();

  while (queue.length > 0) {
    let current = queue.shift();
    let posKey = `${current.x},${current.y}`;

    if (visited.has(posKey)) continue;
    visited.add(posKey);
    visitedNodes.push({ x: current.x, y: current.y });

    if (current.x === goalX && current.y === goalY) {
      pathNodes = current.path;
      return;
    }

    // Check all four directions
    let directions = [
      { dx: 0, dy: -bs }, // up
      { dx: bs, dy: 0 }, // right
      { dx: 0, dy: bs }, // down
      { dx: -bs, dy: 0 }, // left
    ];

    for (let dir of directions) {
      let nextX = current.x + dir.dx;
      let nextY = current.y + dir.dy;

      // Check if next position is within maze bounds
      if (nextX < mx || nextX >= mx + ms || nextY < my || nextY >= my + ms) {
        continue;
      }

      // Check if next position hits a blockage
      let hitBlockage = false;
      for (let blockage of blockages) {
        if (blockage.x === nextX && blockage.y === nextY) {
          hitBlockage = true;
          break;
        }
      }

      if (!hitBlockage && !visited.has(`${nextX},${nextY}`)) {
        let newPath = [...current.path, { x: nextX, y: nextY }];
        queue.push({
          x: nextX,
          y: nextY,
          path: newPath,
        });
      }
    }
  }
}

//function detectCollision(nextX, nextY) {
//  // Check collision with each blockage
//  for (let blockage of blockages) {
//    // Calculate the edges of the player's circle
//    let playerLeft = nextX - p.r / 2;
//    let playerRight = nextX + p.r / 2;
//    let playerTop = nextY - p.r / 2;
//    let playerBottom = nextY + p.r / 2;
//
//    // Calculate the edges of the blockage
//    let blockLeft = blockage.x;
//    let blockRight = blockage.x + blockage.s;
//    let blockTop = blockage.y;
//    let blockBottom = blockage.y + blockage.s;
//
//    // Check for overlap
//    if (
//      playerRight > blockLeft &&
//      playerLeft < blockRight &&
//      playerBottom > blockTop &&
//      playerTop < blockBottom
//    ) {
//      console.log("Collision with blockage");
//      p.c = color(255, 165, 0); // Orange for blockage collision
//      return true;
//    }
//  }
//
//  p.c = color(255, 0, 0); // Reset to red if no collision
//  return false;
//}
//
//function detectMazeCollision(nextX, nextY) {
//  // Calculate player boundaries considering radius
//  let playerLeft = nextX - p.r / 2;
//  let playerRight = nextX + p.r / 2;
//  let playerTop = nextY - p.r / 2;
//  let playerBottom = nextY + p.r / 2;
//
//  // Calculate maze boundaries
//  let mazeLeft = mx;
//  let mazeRight = mx + ms;
//  let mazeTop = my;
//  let mazeBottom = my + ms;
//
//  // Check if player would go outside maze bounds
//  if (
//    playerLeft < mazeLeft ||
//    playerRight > mazeRight ||
//    playerTop < mazeTop ||
//    playerBottom > mazeBottom
//  ) {
//    console.log("Collision with maze boundary");
//    p.c = color(0, 0, 255); // Blue for boundary collision
//    return true;
//  }
//  return false;
//}

class Block {
  constructor(x, y, s, blockage, path) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.blockage = blockage;
    this.path = path;
  }
  drawBlock() {
    stroke(0);
    strokeWeight(1);
    if (this.blockage) {
      fill(0);
    } else {
      fill(255);
    }
    square(this.x, this.y, this.s);
  }
}

class Player {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }
  drawPlayer() {
    fill(this.c);
    noStroke();
    circle(this.x, this.y, this.r);
  }
  movePlayer(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
  }
}

class Goal {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }
  drawGoal() {
    fill(this.c);
    noStroke();
    circle(this.x, this.y, this.r);
  }
}

function bfs(root) {
  if (!root || root.val) {
    return;
  }

  let q = [root];

  while (q.length > 0) {
    let node = q.shift();
    console.log(node.val);
    if (node.left) {
      q.push(node.left);
    }
    if (node.right) {
      q.push(node.right);
    }
  }
}
