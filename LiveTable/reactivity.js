"use strict";
/**
 * This a reactivity module. It provides basic set of classes
 * and functions for the event-driven development
 */


// Use a reactivity namespace to keep globalscope clean
const reactivity = {};


/**
 * noop = no operation
 * This is a function which does exactly nothing
 */
reactivity.noop = function() {};


/**
 * {reactivity.IllegalStateError} is thrown when trying
 * to do something in an unappropriate state
 */
reactivity.IllegalStateError = class extends Error {
    constructor(message) {
        super(message || 'Illegal state');
        this.name = 'IllegalStateError';
    }
}


reactivity.Observer = class {
    constructor(onNext, onError) {
        this.isClosed = false;
        this._onNext = onNext || reactivity.noop;
        this._onError = onError || reactivity.noop;
    }

    /**
     * Call the {onNext} callback. 
     * If error occurs {onError} callback will be invoked.
     */
    onNext(data) {
        if (this.isClosed) {
            throw new reactivity.IllegalStateError('Observer is closed'); 
        }

        // Run callback. If error happens run error handler
        try {
            this._onNext(data);
        } catch(e) { 
            this._onError(e); 
        }
    }

    /**
     * Close observer. It will no longer recieve data.
     * All the following calls to onNext will raise
     * an {reactivity.IllegalStateError}
     */
    dispose() { this.isClosed = true; }
}


reactivity.Observable = class {
    constructor() {
        this.subscribers = [];
    }

    /**
     * Create a new observable from given by filtering its emitted data.
     * 
     * fn -- filter function
     * onError -- error handler
     * return a new Observable
     */
    filter(fn, onError) {
        const filtered = new reactivity.Observable();
        this.subscribe(
            (data) => { if (fn(data)) filtered.emit(data); },
            onError     
        );
        return filtered;
    }

    /**
     * Creates a new observable, which emits elements created by applying 
     * {fn} to given observable's emitted data
     */
    map(fn, onError) {
        const mapped = new reactivity.Observable();
        this.subscribe((data) => { mapped.emit(fn(data)); }, onError);
        return mapped;
    }

    /**
     * Subscribe to the observable. 
     *
     * onNext -- your callback. This will recieve emitted data.
     * onError -- error handler. This will recieve error.
     *
     * return created observer;
     */
    subscribe(onNext, onError) {
        const observer = new reactivity.Observer(onNext, onError);
        this.subscribers.push(observer);
        return observer;
    }

    /**
     * Emit event. This will schedule all subscribers to execute their
     * callbacks.
     */
    emit(data) {
        let i = 0;
        while (i < this.subscribers.length) {
            let observer = this.subscribers[i];
            if (observer.isClosed) {
                this.subscribers.splice(i, 1);
                continue;
            }
            setTimeout(() => { observer.onNext(data); }, 0);
            i++;
        }
    }

    /**
     * Merges given observables into one stream
     *
     * arguments -- list of observables to merge
     *
     * return new observable
     */
    static merge() {
        if (!arguments.length) {
            throw new TypeError('At least one argument must be provided');
        }

        const merged = new reactivity.Observable();
        for (let observable of arguments) {
            if (!(observable instanceof reactivity.Observable)) {
                throw new TypeError(`Observable expected, ${typeof(observable)} found!`);
            }
            observable.subscribe((x) => {merged.emit(x);});
        }

        return merged;
    }
}


// Export
if (typeof(module) !== 'undefined') {
    module.exports = reactivity;
}


/* vim: set ts=4 sw=4 tw=0 et : */
