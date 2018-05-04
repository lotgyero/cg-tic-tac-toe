
//var Math = require('mathjs');
/*
var fok = function (obj) {
    console.log(obj.msg);
}

var ffail = function (obj) {
    console.log(obj.msg);
}

var fcatch = function (obj) {
    console.log('Catch function');
}

var f = new Promise(function(ok, fail, obj1, obj2) {
    if (Math.random() > .5)
        fok({msg: 'This is ok function'});
    else
        ffail({msg: 'This is fail function'});
})

f.then(fok, ffail, 0.4).catch(fcatch);
*/
var gameModel = require('./logic');