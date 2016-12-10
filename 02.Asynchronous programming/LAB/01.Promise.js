/**
 * Created by Kondoff on 20-Nov-16.
 */
console.log('Before promise');
new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('done');
    }, 5000);
})
    .then(function(result) {
        console.log('Then returned: ' + result);
    });
console.log('After promise');



new Promise(function(resolve, reject) {
    setTimeout(function() {
        reject('fail');
    }, 1000);
})
    .then(function(result) { console.log(result); })
    .catch(function(error) { console.log(error); });
