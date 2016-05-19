class Observable {
    
    constructor() {
        console.log('new Observable()');
        this.subscribers = [];
    }

    function filter(fn) {
        const filtered = new Observable();
        console.log(`Observable.filter(${fn});`); 
        return filtered;
    }

    function on(callback) {
        console.log(`Observable.on(${callback});`);
    }

    function emit(data) {
        console.log(`Observable.emit(${data});`);
    }
}
