class Observable {
    
    constructor() {
        console.log('new Observable()');
        this.subscribers = [];
    }

    filter(fn) {
        const filtered = new Observable();
        console.log(`Observable.filter(${fn});`); 
        return filtered;
    }

    on(callback) {
        console.log(`Observable.on(${callback});`);
    }

    emit(data) {
        console.log(`Observable.emit(${data});`);
    }
}


var o = new Observable();
o.filter((x) => true);
o.on((x) => {console.log('cool!');});
o.emit({a:12});

// vim: set ts=8 sw=4 tw=0 et :
