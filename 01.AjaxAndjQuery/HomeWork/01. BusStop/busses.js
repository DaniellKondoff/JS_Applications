/**
 * Created by Kondoff on 18-Nov-16.
 */
function getInfo() {
    let stopID=$('#stopId').val();
    let baseURL='https://judgetests.firebaseio.com/businfo/';
    let fullUrl=`${baseURL}${stopID}.json`;
    let stopName = $('#stopName');
    let buses = $('#buses');

    let getRequest={
        method:'GET',
        url:fullUrl
    };

    $.ajax(getRequest)
        .then(displayResults)
        .catch(displayError);

    function displayError(){
        stopName.html('Error');
        buses.empty()
    }

    function displayResults(data) {
        stopName.text(data.name);
        let keys=Object.keys(data.buses);
        for(let key of keys){
            let busId=key;
            let time=data.buses[key];
            let text=`Bus ${busId} arrives in ${time} minutes`;
            let li=$(`<li>`).append(text).appendTo(buses)
        }
    }
}