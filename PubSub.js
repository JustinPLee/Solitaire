class PubSub {
    constructor(){
        this.events = {};
    }
    on(eventName, fn = {}) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].hasEmitted = false;
        this.events[eventName].push(fn);
    }
    off(eventName, fn) {
        if(this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    }
    define(eventName){
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].hasEmitted = false;
        return true;
    }
    exists(eventName) {
        if(this.events[eventName]) return true;
        return false;
    }
    hasEmitted(eventName) {
        if(this.events[eventName]) return this.events[eventName].hasEmitted;
    }
    emit(eventName, data = {}) {
        if(this.events[eventName]){
            this.events[eventName].hasEmitted = true;
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }
}
window.Event = new PubSub();