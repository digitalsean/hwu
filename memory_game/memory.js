
var c=document.getElementById("myCanvas");
var eMsg = document.getElementById("p3")

var ctx=c.getContext("2d");
var tiles = [];
var NUM_COLS = 4;
var NUM_ROWS = 3;
var W = 80;
var H = 100;

var X_PADDING = 10;
var Y_PADDING = 40;

var X_GUTTER = 8;
var Y_GUTTER = 8;
var DELAY_TIME  = 2000;


var index = -1;
var str1 = 'Number of trials: '
var str2 = 'Number of correct guesses: '

var Tile = function(x, y, face, name) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.name = name;
    this.width = W;
    this.height = H;
    this.timer = null;
};

Tile.prototype.drawFaceDown = function() {
    console.log('called face down for '+this.x+', '+this.y);
    ctx.rect(this.x, this.y, this.width, this.height, 10);
    ctx.drawImage(img0, this.x, this.y, this.width, this.height);
    ctx.stroke();
    this.isFaceDown = true;
};

Tile.prototype.drawFaceDownDelay = function() {
    this.timer && clearTimeout(this.timer);
    this.isFaceDown = true;
    this.timer = setTimeout(function() { this.drawFaceDown(); }.bind(this), DELAY_TIME );
    //this.timer = setTimeout(function(thisObj) { thisObj.drawFaceDown(); }, DELAY_TIME, this);
    console.log('setting timeout for '+this.name+' '+this.timer);
};


Tile.prototype.drawFaceUp = function() {
    console.log('called face up for '+this.x+', '+this.y);
    this.timer && clearTimeout(this.timer);
    ctx.rect(this.x, this.y, this.width, this.height, 10);
    ctx.drawImage(this.face, this.x, this.y, this.width, this.height);
    ctx.stroke();
    this.isFaceDown = false;
};

Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.height;
};

var createImage = function(src, name) {
  var img   = new Image();
  img.src   = src;
  return img; 
};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

img0 = createImage('hwu.jpg', 'hwu');

var faces = new Array();
faces[0] = createImage("images/maxwell.png", 0);
faces[1] = createImage("images/curie.png", 1);
faces[2] = createImage("images/bardeen.png", 2);
faces[3] = createImage("images/einstein.png", 3);
faces[4] = createImage("images/franklin.png", 4);
faces[5] = createImage("images/feynmann.png", 5);
faces[6] = createImage("images/cell_phone.png", 0);
faces[7] = createImage("images/smoke_detector.png", 1);
faces[8] = createImage("images/transistor.png", 2);
faces[9] = createImage("images/gps.png", 3);
faces[10] = createImage("images/dna.png", 4);
faces[11] = createImage("images/nano.png", 5);

var phys = new Array();
phys[0] = 0
phys[1] = 1
phys[2] = 2
phys[3] = 3
phys[4] = 4
phys[5] = 5
phys[6] = 0
phys[7] = 1
phys[8] = 2
phys[9] = 3
phys[10] = 4
phys[11] = 5

var msg = new Array();
msg[0] = 'Correct! The work of James Clerk Maxwell on electromagnetism opened the way to modern telecommunications'
msg[1] = 'Correct! Some smoke detectors exploit the emission of alpha-particles by Americium-141 to detect smoke. This was enable by the work of Marie Curie on radioactivity.'
msg[2] = 'Correct! John Bardeen invented the transistor in 1947.'
msg[3] = 'Correct! The functioning of GPS device requires taking into account corrections fromt he theeory of general relativity, developed by Albert Einstein. '
msg[4] = 'Correct! Rosalind Franklin made crucial contributions to the understanding of the structure of DNA'
msg[5] = 'Correct! Richard Feynmann first illustrated the path towards constructing machines at the nano-metric level'

a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

var posArray = shuffleArray(a);

// Create the tiles
var tiles = [];
var k = 0;
for (var i = 0; i < NUM_COLS; i++) {
    for (var j = 0; j < NUM_ROWS; j++) {
        tiles.push(new Tile(i * (W+X_GUTTER) + X_PADDING, j * (H+Y_GUTTER) + Y_PADDING, faces[posArray[k]], phys[posArray[k]]));
        k ++;
    }
}

// Draw tiles face down
for (var i = 0; i < tiles.length; i++) {
    tiles[i].drawFaceDown();
}
    
document.body.addEventListener('click', readPos, false);


function getClickPosition(event) {
     var X = event.pageX //- canvas.offsetLeft;
     var Y = event.pageY //- canvas.offsetTop;
     return mouse = [X, Y];
 }

 //read click position
 function readPos(event) {
     mousePos = getClickPosition(event);
     mouseX = mousePos[0];
     mouseY = mousePos[1];
     mouseClicked();
     //draw();
 }

var flippedTiles = [];
var delayStartFC = null;
var numTries = 0;
var numCorrect = 0;
var matchedTiles = [];

mouseClicked = function() {
    console.log('clicked');
    if (flippedTiles.length === 0) {
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].drawFaceDown();
        }
        for (var i = 0; i < matchedTiles.length; i++) {
            matchedTiles[i].drawFaceUp();
        } 

    } 

    
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].isUnderMouse(mouseX, mouseY)) {

            if (flippedTiles.length < 2 && tiles[i].isFaceDown) {
            	document.getElementById("p3").innerHTML = ''
                tiles[i].drawFaceUp();
                flippedTiles.push(tiles[i]);
                if (flippedTiles.length === 2) {
                    numTries++;
                    document.getElementById("p1").innerHTML = str1.concat(numTries.toString())
                    if (flippedTiles[0].name === flippedTiles[1].name) {
                        // success - matching pair
                    	numCorrect++;
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                        matchedTiles.push(flippedTiles[0])
                        matchedTiles.push(flippedTiles[1])
	                    document.getElementById("p2").innerHTML = str2.concat(numCorrect.toString())
						document.getElementById("p3").innerHTML = msg[flippedTiles[0].name]
                    } else {
                      // not a matching pair
                        console.log('not matching pair');
                        for (var j = 0; j < flippedTiles.length; j++) {
                              console.log('putting back '+j);
                               flippedTiles[j].drawFaceDownDelay();
                        }
                        flippedTiles=[];

                    }
                    console.log('resetting flippedTiles');
                    flippedTiles = [];
                }
            } 
        }
    }
   /* if (flippedTiles.length === 0) {

       for (var i = 0; i < matchedTiles.length; i++) {
           matchedTiles[i].drawFaceUp();
       }

    } */

};

// initialise the game on page loaded
//
window.onload = function() {
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].drawFaceDown();
  }
}
