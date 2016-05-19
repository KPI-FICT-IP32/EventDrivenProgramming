class Observable {
    
    constructor() {
        this.subscribers = [];
    }

    filter(fn) {
        const filtered = new Observable();
        this.subscribers.push({fn: fn, cb: filtered.emit.bind(filtered)});
        return filtered;
    }

    on(callback) {
        this.subscribers.push({fn: (x) => true, cb: callback});
    }

    emit(data) {
        console.log(this);
        this.subscribers.forEach( (s) => { if (s.fn(data)) { s.cb(data); } });
    }
}

// var o = new Observable();
// var o1 = o.filter(({a}) => a < 12);
// o.on((x) => {console.log(`o: ${x}`);});
// o1.on((x) => {console.log(`o1: ${x}`);});
// o.emit({a:1});
// o.emit({a:15});

// vim: set ts=8 sw=4 tw=0 et :
