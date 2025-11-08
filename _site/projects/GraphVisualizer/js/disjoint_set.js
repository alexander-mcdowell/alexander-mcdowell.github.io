class DisjointSet {
    constructor() {
        this.sets = new Map();
    }

    add(x) {
        if (this.sets.has(x)) { return; }
        this.sets.set(x, x);
    }

    remove(x) {
        this.sets.delete(x);
    }

    reset(x) {
        if (!this.sets.has(x)) { return; }
        this.sets.set(x, x);
    }

    union(x, y) {
        if (!this.sets.has(x)) { this.sets.add(x); }
        if (!this.sets.has(y)) { this.sets.add(y); }

        let x_parent = this.find(x);
        let y_parent = this.find(y);
        if (x_parent == y_parent) { return; }

        this.sets.set(y_parent, x_parent);
    }

    find(x) {
        let x_parent = this.sets.get(x)
        if (x_parent == x) return x;
        let y = this.find(x_parent);
        this.sets.set(x, y);
        return y;
    }

    get_disjoint_sets() {
        let set_by_val = new Map();
        let iter = this.sets.keys();
        for (let i = 0; i < this.sets.size; i++) {
            let x = iter.next().value;
            let y = this.find(x);
            if (!set_by_val.has(y)) set_by_val.set(y, [x]);
            else set_by_val.get(y).push(x);
        }

        let arr = [];
        iter = set_by_val.keys();
        for (let i = 0; i < set_by_val.size; i++) {
            let s = set_by_val.get(iter.next().value);
            arr.push(s);
        }
        return arr;
    }
}