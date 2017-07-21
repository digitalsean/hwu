
var gameDiv=document.getElementById("gameCards");
var eMsg = document.getElementById("p3")
var ctx = null;

//var ctx=c.getContext("2d");
var tiles = [];
var NUM_COLS = 4;
var NUM_ROWS = 3;
var W = 80;
var H = 100;

var X_PADDING = 10;
var Y_PADDING = 10;

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
    this.card_id = null;
    this.timer = null;
    this.element = document.createElement("div"); 
};

Tile.prototype.setImage = function(image) {
  this.element.style.backgroundImage = 'url("'+image+'")';
}

Tile.prototype.createInit = function(card_id) {
    this.element.className = 'card';
    this.setImage(img0);
    this.card_id=card_id;
    this.element.style.left = this.x;
    this.element.style.top = this.y;
    this.element.dataset.name=this.name;
    this.element.dataset.card_id=this.card_id;
    this.element.draggable = true;
    gameDiv.appendChild(this.element);
    this.isFaceDown = true;
};

Tile.prototype.drawFaceDown = function() {
    this.moveTo();
    console.log('called face down for '+this.x+', '+this.y);
    this.setImage(img0);
    this.isFaceDown = true;
};

Tile.prototype.drawFaceDownDelay = function() {
    this.timer && clearTimeout(this.timer);
    this.isFaceDown = true;
    this.timer = setTimeout(function() { this.drawFaceDown(); }.bind(this), DELAY_TIME );
    //this.timer = setTimeout(function(thisObj) { thisObj.drawFaceDown(); }, DELAY_TIME, this);
    console.log('setting timeout for '+this.name+' '+this.timer);
};


Tile.prototype.moveTo = function(pos) {
  if (this.element.classList.contains('flipped-left')) {
    this.element.classList.remove('flipped-left');
  }
  if (this.element.classList.contains('flipped-right')) {
    this.element.classList.remove('flipped-right');
  }


  if (pos && !this.element.classList.contains(pos)) {
    this.element.classList.add(pos);
  }
}

Tile.prototype.drawFaceUp = function() {
    console.log('called face up for '+this.x+', '+this.y);
    this.timer && clearTimeout(this.timer);
    this.setImage(this.face);
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

img0 = 'hwu.jpg';

var faces = new Array();
faces[0] = "images/maxwell.png";
faces[1] = "images/curie.png";
faces[2] = "images/bardeen.png";
faces[3] = "images/einstein.png";
faces[4] = "images/franklin.png";
faces[5] = "images/feynmann.png";
faces[6] = "images/cell_phone.png";
faces[7] = "images/smoke_detector.png";
faces[8] = "images/transistor.png";
faces[9] = "images/gps.png";
faces[10] = "images/dna.png";
faces[11] = "images/nano.png";

var phys = new Array();
phys[0] = 0
phys[1] = 1
phys[2] = 2
phys[3] = 3
phys[4] = 4
phys[5] = 5
phys[6] = 100
phys[7] = 101
phys[8] = 102
phys[9] = 103
phys[10] = 104
phys[11] = 105

var msg = new Array();
msg[0] = 'The work of James Clerk Maxwell on electromagnetism opened the way to modern telecommunications'
msg[1] = 'Some smoke detectors exploit the emission of alpha-particles by Americium-141 to detect smoke. This was enable by the work of Marie Curie on radioactivity.'
msg[2] = 'John Bardeen invented the transistor in 1947.'
msg[3] = 'The functioning of GPS device requires taking into account corrections fromt he theeory of general relativity, developed by Albert Einstein. '
msg[4] = 'Rosalind Franklin made crucial contributions to the understanding of the structure of DNA'
msg[5] = 'Richard Feynmann first illustrated the path towards constructing machines at the nano-metric level'

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


function redrawTiles() {
    if (flippedTiles.length === 0) {
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].drawFaceDown();
        }
        for (var i = 0; i < matchedTiles.length; i++) {
            matchedTiles[i].drawFaceUp();
        } 

    }
}

function flipTile(tile) {

    if (matchedTiles.includes(tile) ) {
      console.log('already found');
      document.getElementById("p3").innerHTML = msg[tile.name % 100];
    } 



    if (flippedTiles.length < 2 && tile.isFaceDown) {
        document.getElementById("p3").innerHTML = ''
        tile.drawFaceUp();
        flippedTiles.push(tile);
        if (flippedTiles.length === 2) {
            tile.moveTo('flipped-right');
            numTries++;
            document.getElementById("p1").innerHTML = str1.concat(numTries.toString())
            if (flippedTiles[0].name % 100  === flippedTiles[1].name % 100) {
                // success - matching pair
                numCorrect++;
                flippedTiles[0].isMatch = true;
                flippedTiles[1].isMatch = true;
                matchedTiles.push(flippedTiles[0])
                matchedTiles.push(flippedTiles[1])
                document.getElementById("p2").innerHTML = str2.concat(numCorrect.toString())
                document.getElementById("p3").innerHTML = 'Correct! ' + msg[flippedTiles[0].name % 100]
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
        } else {
            tile.moveTo('flipped-left');
        }
    } 
}

mouseClicked = function() {
    console.log('clicked');
    redrawTiles();
    
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].isUnderMouse(mouseX, mouseY)) {
            flipTile(tiles[i]);
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
    tiles[i].createInit(i);
  }
}



