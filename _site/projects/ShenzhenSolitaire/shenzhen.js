var canvas = null;
var context = null;
const time = new Date();

var piles = [];
var dragonPile = [];
var isLocked = [false, false, false];
var lockColor = [null, null, null];
var dragonsCounted = [0,0,0];
var sortedPile = [];
var flowerPile = null;
var winCounter = 0;

var pileSpacing = 10;
var topPadding = 10;
var topPileSeparation = 30;
var cardOverlap = 30;

var canvasWidth;
var canvasHeight;
var leftPileX;
var leftPileY;

var selectedStack = [];
var oldCardLoc = null;
var oldCardPos = null;
var mousePos = [null, null];

var cardHeight = 180;
var cardWidth = Math.round(cardHeight / 2);
var cardColors = ["#A10F00", "#289664", "#0F0F0F"];
var cardBGColor = "#E3E3E3";
var edgeColor = "#161616";
var backgroundGradient;

var dragonSymbols = ["中", "發", "▯"];
var flowerSymbol = "❀";
var chineseNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

var buttonSpacing = 5;
var buttonRadius = Math.round((cardHeight - 2 * buttonSpacing)/6);
var buttonFlags = [false, false, false];

function drawRoundedEdgeCard(x, y, fillColor, strokeColor) {
    let R = 10; // Quarter-circle radius
    context.lineWidth = 1;
    if (fillColor != null) context.fillStyle = fillColor;
    if (strokeColor != null) context.strokeStyle = strokeColor;

    context.beginPath();
    context.moveTo(x, y + R);
    context.arc(x + R, y + R, R, Math.PI, 3 * Math.PI / 2);
    context.lineTo(x + cardWidth - R, y);
    context.arc(x + cardWidth - R, y + R, R, 3 * Math.PI / 2, 2 * Math.PI);
    context.lineTo(x + cardWidth, y + cardHeight - R);
    context.arc(x + cardWidth - R,y + cardHeight - R, R, 0, Math.PI/2);
    context.lineTo(x + R, y + cardHeight);
    context.arc(x + R, y + cardHeight - R, R, Math.PI/2, Math.PI);
    context.closePath();
    
    if (fillColor != null) context.fill();
    if (strokeColor != null) context.stroke();
}

// Class for storing card information/methods
class Card {
    constructor(id, loc, x, y, color, label, movable) {
        // Unique identifier for this card
        this.id = id;
        // Location on the board (pile, index)
        this.loc = loc;

        this.x = x;
        this.y = y;
        this.color = color;
        this.label = label;
        
        this.movable = movable;
    }

    draw() {
        context.lineWidth = 1;
        
        // Get the label to display
        let l = this.label;
        if (l == "D") {
            if (this.color == 0) l = dragonSymbols[0];
            else if (this.color == 1) l = dragonSymbols[1];
            else l = dragonSymbols[2];
        } else if (l == "F") l = flowerSymbol;

        // Draw the card with rounded edges
        drawRoundedEdgeCard(this.x, this.y, cardBGColor, edgeColor);

        // Draw the label in the top-left and bottom-right
        context.font = "24px serif";
        context.fillStyle = cardColors[this.color];
        let metric = context.measureText(l);
        let height = metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent;
        context.fillText(l, this.x + 5, this.y + 5 + height);

        context.translate(this.x + cardWidth, this.y + cardHeight);
        context.rotate(Math.PI);
        context.fillText(l, 5, height + 5);
        context.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw the center design
        context.font = "32px serif";
        if (this.label != "D" && this.label != "F") {
            l = chineseNumbers[parseInt(this.label)-1];
            metric = context.measureText(l);
        }
        metric = context.measureText(l);
        height = metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent;
        context.fillText(l, this.x + cardWidth/2 - metric.width/2, this.y + cardHeight/2 + height/2);
    }
}

window.onload = init;
function init() {
    canvas = document.getElementById("canvas");
    if (!canvas) {
        console.log("Could not find <canvas> element.");
        return;
    }

    // Event listeners
    canvas.addEventListener("mousedown", mouseDownEvent);
    canvas.addEventListener("mouseup", mouseUpEvent);
    canvas.addEventListener("mousemove", mouseMoveEvent);

    if (canvas.getContext) {
        context = canvas.getContext("2d");
        context.font = "24px serif";
        console.log("Canvas context initialized!");
    } else {
        console.log("Canvas context failed to initialize");
        return;
    }

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    backgroundGradient = context.createLinearGradient(0, 0, canvasWidth, 0);
    backgroundGradient.addColorStop(0, "#003C1E");
    backgroundGradient.addColorStop(0.5, "#005F46");
    backgroundGradient.addColorStop(1.0, "#003C1E");

    document.getElementById("win-counter").textContent = "Wins: " + String(winCounter);

    initGame();
    draw();
}

function initGame() {
    // TODO: Ensure that all games dealt are winnable

    // Cards have the format CT
    // C = color (0=red, 1=green, 2=black)
    // T = 1,2,3,4,5,6,7,8,9,D,F where D denotes dragon and F denotes flower
    let cards = [];
    for (let c = 0; c < 3; c++) {
        for (let t = 1; t < 11; t++) {
            if (t==10) {
                for (let i = 0; i < 4; i++) cards.push(c + "D");
            }
            else cards.push(c.toString() + t.toString());
        }
    }
    cards.push("0F");

    // For now, just shuffle the cards to create a random starting configuration
    for (let i = cards.length-1; i >= 1; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let temp = cards[j];
        cards[j] = cards[i];
        cards[i] = temp;
    }

    piles = [];
    dragonPile = [null, null, null];
    sortedPile = [null, null, null];
    isLocked = [false, false, false];
    lockColor = [null, null, null];
    buttonFlags = [false, false, false];
    dragonsCounted = [0, 0, 0];
    flowerPile = null;

    // Main piles
    leftPileX = Math.round((canvasWidth - 8 * cardWidth - 7 * pileSpacing)/2);
    leftPileY = topPadding + cardHeight + topPileSeparation;
    for (let i = 0; i < 8; i++) {
        let pile = [null, null, null, null, null]
        let movable = true;
        for (let j = 4; j >= 0; j--) {
            let idx = 5 * i + j;

            // Determine the coordinate of the top-left corner.
            let x = leftPileX + i * (cardWidth + pileSpacing);
            let y = leftPileY + j * cardOverlap;

            let color = parseInt(cards[idx][0]);

            // Determine movability of this card
            if (movable && j!=4) {
                if (pile[j+1].label == 'D' || pile[j+1].label == 'F') movable = false;
                else if (pile[j+1].color == color) movable = false;
                else if (parseInt(cards[idx][1])-parseInt(pile[j+1].label) != 1) movable = false;
            }

            pile[j] = new Card(idx, [i, j], x, y, color, cards[idx][1], movable);
        }
        piles.push(pile);
    }

    // Auto-move any cards from the starting configuration
    autoMove();
}

function resetGame() {
    initGame();
    draw();
}

function updateWin() {
    if (!(isLocked[0] && isLocked[1] && isLocked[2])) return;
    for (let i = 0; i < 8; i++) {
        if (piles[i].length != 0) return;
    }
    
    winCounter += 1;
    document.getElementById("win-counter").textContent = "Wins: " + String(winCounter);
}

function getCard(x, y) {
    // Dragon pile
    for (let i = 0; i < 3; i++) {
        if (dragonPile[i] == null) continue;

        // Dragon pile rectangle (bottom left x and y)
        let dragonX = leftPileX + i * (cardWidth + pileSpacing);
        let dragonY = topPadding;
        if ((dragonX <= x && x <= dragonX + cardWidth) && (dragonY <= y && y <= dragonY + cardHeight)) {
            return dragonPile[i];
        }
    }

    // Main pile
    // Proceed in reverse order
    for (let i = 0; i < 8; i++) {
        for (let j = piles[i].length-1; j>=0; j--) {
            let card = piles[i][j];
            if ((card.x <= x && x <= card.x + cardWidth) && (card.y <= y && y <= card.y + cardHeight)) {
                if (card.movable) return card;
            }
        }
    }

    // All other positions are invalid (including sorted piles)
    return null;
}

// Check if all dragons are visible and if a dragon spot can be filled
// Then update the button to let you consolidate them.
function updateDragonButton() {
    let dragonCounts = [0, 0, 0];

    // Check dragon pile
    for (let i = 0; i < 3; i++) {
        let card = dragonPile[i];
        if (card == null) continue;

        if (card.label == "D") {
            for (let k = 0; k < 3; k++) {
                if (card.color == k) dragonCounts[k] += 1;
            }
        }
    }

    // Check main pile
    for (let i = 0; i < 8; i++) {
        if (piles[i].length == 0) continue;

        let card = piles[i][piles[i].length - 1];
        if (card.label == "D") {
            for (let k = 0; k < 3; k++) {
                if (card.color == k) dragonCounts[k] += 1;
            }
        }
    }

    // Update corresponding button flag
    for (let i = 0; i < 3; i++) {
        if (dragonCounts[i] == 4) {
            let available = false;
            for (let j = 0; j < 3; j++) {
                if (dragonPile[j] == null || 
                    (dragonPile[j].color == i && dragonPile[j].label == "D")) {
                    available = true;
                    break;
                }
            }
            if (available) buttonFlags[i] = true;
        }
    }
}

// Assuming it's valid, consolidate all the dragons to a single pile and make them no longer movable
function consolidateDragons(idx) {
    // Take the first available valid spot
    let spot = -1;
    for (let i = 0; i < 3; i++) {
        if (isLocked[i]) continue;
        if (dragonPile[i] == null || 
            (dragonPile[i].color == idx && dragonPile[i].label == "D")) {
            spot = i;
            break;
        }
    }
    let spotX = leftPileX + spot * (cardWidth + pileSpacing);

    // Dragon pile
    let count = 0;
    for (let i = 0; i < 3; i++) {
        if (dragonPile[i] != null && 
            (dragonPile[i].color == idx && dragonPile[i].label == "D")) {
            let card = dragonPile[i];
            window.requestAnimationFrame(() => {
                animateMove(card, [card.x, card.y], [spotX, topPadding], "L" + String(spot));
            });
            dragonPile[i] = null;
            count += 1;
        }
    }

    // Main pile
    for (let i = 0; i < 8; i++) {
        if (piles[i].length == 0) continue;

        let card = piles[i][piles[i].length - 1];
        if (card.label == "D" && card.color == idx) {
            piles[i].pop();
            window.requestAnimationFrame(() => {
                animateMove(card, [card.x, card.y], [spotX, topPadding], "L" + String(spot));
            });
            count += 1;

            // Update movability of cards below the dragon
            let movable = true;
            for (let j = piles[i].length-1; j >= 0; j--) {
                if (j+1 < piles[i].length) {
                    if (piles[i][j+1].label == 'D' || piles[i][j+1].label == 'F') movable = false;
                    else if (piles[i][j+1].color == idx) movable = false;
                    else if (parseInt(piles[i][j].label)-parseInt(piles[i][j+1].label) != 1) movable = false;
                }

                piles[i][j].movable = movable;
                if (!movable) break;
            }
        }

        if (count==4) break;
    }

    lockColor[spot] = cardColors[idx];
    buttonFlags[idx] = false;

    updateDragonButton();
    updateWin();
    draw();
}

// Find the area of overlap between two rectangles defined by:
// [bottom-left x, bottom-left y, top-right x, top-right y]
function overlapArea(rect1, rect2) {
    // Force rect1's x-coordinate to be less than or equal to rect2's
    if (rect1[0] > rect2[0]) {
        let temp = rect1;
        rect1 = rect2;
        rect2 = temp;
    }
    // Area of intersection
    let rect3 = [rect2[0], Math.max(rect1[1], rect2[1]),
                Math.min(rect1[2], rect2[2]), Math.min(rect1[3], rect2[3])];
    return Math.max(0, rect3[2]-rect3[0])*Math.max(0, rect3[3]-rect3[1]);
}

// Check if a card can be placed at the given (x, y).
// If true, returns the location where it can be placed
// Otherwise return null
function canPlace(card, x, y) {
    let overlapThreshold = 0.25;

    // Dragon pile
    for (let i = 0; i < 3; i++) {
        // Check if we can place at dragon pile
        if (isLocked[i]) continue;
        if (dragonPile[i] != null) continue;

        // Dragon pile rectangle (bottom left x and y, inverted y)
        let dragonRect = [leftPileX + i * (cardWidth + pileSpacing),
                          topPadding - cardHeight];
        dragonRect.push(dragonRect[0] + cardWidth);
        dragonRect.push(dragonRect[1] + cardHeight);
        if (!(dragonRect[0] <= x <= dragonRect[2] && dragonRect[1] <= y <= dragonRect[3])) continue;
        
        // If the overlapping area passes a threshold, the card can be placed
        let area = overlapArea([card.x, card.y - cardHeight, card.x + cardWidth, card.y], dragonRect);
        area /= (dragonRect[2]-dragonRect[0])*(dragonRect[3]-dragonRect[1]);
        // Return a indicator that the card can be placed at the dragon tile
        if (area >= overlapThreshold) return "D" + i;
    }

    // Sorted pile
    if (card.label != "D" && card.label != "F") {
        for (let i = 0; i < 3; i++) {
            // Check if we can place at sorted pile
            if (sortedPile[i] == null && card.label != "1") continue;
            if (sortedPile[i] != null && !(parseInt(card.label)-parseInt(sortedPile[i].label)==1
                && card.color == sortedPile[i].color)) continue;

            // Dragon pile rectangle (bottom left x and y, inverted y)
            let sortedRect = [leftPileX + (5+i) * (cardWidth + pileSpacing),
                            topPadding - cardHeight];
            sortedRect.push(sortedRect[0] + cardWidth);
            sortedRect.push(sortedRect[1] + cardHeight);
            if (!(sortedRect[0] <= x <= sortedRect[2] && sortedRect[1] <= y <= sortedRect[3])) continue;
            
            // If the overlapping area passes a threshold, the card can be placed
            let area = overlapArea([card.x, card.y - cardHeight, card.x + cardWidth, card.y], sortedRect);
            area /= (sortedRect[2]-sortedRect[0])*(sortedRect[3]-sortedRect[1]);
            // Return a indicator that the card can be placed at the dragon tile
            if (area >= overlapThreshold) return "S" + i;
        }
    }

    // Check if the (x,y) lies at the end of a pile
    for (let i = 0; i < 8; i++) {
        let j = piles[i].length-1;

        // Determine the bounds of the destination rectangle (inverted y)
        let dest = [];
        if (j < 0) {
            dest.push(leftPileX + i * (cardWidth + pileSpacing));
            dest.push(leftPileY + j * cardOverlap - cardHeight);
            dest.push(dest[0] + cardWidth);
            dest.push(dest[1] + cardHeight);
        } else {
            dest = [piles[i][j].x, piles[i][j].y - cardHeight, piles[i][j].x + cardWidth, piles[i][j].y];
        }
        // (x,y) should lie within the destination rectangle
        if (!(dest[0] <= x <= dest[2] && dest[1] <= y <= dest[3])) continue;

        // If the overlapping area passes a threshold, the card can be placed
        let area = overlapArea([card.x, card.y - cardHeight, card.x + cardWidth, card.y], dest);
        area /= (dest[2]-dest[0])*(dest[3]-dest[1]);
        if (area >= overlapThreshold) {
            // Empty space => always can place
            if (j == -1) return [i, 0];
            // Cannot place dragons/flower on any other card
            if (card.label == "D" || card.label == "F") return null;
            // Numbered cards placed on non-empty pile
            else {
                // Cannot place on dragon/flower
                if (piles[i][j].label == "D" || piles[i][j].label == "F") return null;
                // Color must alternate and order must be descending by 1
                if (card.color == piles[i][j].color || parseInt(piles[i][j].label) - parseInt(card.label) != 1) return null;
                return [i, j+1];
            }
        }
    }
    return null;
}

// Animate moving the card to the following point
function animateMove(card, start, end, loc, t = 0) {
    let t2 = Math.min(1.0, t);
    card.x = start[0] + t2 * (end[0] - start[0]);
    card.y = start[1] + t2 * (end[1] - start[1]);
    
    draw();
    card.draw();

    if (t2 == 1.0) {
        if (loc != null) {
            // Move to flower pile
            if (loc[0] == "F") {
                flowerPile = card;
            }
            // Move to sorted pile
            else if (loc[0] == "S") {
                sortedPile[parseInt(loc[1])] = card;
            }
            // Consolidate dragon and lock it
            else if (loc[0] == "L") {
                let i = parseInt(loc[1]);
                dragonsCounted[i] += 1;
                if (dragonsCounted[i] == 4) isLocked[parseInt(loc[1])] = true;
            }
        }

        card.loc = loc;
        draw();
        card.draw();
        autoMove();
        return;
    }

    requestAnimationFrame(() => { animateMove(card, start, end, loc, t + 0.1); });
}

// Saves the player time by auto-moving any cards to the sorted piles
// - If the flower card is movable, always move it to the flower spot
// - Dragon cards do not move automatically
// - All other cards are moved to their sorted pile if all piles are non-empty and their top cards are all at least one less than it.
function autoMove() {
    // Dragon pile
    for (let i = 0; i < 3; i++) {
        if (dragonPile[i] == null) continue;
        // Ignore dragon cards
        if (dragonPile[i].label == "D") continue;
        // Auto-move flower card
        if (dragonPile[i].label == "F") {
            let card = dragonPile[i];
            dragonPile[i] = null;
            let dest = [leftPileX + 4 * (cardWidth + pileSpacing), topPadding];
            window.requestAnimationFrame(() => {
                animateMove(card, [card.x, card.y], dest, "F");
            });
            return;
        }
        
        // Numerical cards
        let card = dragonPile[i];
        let label = parseInt(dragonPile[i].label);
        for (let j = 0; j < 3; j++) {
            if ((label==1 && sortedPile[j] == null) || (sortedPile[j] != null && card.color == sortedPile[j].color &&
                label-parseInt(sortedPile[j].label)==1)) {
                // Check remaining piles
                let shouldMove = true;
                if (label != 1) {
                    for (let k = 0; k < 3; k++) {
                        if (k==j) continue;
                        if (sortedPile[k]==null || label-parseInt(sortedPile[k].label)>1) {
                            shouldMove = false;
                            break;
                        }
                    }
                }
                if (!shouldMove) continue;

                dragonPile[i] = null;
                let dest = [leftPileX + (5+j) * (cardWidth + pileSpacing), topPadding];
                window.requestAnimationFrame(() => {
                    animateMove(card, [card.x, card.y], dest, "S" + j);
                });
                return;
            }
        }
    }
    
    // Main pile
    for (let i = 0; i < 8; i++) {
        let l = piles[i].length;
        if (l==0) continue;

        // Ignore dragon cards
        if (piles[i][l-1].label == "D") continue;

        // Auto-move flower card
        if (piles[i][l-1].label == "F") {
            let card = piles[i].pop();
            let dest = [leftPileX + 4 * (cardWidth + pileSpacing), topPadding];
            window.requestAnimationFrame(() => {
                animateMove(card, [card.x, card.y], dest, "F");
            });

            // Allow the card below to move
            if (piles[i].length != 0) {
                piles[i][piles[i].length - 1].movable = true;
            }

            return;
        }

        // Auto-move numbered cards to the first available sorted pile
        let card = piles[i][l - 1];
        let label = parseInt(card.label);
        for (let j = 0; j < 3; j++) {
            if ((label==1 && sortedPile[j] == null) || (sortedPile[j] != null && card.color == sortedPile[j].color &&
                label-parseInt(sortedPile[j].label)==1)) {
                // Check remaining piles
                let shouldMove = true;
                if (label != 1) {
                    for (let k = 0; k < 3; k++) {
                        if (k==j) continue;
                        if (sortedPile[k]==null || label-parseInt(sortedPile[k].label)>1) {
                            shouldMove = false;
                            break;
                        }
                    }
                }
                if (!shouldMove) continue;

                piles[i].pop();
                let dest = [leftPileX + (5+j) * (cardWidth + pileSpacing), topPadding];
                window.requestAnimationFrame(() => {
                    animateMove(card, [card.x, card.y], dest, "S" + j);
                });

                // Allow the card below to move
                if (piles[i].length != 0) {
                    piles[i][piles[i].length - 1].movable = true;
                }

                return;
            }
        }
    }
    
    updateDragonButton();
    updateWin();
    draw();
}

function mouseDownEvent(event) {
    mousePos = [event.offsetX, event.offsetY];

    // Check if we are clicking on a button
    let x = Math.round(leftPileX + 3.5 * (cardWidth + pileSpacing));
    for (let i = 0; i < 3; i++) {
        if (!buttonFlags[i]) continue;

        let y = topPadding + (2*i+1) * buttonRadius + i * buttonSpacing;
        if (Math.pow(mousePos[0] - x, 2) + Math.pow(mousePos[1] - y, 2) <= buttonRadius*buttonRadius) {
            consolidateDragons(i);
            return;
        }
    }

    let card = getCard(mousePos[0], mousePos[1]);
    if (card != null && card.loc[0] != "S") {
        // Store the old location and clear the current location
        oldCardLoc = card.loc;
        oldCardPos = [card.x, card.y];
        if (card.loc[0] == "D") oldCardMovability = true;
        else {
            oldCardMovability = (card.loc[1]==0) ? false : piles[card.loc[0]][card.loc[1]-1].movable;
        }

        // Dragon pile --- there is no new top card
        if (card.loc[0] == "D") {
            dragonPile[parseInt(card.loc[1])] = null;
            selectedStack = [card];
        }
        // Main pile
        else {
            // Pop from the stack
            selectedStack = piles[card.loc[0]].splice(card.loc[1], piles[card.loc[0]].length);
            
            // Allow the new top card to be movable
            if (card.loc[1] != 0) {
                piles[card.loc[0]][card.loc[1]-1].movable = true;
            }

            for (let card2 of selectedStack) card2.loc = null;
        }
    }
}

function mouseUpEvent(event) {
    mousePos = [event.offsetX, event.offsetY];
    if (selectedStack.length == 0) return;

    let pos = canPlace(selectedStack[0], mousePos[0], mousePos[1]);

    // Can place at a valid spot
    let valid = true;
    if (pos==null || ((pos[0] == "D"||pos[0] == "S") && selectedStack.length != 1)) valid = false;
    if (valid) {
        // Update locations of each card in the stack
        // If we are moving to a dragon or sorted pile, there will only ever be one card
        let j = 0;
        for (let card of selectedStack) {
            if (pos[0] == "D"||pos[0] == "S") card.loc = pos;
            else {
                card.loc = [pos[0], pos[1] + j];
                j += 1;
            }
        }

        // Place at a dragon pile
        if (pos[0] == "D") {
            let i = parseInt(pos[1]);
            selectedStack[0].x = leftPileX + i * (cardWidth + pileSpacing);
            selectedStack[0].y = topPadding;
            dragonPile[i] = selectedStack[0];
        }
        // Place at a sorted pile
        else if (pos[0] == "S") {
            let i = parseInt(pos[1]);
            selectedStack[0].x = leftPileX + (5+i) * (cardWidth + pileSpacing);
            selectedStack[0].y = topPadding;
            sortedPile[i] = selectedStack[0];
        }
        // Place at a main pile
        else {
            // We don't need to update the movability of the cards below the stack.
            // Card stacks can only be placed at valid spots which are either empty or movable.

            // Update the x and y of the cards
            for (let card of selectedStack) {
                card.x = leftPileX + card.loc[0] * (cardWidth + pileSpacing);
                card.y = leftPileY + card.loc[1] * cardOverlap;

                piles[pos[0]].push(card);
            }
        }

        // Update movability of cards below the newly revealed card at the old location
        let i = oldCardLoc[0];
        if (oldCardLoc != null) {
            console.log("sklbiobit");
            let movable = true;
            for (let j = piles[i].length-1; j >= 0; j--) {
                if (j+1 < piles[i].length) {
                    if (piles[i][j+1].label == 'D' || piles[i][j+1].label == 'F') movable = false;
                    else if (piles[i][j].color == piles[i][j+1].color) movable = false;
                    else if (parseInt(piles[i][j].label)-parseInt(piles[i][j+1].label) != 1) movable = false;
                }

                piles[i][j].movable = movable;
                if (!movable) break;
            }
        }

        autoMove();
        updateWin();
    }
    // Cannot place at a valid spot
    else {
        // Return to dragon pile
        if (oldCardLoc[0] == "D") {
            dragonPile[parseInt(oldCardLoc[1])] = selectedStack[0];

            // Restore previous location
            selectedStack[0].loc = oldCardLoc;
            selectedStack[0].x = oldCardPos[0];
            selectedStack[0].y = oldCardPos[1];
        }
        // Return to its main pile
        else {
            // Restore previous location
            let j = 0;
            for (let card of selectedStack) {
                card.loc = [oldCardLoc[0], oldCardLoc[1] + j];
                card.x = leftPileX + card.loc[0] * (cardWidth + pileSpacing);
                card.y = leftPileY + card.loc[1] * cardOverlap;
                
                piles[oldCardLoc[0]].push(card);
                j += 1;
            }

            // Restore movability of the card below, if it exists.
            if (oldCardLoc[1] != 0) {
                piles[oldCardLoc[0]][oldCardLoc[1] - 1].movable = oldCardMovability;
            }
        }
    }

    // Clear the selected card and auto-move any revealed cards
    selectedStack = [];

    updateDragonButton();
    draw();
}

function mouseMoveEvent(event) {
    for (let card of selectedStack) {
        card.x += event.offsetX - mousePos[0];
        card.y += event.offsetY - mousePos[1];
        draw();
    }
    mousePos = [event.offsetX, event.offsetY];
}

function draw() {
    // Gradient background
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // Buttons
    let x = Math.round(leftPileX + 3.5 * (cardWidth + pileSpacing));
    for (let i = 0; i < 3; i++) {
        let y = topPadding + (2*i+1) * buttonRadius + i * buttonSpacing;
        context.strokeStyle = cardColors[i];
        context.beginPath();
        context.arc(x, y, buttonRadius, 0, 2 * Math.PI);

        // Gradient fill
        let gradient = context.createRadialGradient(x, y, 0.8 * buttonRadius, x, y, buttonRadius);
        if (buttonFlags[i]) {
            gradient.addColorStop(0, "#FADC96");
        } else {
            gradient.addColorStop(0, "#BFA670");
        }
        gradient.addColorStop(1.0, edgeColor);
        context.fillStyle = gradient;
        context.stroke();
        context.fill();

        context.font = "32px serif";
        context.fillStyle = cardColors[i];
        let metric = context.measureText(dragonSymbols[i]);
        let height = metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent;
        context.fillText(dragonSymbols[i], x - metric.width/2, y + height/2);
    }

    for (let i = 0; i < 3; i++) {
        // Dragon pile
        let x = leftPileX + i * (cardWidth + pileSpacing);
        if (isLocked[i]) {
            drawRoundedEdgeCard(x, topPadding, lockColor[i], lockColor[i]);
        }
        else if (dragonPile[i] == null) {
            drawRoundedEdgeCard(x, topPadding, null, edgeColor);
        } else {
            dragonPile[i].draw();
        }

        // Sorted pile
        if (sortedPile[i] == null) {
            let x = leftPileX + (5+i) * (cardWidth + pileSpacing);
            drawRoundedEdgeCard(x, topPadding, null, edgeColor);
        } else {
            sortedPile[i].draw();
        }
    }

    // Flower pile
    if (flowerPile == null) {
        let x = leftPileX + 4 * (cardWidth + pileSpacing);

        drawRoundedEdgeCard(x, topPadding, null, edgeColor);

        context.font = "50px serif";
        context.fillStyle = edgeColor;
        metric = context.measureText(flowerSymbol);
        height = metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent;
        context.fillText(flowerSymbol, x + cardWidth/2 - metric.width/2, topPadding + cardHeight/2 + height/2);
    } else {
        flowerPile.draw();
    }

    // Draw all the main pile cards
    for (let i = 0; i < 8; i++) {
        // Draw an outline of the pile if empty
        if (piles[i].length == 0) {
            let x = leftPileX + i * (cardWidth + pileSpacing);
            let y = leftPileY;

            drawRoundedEdgeCard(x, y, null, edgeColor);
        }
        for (let j = 0; j < piles[i].length; j++) {
            let card = piles[i][j];
            card.draw();
        }
    }
    for (let card of selectedStack) card.draw();
}