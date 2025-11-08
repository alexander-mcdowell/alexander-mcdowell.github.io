var resolutions = [[480,240],[640,480],[960,720]];
var defaultResolution = 1;
var canvases = [[null, null], [null, null]];
var componentLists = [null, null];

// 0 for undirected, 1 for directed
var graphMode = -1;
var graphInterfaces = [new GraphInterface(0, 0), new GraphInterface(1, 1)];

window.onload = init;
function init() {
    // Create canvas contexts
    for (let i = 0; i < canvases.length; i++) {
        canvases[i][0] = document.getElementById("canvas" + i);
        if (!canvases[i][0]) {
            console.log("Could not obtain " + String(i+1) + "th <canvas> element.");
            return;
        }

        // Event listeners
        canvases[i][0].addEventListener("click", mouseClickEvent);
        canvases[i][0].addEventListener("contextmenu", mouseRightClickEvent);
        canvases[i][0].addEventListener("mousemove", mouseMoveEvent);

        if (canvases[i][0].getContext) {
            canvases[i][1] = canvases[i][0].getContext("2d");
            console.log("Canvas context " + String(i+1) + " initialized!");

            // Start drawing
            window.requestAnimationFrame(draw);
        } else {
            console.log("Browser does not support <canvas> tag.");
        }

        // Add dropdown options for each resolution
        let dropdown = document.getElementById("size-dropdown" + i);
        dropdown.addEventListener("change", (e)=>{
            let r = resolutions[e.target.value];
            resizeCanvas(r[0], r[1]);
        });
        for (let j = 0; j < resolutions.length; j++) {
            let option = document.createElement("option");
            option.value = j;
            option.selected = j==defaultResolution;
            option.textContent = resolutions[j][0] + "x" + resolutions[j][1];
            dropdown.appendChild(option);
        }

        // Get connected component lists
        componentLists[i] = document.getElementById("connected-components-list"+i);
    }
}

// Set and load graph interface
function setMode(event, mode) {
    let priorMode = graphMode;
    if (mode == "undirected-graph") graphMode = 0;
    else graphMode = 1;

    let tabcontent = document.getElementsByClassName("tabcontent");
    let tablinks = document.getElementsByClassName("tablinks");

    // Clear all existing tabs
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    if (priorMode==graphMode) graphMode = -1;
    else {
        document.getElementById(mode).style.display = "block";
        event.currentTarget.className += " active";
    }
}

function resizeCanvas(w, h) {
    if (graphMode == -1) return;
    canvases[graphMode][0].width = w;
    canvases[graphMode][0].height = h;
    window.requestAnimationFrame(draw);
}

function resetGraph(event) {
    if (graphMode == -1) return;
    graphInterfaces[graphMode] = new GraphInterface(graphInterfaces[graphMode].getMode);
    while (componentLists[graphMode].firstChild) componentLists[graphMode].removeChild(componentLists[graphMode].lastChild);
    window.requestAnimationFrame(draw);
}

function mouseClickEvent(event) {
    if (graphMode == -1) return;
    if (event.button == 0) {
        graphInterfaces[graphMode].handleLeftClick(event, componentLists[graphMode]);
        window.requestAnimationFrame(draw);
    }
}

function mouseRightClickEvent(event) {
    if (graphMode == -1) return;
    event.preventDefault();
    graphInterfaces[graphMode].handleRightClick(event, componentLists[graphMode]);
    window.requestAnimationFrame(draw);   
}

function mouseMoveEvent(event) {
    if (graphMode == -1) return;
    graphInterfaces[graphMode].handleMouseEvent(event);
    if (graphInterfaces[graphMode].isDragging) window.requestAnimationFrame(draw);
}

function getShortestPath(event) {
    if (graphMode == -1) return;

    let resultsDiv = document.getElementById("sp-div"+graphMode);
    if (resultsDiv.firstChild) resultsDiv.removeChild(resultsDiv.firstChild);
    let p = document.createElement("p");

    // Parse input data
    let start = parseInt(document.getElementById("sp-start" + graphMode).value);
    if (start==undefined || !graphInterfaces[graphMode].graph.hasVertex(start)) {
        p.textContent = "Vertex with name " + start + " is invalid or cannot be found.";
        resultsDiv.appendChild(p);
        return;
    }
    let end = parseInt(document.getElementById("sp-end" + graphMode).value);
    if (end==undefined || !graphInterfaces[graphMode].graph.hasVertex(end)) {
        p.textContent = "Vertex with name " + end + " is invalid or cannot be found.";
        resultsDiv.appendChild(p);
        return;
    }

    // Display shortest path
    let pathData;
    if (start==end) { pathData = [0, [start]]; }
    else {
        pathData = graphInterfaces[graphMode].graph.getShortestPath(start, end);
        if (pathData==null) {
            p.textContent = "No shortest path between " + start + " and " + end + " exists.";
            resultsDiv.appendChild(p);
            return;
        }
    }

    let s = "Path Length: " + pathData[0] + ", Path: " + pathData[1].join(" -> ");
    p.textContent = s;
    resultsDiv.appendChild(p);
}

function toggleWeightVisibility(event) {
    graphInterfaces[graphMode].toggleWeightVisibility();
    window.requestAnimationFrame(draw);
}

function draw() {
    if (graphMode != -1) graphInterfaces[graphMode].draw(canvases[graphMode][0], canvases[graphMode][1]);
}