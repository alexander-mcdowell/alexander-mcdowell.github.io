class Graph {
    constructor() {
        this.vertices = new Map();
        this.edges = new Map();
        this.adjacencies = new Map();

        this.components = new DisjointSet();
    }

    get getVertices() { return this.vertices.values(); }
    get getNumVertices() { return this.adjacencies.size; }
    get getEdges() { return this.edges.values(); }
    get getNumEdges() { return this.edges.size; }
    get getConnectedComponents() { return this.components.get_disjoint_sets(); }

    // #========================#
    // # VERTEX/EDGE OPERATIONS #
    // #========================#

    addVertex(vertex) {
        if (this.adjacencies.has(vertex.getLabel)) return;
        this.adjacencies.set(vertex.getLabel, new Set());
        this.vertices.set(vertex.getLabel, vertex);

        this.components.add(vertex.getLabel);
    }

    addEdge(src, dest, weight, edgeColor) {
        if (!this.adjacencies.has(src.getLabel)) return;
        if (this.adjacencies.has(dest)) this.addVertex(dest);

        let sl = src.getLabel; let dl = dest.getLabel;

        let adj = this.adjacencies.get(sl);
        if (adj.has(dl)) return;
        adj.add(dl);

        adj = this.adjacencies.get(dl);
        if (adj.has(sl)) return;
        adj.add(sl);

        let l = String(sl)+"-"+String(dl);
        this.edges.set(l, new Edge(src, dest, weight, edgeColor, l, false));

        this.components.union(sl, dl);
    }

    hasVertex(label) { return this.vertices.has(label); }
    hasEdge(label) { return this.edges.has(label); }

    getVertexByLabel(label) {
        if (!this.vertices.has(label)) return null;
        return this.vertices.get(label);
    }

    getAdjacent(vertex) {
        if (!this.adjacencies.has(vertex.getLabel)) return null;
        return this.adjacencies.get(vertex.getLabel);
    }

    areAdjacent(u, v) {
        if (this.areAdjacentLabel(u.getLabel, v.getLabel)) return true;
        return false;
    }

    areAdjacentLabel(ul, vl) {
        if (this.adjacencies.has(ul)) {
            if (this.adjacencies.get(ul).has(vl)) return true;
        } else return false;
        if (this.adjacencies.has(vl)) {
            if (this.adjacencies.get(vl).has(ul)) return true;
        } else return false;
        return false;
    }

    getEdgeByLabels(sl, dl) {
        let e = this.edges.get(String(sl)+"-"+String(dl));
        if (e===undefined) {
            e = this.edges.get(String(dl)+"-"+String(sl));
            if (e===undefined) {
                return undefined;
            }
            return e;
        }
        return e;
    }

    getEdgeWeightByLabels(sl, dl) {
        let e = this.getEdgeByLabels(sl, dl);
        if (e===undefined) return undefined;
        else return e.getWeight;
    }

    setEdgeWeightByLabels(sl, dl, w) {
        let e = this.getEdgeByLabels(sl, dl);
        if (e===undefined) return;
        e.setWeight = w;
    }

    sameComponentLabel(u, v) {
        if (this.sameComponentLabel(u.getLabel, v.getLabel)) return true;
        return false;
    }

    sameComponentLabel(ul, vl) {
        return this.components.find(ul)==this.components.find(vl);
    }

    // Remove the vertex and all connected edges with the given label
    removeVertex(label) {
        if (!this.adjacencies.has(label)) return;

        let adjacents_list = [];
        for (let adj of this.adjacencies.get(label)) {
            adjacents_list.push(adj);
            this.adjacencies.get(adj).delete(label);
            this.edges.delete(label + "-" + adj);
            this.edges.delete(adj + "-" + label);
        }

        // Update graph components by doing a series of depth-first searches
        // on remaining vertices.
        let seen = new Set();
        for (let adj of adjacents_list) {
            // Check if this vertex has already been added to a component
            if (this.components.find(adj) in seen) continue;
            seen.add(adj);
            this.dfs_update_components(adj);
        }

        this.adjacencies.delete(label);
        this.vertices.delete(label);
        this.components.remove(label);
    }

    removeEdge(label) {
        if (!this.edges.has(label)) return;
        this.edges.delete(label);
        
        // Get the two joined node labels by parsing the edge label
        let temp = label.split("-");
        let sl = parseInt(temp[0]); let dl = parseInt(temp[1]);
        this.adjacencies.get(sl).delete(dl);
        this.adjacencies.get(dl).delete(sl);

        // Update graph components by doing a series of depth-first searches
        // on remaining vertices.
        let seen = new Set();
        for (let adj of [sl, dl]) {
            // Check if this vertex has already been added to a component
            if (this.components.find(adj) in seen) continue;
            seen.add(adj);
            this.dfs_update_components(adj);
        }
    }

    // #===========#
    // # SEARCHING #
    // #===========#

    // Depth-first-search starting from label u
    dfs(u) {
        let seen = new Set();
        let stack = [u];
        while (stack.length != 0) {
            let x = stack.pop();
            if (seen.has(x)) continue;
            seen.add(x);
            for (let adj of this.adjacencies.get(x)) {
                if (seen.has(adj)) continue;
                stack.push(adj);
            }
        }
        return seen;
    }

    dfs_update_components(u) {
        let seen = new Set();
        let stack = [u];
        this.components.reset(u);
        while (stack.length != 0) {
            let x = stack.pop();
            if (seen.has(x)) continue;
            seen.add(x);
            for (let adj of this.adjacencies.get(x)) {
                if (seen.has(adj)) continue;

                this.components.reset(adj);
                this.components.union(u, adj)
                stack.push(adj);
            }
        }
        return seen;
    }

    // Depth-first-search for label v starting from label u
    dfs_find(u, v) {
        let seen = new Set();
        let stack = [u];
        while (stack.length != 0) {
            let x = stack.pop();
            if (seen.has(x)) continue;
            if (x == v) return true;
            seen.add(x);
            for (let adj of this.adjacencies.get(x)) {
                if (seen.has(adj)) continue;
                stack.push(adj);
            }
        }
        return false;
    }

    // Breadth-first-search starting from label u
    bfs(u) {
        let seen = new Set();
        let queue = [u];
        while (queue.length != 0) {
            let x = queue[0];
            queue.splice(0, 1)
            if (seen.has(x)) continue;

            seen.add(x);
            for (let adj of this.adjacencies.get(x)) {
                if (seen.has(adj)) continue;
                queue.push(adj);
            }
        }
        return seen;
    }

    // Breadth-first-search for label v from label u
    bfs_search(u, v) {
        let seen = new Set();
        let queue = [u];
        while (queue.length != 0) {
            let x = queue[0];
            if (x == v) return true;
            queue.splice(0, 1)
            if (seen.has(x)) continue;

            route.push(x);
            seen.add(x);
            for (let adj of this.adjacencies.get(x)) {
                if (seen.has(adj)) continue;
                queue.push(adj);
            }
        }
        return false;
    }

    // Use Dijkstra's algorithm to find the shortest path between vertices
    // Negative edge weights are not permitted in an undirected graph as the graph would contain a negative cycle.
    getShortestPath(start, end) {
        if (!this.vertices.has(start)) return null;
        if (!this.vertices.has(end)) return null;

        // Vertices are in different connected components
        if (this.components.find(start) != this.components.find(end)) return null;
        
        let dists = new Map();
        let prevs = new Map();
        let iter = this.getVertices;
        for (let i = 0; i < this.getNumVertices; i++) {
            let v = iter.next().value;
            dists.set(v.getLabel, null);
            prevs.set(v.getLabel, null);
        }

        // TODO: Use Priority Queue instead
        let pq = [[0, start]];
        dists.set(start, 0);
        while (pq.length != 0) {
            let best_index = 0;
            let best_dist = null;
            for (let i = 0; i < pq.length; i++) {
                if (best_dist==null || pq[i][0] < best_dist) {
                    best_dist = pq[i][0];
                    best_index = i;
                }
            }

            let u = pq[best_index][1];
            pq.splice(best_index, 1);

            for (let v of this.adjacencies.get(u)) {
                let e = this.getEdgeByLabels(u, v);
                if (dists.get(v)==null || dists.get(u) + e.getWeight < dists.get(v)) {
                    dists.set(v, dists.get(u) + e.getWeight);
                    prevs.set(v, u);
                    pq.push([dists.get(v), v]);
                }
            }
        }

        // There is no path from start to end
        if (dists.get(end)==null) return null;
        
        // Path reconstruction
        let path = [end];
        let curr = end;
        while (start != curr) {
            curr = prevs.get(curr);
            path.push(curr);
        }
        
        return [dists.get(end), path.reverse()];
    }
}

class DirectedGraph extends Graph {
    constructor() {
        super()
        this.components = null;
    }

    get getVertices() { return this.vertices.values(); }
    get getNumVertices() { return this.adjacencies.size; }
    get getEdges() { return this.edges.values(); }
    get getNumEdges() { return this.edges.size; }
    get getConnectedComponents() { return []; }

    // #==============================#
    // # VERTEX/EDGE ADDITION/REMOVAL #
    // #==============================#

    addVertex(vertex) {
        if (this.adjacencies.has(vertex.getLabel)) return;
        this.adjacencies.set(vertex.getLabel, new Set());
        this.vertices.set(vertex.getLabel, vertex);
    }

    addEdge(src, dest, weight, edgeColor) {
        if (!this.adjacencies.has(src.getLabel)) return;
        if (this.adjacencies.has(dest)) this.addVertex(dest);

        let sl = src.getLabel; let dl = dest.getLabel;

        let adj = this.adjacencies.get(sl);
        if (adj.has(dl)) return;
        adj.add(dl);

        let l = String(sl)+"-"+String(dl);
        this.edges.set(l, new Edge(src, dest, weight, edgeColor, l, true));
    }

    removeVertex(label) {
        if (!this.adjacencies.has(label)) return;

        let iter = this.getVertices;
        for (let i = 0; i < this.getNumVertices; i++) {
            let v = iter.next().value.getLabel;
            if (v == label) continue;
            if (this.areAdjacentLabel(v, label)) {
                this.adjacencies.get(v).delete(label);
                this.edges.delete(v + "-" + label);
            }
            if (this.areAdjacentLabel(label, v)) {
                this.edges.delete(label + "-" + v);
            }
        }

        this.adjacencies.delete(label);
        this.vertices.delete(label);
    }

    removeEdge(label) {
        if (!this.edges.has(label)) return;
        this.edges.delete(label);
        
        // Get the two joined node labels by parsing the edge label
        let temp = label.split("-");
        let sl = parseInt(temp[0]); let dl = parseInt(temp[1]);
        this.adjacencies.get(sl).delete(dl);
    }

    areAdjacentLabel(ul, vl) {
        if (this.adjacencies.has(ul)) {
            if (this.adjacencies.get(ul).has(vl)) return true;
        } else return false;
        return false;
    }

    getEdgeByLabels(sl, dl) {
        let e = this.edges.get(String(sl)+"-"+String(dl));
        if (e===undefined) return undefined;
        return e;
    }

    getShortestPath(start, end) {
        if (!this.vertices.has(start)) return null;
        if (!this.vertices.has(end)) return null;

        let dists = new Map();
        let prevs = new Map();
        let iter = this.getVertices;
        for (let i = 0; i < this.getNumVertices; i++) {
            let v = iter.next().value;
            dists.set(v.getLabel, null);
            prevs.set(v.getLabel, null);
        }
        dists.set(start, 0);

        // Relax edges for each vertex
        for (let i = 0; i < this.getNumVertices - 1; i++) {
            iter = this.getEdges;
            let relaxed = false;
            for (let j = 0; j < this.getNumEdges; j++) {
                let e = iter.next().value;
                let u = e.getSource.getLabel; let v = e.getDest.getLabel; let w = e.getWeight;
                if (dists.get(u)!=null && (dists.get(v)==null || dists.get(u) + w < dists.get(v))) {
                    dists.set(v, dists.get(u) + w);
                    prevs.set(v, u);
                    relaxed = true;
                }
            }
            if (!relaxed) break;
        }

        // Check for negative-weight cycles
        iter = this.getEdges;
        for (let j = 0; j < this.getNumEdges; j++) {
            let e = iter.next().value;
            let u = e.getSource.getLabel; let v = e.getDest.getLabel; let w = e.getWeight;
            if (dists.get(u)!=null && dists.get(v)!=null && dists.get(u) + w < dists.get(v)) {
                // Negative cycle found
                return null;
            }
        }

        // There is no path from start to end
        if (dists.get(end)==null) return null;
        
        // Path reconstruction
        let path = [end];
        let curr = end;
        while (start != curr) {
            curr = prevs.get(curr);
            path.push(curr);
        }
        
        return [dists.get(end), path.reverse()];
    }
}

class Node {
    constructor(x, y, radius, color, counter) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.adj = [];

        this.label = counter;
        this.display_label = String(counter);
    }

    get getPos() { return [this.x, this.y]; }
    get getColor() { return this.color; }
    get getRadius() { return this.radius; }
    get getLabel() { return this.label; }
    get getDisplayLabel() { return this.display_label; }
    
    set setPos(pos) { this.x = pos[0]; this.y = pos[1]; }
    set setRadius(radius) { return this.radius = radius; }
    set setColor(color) { this.color = color; }

    draw(ctx) {
        // Draw the circle first
        ctx.fillStyle = this.color;
        const circle = new Path2D();
        circle.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, Math.PI * 2);
        ctx.fill(circle);

        // Get metrics on text to help positioning, then draw text
        ctx.fillStyle = "#000000";

        let metric = ctx.measureText(this.display_label);
        let height = metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent;
        ctx.fillText(this.display_label, this.x - metric.width/2, this.y + height/2);
    }
}

class Edge {
    constructor(source, dest, weight, edgeColor, label, directed) {
        this.source = source;
        this.dest = dest;
        this.edgeColor = edgeColor;
        this.label = label;
        this.weight = weight;
        this.directed = directed;
        // (x, y) = top-left corner, width, height, angle, pivot x, pivot y
        this.weightBoundingBox = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    }

    get getSource() { return this.source; }
    get getDest() { return this.dest; }
    get getColor() { return this.edgeColor; }
    get getWeight() { return this.weight; }
    get getLabel() { return this.label; }

    set setWeight(weight) { this.weight = weight; }

    pointOnWeight(x, y) {
        if (this.weightBoundingBox[0]==undefined) return false;

        let p = rotate(translate([x,y], [-this.weightBoundingBox[5], -this.weightBoundingBox[6]]), this.weightBoundingBox[4]);
        let tolerance = 5;
        let dx = p[0] - this.weightBoundingBox[0];
        let dy = p[1] - this.weightBoundingBox[1];
        if (dx < -tolerance || dx > this.weightBoundingBox[2]+tolerance) return false;
        if (dy < -tolerance || dy > this.weightBoundingBox[3]+tolerance) return false;
        return true;
    }

    draw(ctx, drawWeight, drawBezier) {
        ctx.strokeStyle = this.edgeColor;
        ctx.lineWidth = 3;
        let traingleAngle = Math.PI/4;

        let sourcePos = this.source.getPos;
        let r1 = this.source.getRadius;
        let destPos = this.dest.getPos;
        let r2 = this.source.getRadius;

        // Find the points on the boundary of the circles to connect
        let u = normalize([destPos[0]-sourcePos[0], destPos[1]-sourcePos[1]]);
        let X = sourcePos[0]+r1*u[0]; let Y = sourcePos[1]+r1*u[1];
        let X2 = destPos[0]-r2*u[0]; let Y2 = destPos[1]-r2*u[1];

        // Draw traingle if directed
        let diff = [destPos[0] - sourcePos[0], destPos[1] - sourcePos[1]];
        let alpha = Math.atan2(diff[1], diff[0]);
        let beta = alpha;
        if (alpha < -Math.PI/2) alpha += Math.PI;
        else if (alpha > Math.PI/2) alpha -= Math.PI;

        let cx, cy, X3, Y3;
        if (this.directed) {
            let l = 20;
            let p1 = [
                X2 - l * Math.cos(beta - traingleAngle/2),
                Y2 - l * Math.sin(beta - traingleAngle/2)
            ];
            let p2 = [
                X2 - l * Math.cos(beta + traingleAngle/2),
                Y2 - l * Math.sin(beta + traingleAngle/2)
            ];

            ctx.beginPath();
            ctx.moveTo(X,Y);
            // Draw a quadratic bezier curve
            if (drawBezier) {
                p1 = translate(rotate(translate(p1, [-X2, -Y2]), -Math.PI/4), [X2, Y2]);
                p2 = translate(rotate(translate(p2, [-X2, -Y2]), -Math.PI/4), [X2, Y2]);

                X3 = (p1[0]+p2[0])/2;
                Y3 = (p1[1]+p2[1])/2;
                cx = (X+X3)*0.5 - (Y3-Y)/3;
                cy = (Y+Y3)*0.5 + (X3-X)/3;
                ctx.quadraticCurveTo(cx,cy,X3,Y3);
            }
            // Draw a line
            else {
                ctx.lineTo((p1[0]+p2[0])/2,(p1[1]+p2[1])/2);
            }
            ctx.stroke();

            // Draw triangle
            ctx.fillStyle = "#A7A7A7FF";
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(X2, Y2);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p1[0], p1[1]);
            ctx.closePath();
            ctx.fill();
        }
        // For convenience, only draw a Bezier curve if the edge is directed
        else {
            // Draw the line
            ctx.beginPath();
            ctx.moveTo(X,Y);
            ctx.lineTo(X2,Y2);
            ctx.stroke();
        }

        let x, y;
        if (drawWeight) {
            if (drawBezier) {
                x = (X+2*cx+X3)/4;
                y = (Y+2*cy+Y3)/4;
            } else {
                // Get metrics on text to help positioning, then draw text
                x = (X+X2)/2;
                y = (Y+Y2)/2;
            }

            ctx.fillStyle = "#0000FF";
            let metric = ctx.measureText(this.weight);
            let height = metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent;

            ctx.translate(x, y);
            ctx.rotate(alpha);
            ctx.fillText(this.weight, -metric.width/2, -height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Update bounding box for text
            this.weightBoundingBox[0] = -metric.width/2;
            this.weightBoundingBox[1] = -2*height;
            this.weightBoundingBox[2] = metric.width;
            this.weightBoundingBox[3] = height;
            this.weightBoundingBox[4] = -alpha;
            this.weightBoundingBox[5] = x;
            this.weightBoundingBox[6] = y;
        }
    }
}