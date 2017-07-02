
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var tiles = [];
var NUM_COLS = 4;
var NUM_ROWS = 3;
var W = 80;
var H = 100;

var Tile = function(x, y, face, name) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.name = name;
    this.width = W;
    this.height = H;
};

Tile.prototype.drawFaceDown = function() {
    ctx.rect(this.x, this.y, this.width, this.height, 10);
    ctx.drawImage(img0, this.x, this.y, this.width, this.height);
    ctx.stroke();
    this.isFaceUp = false;
};

Tile.prototype.drawFaceUp = function() {
    ctx.rect(this.x, this.y, this.width, this.height, 10);
    ctx.drawImage(this.face, this.x, this.y, this.width, this.height);
    ctx.stroke();
    this.isFaceUp = true;
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
faces[0] = createImage("images/maxwell.png", 'maxwell');
faces[1] = createImage("images/curie.png", 'curie');
faces[2] = createImage("images/bardeen.png", 'bardeen');
faces[3] = createImage("images/einstein.png", 'einstein');
faces[4] = createImage("images/franklin.png", 'franklin');
faces[5] = createImage("images/feynmann.png", 'feynmann');
faces[6] = createImage("images/cell_phone.png", 'cell_phone');
faces[7] = createImage("images/smoke_detector.png", 'smoke_detector');
faces[8] = createImage("images/transistor.png", 'transistor');
faces[9] = createImage("images/gps.png", 'gps');
faces[10] = createImage("images/dna.png", 'dna');
faces[11] = createImage("images/nano.png", 'nano');

var phys = new Array();
phys[0] = 'maxwell'
phys[1] = 'curie'
phys[2] = 'bardeen'
phys[3] = 'einstein'
phys[4] = 'franklin'
phys[5] = 'feynmann'
phys[6] = 'maxwell'
phys[7] = 'curie'
phys[8] = 'bardeen'
phys[9] = 'einstein'
phys[10] = 'franklin'
phys[11] = 'feynmann'

a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

var posArray = shuffleArray(a);

// Create the tiles
var tiles = [];
var k = 0;
for (var i = 0; i < NUM_COLS; i++) {
    for (var j = 0; j < NUM_ROWS; j++) {
        tiles.push(new Tile(i * (W+8) + 10, j * (H+8) + 40, faces[posArray[k]], phys[posArray[k]]));
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
var matchedTiles = [];

mouseClicked = function() {
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

            if (flippedTiles.length < 2 && !tiles[i].isFaceUp) {
                tiles[i].drawFaceUp();
                flippedTiles.push(tiles[i]);
                //alert (tiles[i].name);
                if (flippedTiles.length === 2) {
                    numTries++;
                    if (flippedTiles[0].name === flippedTiles[1].name) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                        matchedTiles.push(flippedTiles[0])
                        matchedTiles.push(flippedTiles[1])
                    } 
                    flippedTiles = []
                    //delayStartFC = frameCount;
                    //loop();
                }
            } 
        }
    }
    
    //var foundAllMatches = true;
    //for (var i = 0; i < tiles.length; i++) {
    //    foundAllMatches = foundAllMatches && tiles[i].isMatch;
    //}
    //if (foundAllMatches) {
    //    fill(0, 0, 0);
    //    textSize(20);
    //    text("You found them all in " + numTries + " tries!", 20, 375);
    //}
};

/*
draw = function() {
    if (delayStartFC && (frameCount - delayStartFC) > 30) {
        for (var i = 0; i < tiles.length; i++) {
            if (!tiles[i].isMatch) {
                tiles[i].drawFaceDown();
            }
        }
        flippedTiles = [];
        delayStartFC = null;
    }
};

*/