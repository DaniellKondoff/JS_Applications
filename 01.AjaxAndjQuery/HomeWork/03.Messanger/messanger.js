/**
 * Created by Kondoff on 19-Nov-16.
 */
function solve() {
    $('#submit').click(send);
    $('#refresh').click(refresh);

    let baseURL="https://kondoff-95d1e.firebaseio.com/messanger.json";

    function send() {
        let message={
            author:$('#author').val(),
            content:$('#content').val(),
            timestamp: Date.now()
        };

        $.post(baseURL,JSON.stringify(message))
            .then(refresh);
        $('#author').val('');
        $('#content').val('')
    }


    function refresh() {
        $.get(baseURL)
            .then(displayResults)
    }

    function displayResults(data) {
        $('#messages').empty()
        let keys=Object.keys(data)
            .sort((m1,m2)=> data[m1].timestamp-data[m2].timestamp);
        for(let msg of keys){
            $('#messages').append(`${data[msg].author}: ${data[msg].content}\n`)
        }
    }
}