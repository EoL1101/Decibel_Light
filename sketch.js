let squareSize = 55;
let numRows, numCols;
let colors = ['#06FF00', '#ECECEC', '#000000', '#FFE400', '#FF1700']; // Blue, Gray, Black, Yellow, Red
let grid;
let lastColorChange = 0;
let colorChangeInterval = 500; // Half second (in milliseconds)

let circleX, circleY, circleDiameter; // Circle position
let circleSize = 30; // Circle diameter
let circleDragging = false; // Flag to check if circle is being dragged
let barwidth = 200;
let rectX, rectY, rectWidth, rectHeight; //배경

let cols;
let rows;
let cellWidth, cellHeight;
let input;
let textToDisplay = '';
let currentIndex = 0; //텍스트
let maxTextLength; // 그리드 전체 셀 수

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  numRows = int(height / squareSize);
  numCols = int(width / squareSize);
  
  cols = numCols;
  rows = numRows;
  grid = new Array(numRows);

  // Initialize circle position to center
  rectWidth = 200;
  rectHeight = 5;
  rectX = (windowWidth - rectWidth) / 2;
  rectY = (windowHeight - rectHeight) / 2;
  circleDiameter = 15;
  circleX = rectX;
  circleY = rectY + rectHeight / 2;

  for (let i = 0; i < numRows; i++) {
    grid[i] = new Array(numCols);
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = colors[Math.floor(random(3))]; // Initial random colors from the first 3 colors
    }
  } //배경
  createCanvas(windowWidth, windowHeight);
  
  // 그리드의 셀 크기를 계산
  cellWidth = squareSize;
  cellHeight = squareSize;
  
  // 텍스트 입력 창을 생성
  input = createInput();
  input.position(rectX, height - 100);
  input.size(200, 30);
  
  // 텍스트 입력 창 테두리
  input.style('border', '1px solid black');
  input.style('padding', '5px');
  input.style('font-size', '16px');
  
  // 엔터 키 이벤트 처리
  input.changed(addText); //텍스트

  maxTextLength = cols * rows; // 그리드 전체 셀 수
}

function draw() {
  if (millis() - lastColorChange > colorChangeInterval) {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let rand = random(100);
        if (circleX <= rectX + rectWidth / 3) {
          if (rand < 50) {
            grid[i][j] = colors[0]; // Blue color (50%)
          } else {
            grid[i][j] = colors[1]; // Gray color (50%)
          }
        } else if (circleX <= rectX + (2 * rectWidth) / 3) {
          if (rand < 50) {
            grid[i][j] = colors[3]; // Yellow color (50%)
          } else if (rand < 80) {
            grid[i][j] = colors[2]; // Black color (30%)
          } else {
            grid[i][j] = colors[1]; // Gray color (20%)
          }
        } else {
          if (rand < 40) {
            grid[i][j] = colors[4]; // Red color (40%)
          } else if (rand < 90) {
            grid[i][j] = colors[2]; // Black color (50%)
          } else {
            grid[i][j] = colors[1]; // Gray color (10%)
          }
        }
      }
    }
    lastColorChange = millis();
  }

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      fill(grid[i][j]);
      rect(j * squareSize, i * squareSize, squareSize, squareSize);
    }
  }

  // Draw white rectangle 
  fill(255);
  rect(rectX, rectY, rectWidth, rectHeight);

  // Draw green circle 
  fill('#00FF00');
  ellipse(circleX, circleY, circleDiameter);

  // Check if circle is being dragged
  if (circleDragging) {
    circleX = constrain(mouseX, rectX, rectX + rectWidth);
  } //배경
  
  // 그리드를 그리기
  push();
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      line(i * cellWidth, 0, i * cellWidth, height);
      line(0, j * cellHeight, width, j * cellHeight);
    }
  }
  pop();
  
  // 텍스트를 그리드 안에 표시
  fill(0);
  textSize(min(cellWidth, cellHeight) * 0.8);
  textAlign(CENTER, CENTER);
  let textLength = textToDisplay.length;
  for (let i = 0; i < textLength; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = col * cellWidth + cellWidth / 2;
    let y = row * cellHeight + cellHeight / 2;
    text(textToDisplay.charAt(i), x, y);
  } //텍스트
}

function mousePressed() {
  let d = dist(mouseX, mouseY, circleX, circleY);
  if (d < circleDiameter / 2) {
    circleDragging = true;
  }
}

function mouseReleased() {
  circleDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  rectX = (windowWidth - rectWidth) / 2;
  rectY = (windowHeight - rectHeight) / 2;
  circleY = rectY + rectHeight / 2;
  cellWidth = width / cols;
  cellHeight = height / rows;
}

function addText() {
  let newText = this.value();
  let remainingText = newText;

  // 텍스트가 그리드를 초과할 경우 가장 오래된 텍스트부터 제거 및 새로운 텍스트 추가
  while (textToDisplay.length + remainingText.length > maxTextLength) {
    let overflow = textToDisplay.length + remainingText.length - maxTextLength;
    textToDisplay = textToDisplay.substring(overflow);
  }

  textToDisplay += remainingText;
  this.value(''); // 입력 창 초기화
}
