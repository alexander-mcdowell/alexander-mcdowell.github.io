const defaultEdgeWeight = 1;
class GraphInterface {
    // Interface modes: 0 for undirected graph, 1 for directed graph
    constructor(mode, label) {
        this.mode = mode;
        this.label = label;
        if (mode == 0) this.graph = new Graph();
        else this.graph = new DirectedGraph();

        this.globalNodeCounter = 1;
        this.missing = [];

        this.mousePos = [0, 0];
        this.selectedNodes = [];
        this.draggedNode = null;
        this.weightVisible = true;
    }

    get getMode() { return this.mode; }
    get getLabel() { return this.label; }
    get isDragging() { return this.draggedNode!=null; }

    toggleWeightVisibility() { this.weightVisible = !this.weightVisible; }

    mouseOnNode() {
        let iter = this.graph.getVertices;
        for (let i = 0; i < this.graph.getNumVertices; i++) {
            let node = iter.next().value;
            let pos = node.getPos;
            if ((Math.pow(this.mousePos[0] - pos[0], 2) + Math.pow(this.mousePos[1] - pos[1], 2)) > Math.pow(node.getRadius, 2)) continue;
            return node;
        }
        return null;
    }

    mouseOnWeight() {
        let iter = this.graph.getEdges;
        for (let i = 0; i < this.graph.getNumEdges; i++) {
            let edge = iter.next().value;
            if (edge.pointOnWeight(this.mousePos[0], this.mousePos[1])) return edge;
        }
        return null;
    }

    removeNode(label, componentList) {
        this.missing.push(label);
        this.missing = this.missing.sort().reverse();
        if (label==this.graph.globalNodeCounter-1) this.globalNodeCounter -= 1;

        this.graph.removeVertex(label);
        if (this.mode==0) this.updateConnectedComponentsList(componentList);
        window.requestAnimationFrame(draw);
    }

    removeEdge(label, componentList) {
        this.graph.removeEdge(label);
        if (this.mode==0) this.updateConnectedComponentsList(componentList);
        window.requestAnimationFrame(draw);
    }

    handleLeftClick(event, componentList) {
        let edge = this.mouseOnWeight();
        // Edge weight editing
        if (edge != null) {
            while (true) {
                let newWeight = window.prompt("Enter a new edge weight.", edge.getWeight);

                // Check if input is valid
                newWeight = parseFloat(newWeight);
                if (isNaN(newWeight)) continue;
                else if (this.mode == 0 && newWeight < 0) continue;
                if (newWeight == 0) {
                    this.removeEdge(edge.getLabel, componentList);
                    break;
                }
                
                // Update weights
                this.graph.setEdgeWeightByLabels(edge.getSource.getLabel,edge.getDest.getLabel,newWeight);
                if (this.mode==0) this.updateConnectedComponentsList(componentList);
                window.requestAnimationFrame(draw);
                break;
            }
            return;
        }

        let node = this.mouseOnNode();

        // First check if the node exists
        if (node) {
            // Unselect dragged node on left click released
            if (this.draggedNode) {
                this.draggedNode = null;
                return;
            }
            
            // We are not dragging a node, so handle the selected node
            if (this.draggedNode == null) {
                // Toggle selected node
                if (this.selectedNodes.length==0 || node.getLabel != this.selectedNodes[0].getLabel) {
                    node.setColor = "#1cc1eaff";
                    this.selectedNodes.push(node);
                } else {
                    node.setColor = "#d64d4dff";
                    this.selectedNodes = [];
                }

                // We have selected two existing nodes, so join them
                if (this.selectedNodes.length == 2) {
                    this.selectedNodes[0].setColor = "#d64d4dff";
                    this.selectedNodes[1].setColor = "#d64d4dff";
                    
                    if (!this.graph.areAdjacent(this.selectedNodes[0], this.selectedNodes[1])) {
                        this.graph.addEdge(this.selectedNodes[0], this.selectedNodes[1], defaultEdgeWeight, "#000000ff");
                        if (this.mode==0) this.updateConnectedComponentsList(componentList);
                    }

                    this.selectedNodes = [];
                }
            }
        }
        // Node doesn't exist, so make a new one
        else {
            // Determine the label for the new node
            let counter;
            if (this.missing.length == 0) {
                counter = this.globalNodeCounter;
            } else {
                counter = this.missing.pop(0);
            }
            if (counter==this.globalNodeCounter) this.globalNodeCounter += 1

            // Add a new node and edge
            if (this.selectedNodes.length == 1) {
                let node = new Node(this.mousePos[0], this.mousePos[1], 20, "#d64d4dff", counter);

                this.graph.addVertex(node);
                this.graph.addEdge(this.selectedNodes[0], node, defaultEdgeWeight, "#000000ff");

                this.selectedNodes[0].setColor = "#d64d4dff";
                this.selectedNodes = [];
            }
            // Otherwise just add a new node
            else {
                this.graph.addVertex(new Node(this.mousePos[0], this.mousePos[1], 20, "#d64d4dff", counter));
            }

            if (this.mode==0) this.updateConnectedComponentsList(componentList);
        }
    }

    handleRightClick(event, componentList) {
        let node = this.mouseOnNode();
        if (node) {
            this.removeNode(node.getLabel, componentList);
            if (node.getLabel == this.selectedNodes[0].getLabel) {
                node.setColor = "#d64d4dff";
                this.selectedNodes = [];
            }
        }
    }

    handleMouseEvent(event) {
        this.mousePos = [event.offsetX, event.offsetY];
        if (event.buttons & 1) {
            if (this.draggedNode == null) {
                let node = this.mouseOnNode();
                if (node != null) this.draggedNode = node;
            } else {
                this.draggedNode.setPos = this.mousePos;
            }
        }
    }

    updateConnectedComponentsList(list) {
        while (list.firstChild) { list.removeChild(list.lastChild); }

        let components = this.graph.getConnectedComponents;
        let numPerRow = 4;
        let row = document.createElement("tr");

        for (let i = 0; i < components.length; i++) {
            let rowData = document.createElement("td");
            rowData.className = "component";
            let componentInfo = document.createElement("table");

            // Header
            let info = document.createElement("td");
            let infoRow = document.createElement("tr");
            info.textContent = "Group " + String(i+1) + ": $[" + String(components[i]) + "]$";
            infoRow.appendChild(info);
            componentInfo.appendChild(infoRow);

            // Size
            info = document.createElement("td");
            infoRow = document.createElement("tr");
            info.textContent = "Size: $" + components[i].length + "$";
            infoRow.appendChild(info);
            componentInfo.appendChild(infoRow);

            // Searching
            for (let search of ["DFS", "BFS"]) {
                info = document.createElement("td");
                infoRow = document.createElement("tr");
                info.textContent = search + ": $[";

                let path = [];
                if (search=="DFS") path = this.graph.dfs(components[i][0]);
                else path = this.graph.bfs(components[i][0]);

                let iter = path.values();
                for (let j=0; j<path.size; j++) {
                    info.textContent += String(iter.next().value);
                    if (j != path.size-1) info.textContent += ", ";
                }
                info.textContent += "]$";
                infoRow.appendChild(info);
                componentInfo.appendChild(infoRow);
            }

            // Adjacency matrix
            info = document.createElement("td");
            infoRow = document.createElement("tr");
            let mat = [];
            for (let j = 0; j < components[i].length; j++) {
                let row = []
                for (let k = 0; k < components[i].length; k++) {
                    let w = this.graph.getEdgeWeightByLabels(components[i][j], components[i][k]);
                    if (w==undefined) row.push(0);
                    else row.push(w);
                }
                mat.push(row);
            }
            let temp = document.createElement("p");
            temp.textContent = "Adjacency Matrix: ";
            info.appendChild(temp);

            // LaTeX for adjacency matrix
            temp = document.createElement("p");
            temp.textContent = this.matrixToTex(mat);
            info.appendChild(temp);
            infoRow.appendChild(info);
            componentInfo.appendChild(infoRow);

            // // List nodes and adjacencies:
            infoRow = document.createElement("tr");
            info = document.createElement("td");
            info.textContent = "Nodes:"

            let nodeTable = document.createElement("table");
            for (let j = 0; j < components[i].length; j++) {
                // Node
                let nodeInfoRow = document.createElement("tr");
                let nodeInfo = document.createElement("td");
                let v = this.graph.getVertexByLabel(components[i][j]);
                let label = document.createElement("label");
                let l = "delete-button-" + j + "-" + components[i][j];
                label.textContent = "$" + v.getDisplayLabel + "$: ";
                label.htmlFor = l;
                nodeInfo.appendChild(label);

                // Delete node button
                let GI = this; // Reference to graph interface object
                let deleteButton = document.createElement("button");
                deleteButton.textContent="Delete Node";
                deleteButton.label = l;
                deleteButton.addEventListener("click", (e)=>{
                    let list = document.getElementById("connected-components-list"+GI.label);
                    GI.removeNode(components[i][j], list);
                });
                nodeInfo.appendChild(deleteButton);

                // Adjacencies for node
                let nodeAdjTable = document.createElement("table");
                for (let adj of this.graph.getAdjacent(v)) {
                    let adjItemRow = document.createElement("tr");
                    let adjItem = document.createElement("td");
                    
                    // Label for text box
                    let adjLabel = document.createElement("label")
                    let l = "weight-entry-" + v.getLabel + "-"+adj + "-" + this.label;
                    adjLabel.textContent = "Vertex: $" + adj + "$, Weight: ";
                    adjLabel.htmlFor = l;
                    adjItem.appendChild(adjLabel);
                    
                    // Text box for changing weights
                    let adjTextInput = document.createElement("input");
                    adjTextInput.type = "text";
                    adjTextInput.placeholder = GI.graph.getEdgeWeightByLabels(v.getLabel, adj);
                    adjTextInput.value = this.graph.getEdgeWeightByLabels(v.getLabel, adj);
                    adjTextInput.id = l;

                    // On user input to textbox
                    adjTextInput.addEventListener('focusout', (e)=>{
                        // Get labels from id
                        let arr = e.target.id.split("-");
                        let l1 = parseInt(arr[2]); let l2 = parseInt(arr[3]);

                        // Check if input is valid
                        let newWeight = parseFloat(e.target.value);
                        if (isNaN(newWeight) || (GI.mode==0 && newWeight < 0)) {
                            newWeight = GI.graph.getEdgeWeightByLabels(l1,l2);
                            if (GI.mode == 0) {
                                let e2 = document.getElementById(arr[0]+"-"+arr[1]+"-"+arr[3]+"-"+arr[2]+"-"+GI.label);
                                e2.value = "";
                            }
                        }
                        else if (newWeight == 0) {
                            GI.removeEdge(l1+"-"+l2, list);
                            return;
                        }
                        else {
                            if (GI.label == 0) document.getElementById(arr[0]+"-"+arr[1]+"-"+arr[3]+"-"+arr[2]+"-"+GI.label).value = newWeight;
                        }
                        
                        // Update weights and redraw
                        GI.graph.setEdgeWeightByLabels(l1,l2,newWeight);
                        GI.updateConnectedComponentsList(list);
                        window.requestAnimationFrame(draw);
                    });

                    adjItem.appendChild(adjTextInput);
                    adjItemRow.appendChild(adjItem);
                    nodeAdjTable.appendChild(adjItemRow);
                }

                nodeInfo.appendChild(nodeAdjTable);
                nodeInfoRow.appendChild(nodeInfo);
                nodeTable.appendChild(nodeInfoRow);
            }

            info.appendChild(nodeTable);
            infoRow.appendChild(info);
            componentInfo.appendChild(infoRow);

            rowData.appendChild(componentInfo);
            row.appendChild(rowData);

            if (i%numPerRow==numPerRow-1) {
                list.appendChild(row);
                row = document.createElement("tr");
            }
        }
        
        if (components.length%numPerRow!=0) list.appendChild(row);
        MathJax.typeset();
    }

    // Get the tex of a matrix with f applied element-wise
    matrixToTex(mat) {
        let s = "$\\begin{pmatrix}";
        for (let i = 0; i < mat.length; i++) {
            let t = "";
            for (let j = 0; j < mat.length; j++) {
                t += String(mat[i][j]);
                if (j != mat.length-1) t += "&";
            }
            s += t
            if (i != mat.length-1) s += "\\\\";
        }
        return s + "\\end{pmatrix}$"
    }

    draw(canvas, context) {
        let width = canvas.width;
        let height = canvas.height;

        context.clearRect(0, 0, width, height);
        context.font = "24px serif";

        // Draw vertices
        let iter = this.graph.getVertices;
        for (let i = 0; i < this.graph.getNumVertices; i++) {
            iter.next().value.draw(context);
        }
        // Draw edges
        iter = this.graph.getEdges;
        for (let i = 0; i < this.graph.getNumEdges; i++) {
            let e = iter.next().value;
            let drawBezier = this.mode!=0 && this.graph.hasEdge(e.getDest.getLabel+"-"+e.getSource.getLabel);
            e.draw(context, this.weightVisible, drawBezier);
        }
    }
}