/**
 * Created by Kondoff on 19-Nov-16.
 */
function solve() {
    $('#submit').click(send);
    $('#refresh').click(refresh);
    let baseURL="https://kondoff-95d1e.firebaseio.com/messanger.json";

    function send() {
        let author=$('#author').val();
        let content=$('#content').val();

        let request={
            author:author,
            content:content,
            timestamp: Date.now()
        };

        $.post(baseURL,JSON.stringify(request))
            .then(refresh)

        $('#author').val('');
        $('#content').val('');
    }


    function refresh() {
        $.get(baseURL)
            .then(displayResults)
    }

    function displayResults(messages) {
        $('#messages').empty();
        let keys=Object.keys(messages).sort((m1,m2)=>messages[m1].timestamp - messages[m2].timestamp);
        for(let msg of keys){
            $('#messages').append(`${messages[msg].author}: ${messages[msg].content}\n`)
        }

    }

}