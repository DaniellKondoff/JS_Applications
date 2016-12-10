/**
 * Created by Kondoff on 19-Nov-16.
 */
function solve() {
    let baseURL='https://judgetests.firebaseio.com/schedule/';
    let name='';
    let nextID='depot';

    function depart() {
        $('#depart').prop('disabled',true);

        let getMethod={
            method:'GET',
            url:baseURL+nextID+'.json'
        };
        $.ajax(getMethod)
            .then(displayResults)
    }

    function displayResults(data) {
        name=data.name;
        nextID=data.next;
        $('#info').find('span').text(`Next stop ${name}`);
        $('#arrive').prop('disabled',false);
    }

    function arrive() {
        $('#depart').prop('disabled',false);
        $('#arrive').prop('disabled',true);
        $('#info').find('span').text(`Arriving at ${name}`);
    }


    return {
        depart,
        arrive
    };
}
let result = solve();
