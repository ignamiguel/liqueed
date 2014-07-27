'use strict';
var ostore = require('ostore');

var stores = { }

function getCreateStore(name) {
    if (stores[name])
        return stores[name];
        
    var store = ostore.createStore();
    stores[name] = store;
    return store;
}

function createStore(name) {
    stores[name] = store;
    return store;
}

function clear() {
    for (var n in stores) {
    }
}

module.exports = {

    store: getCreateStore,

    createStore: createStore,
    clear: clear

}


