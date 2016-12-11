/**
 * Created by Kondoff on 11-Dec-16.
 */
function listMyMessages() {
    $('#myMessages').empty();
    showView('viewMyMessages');
    let name = sessionStorage.getItem('userName');

    $.ajax({
        method: "GET",
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/messages?query="+ `{"recipient_username":"${name}"}`,
        headers: getKinveyUserAuthHeaders(),
        success: loadMessagesSuccess,
        error: handleAjaxError
    });
    
    function loadMessagesSuccess(messages) {
        showInfo('Messages loaded.');
        if(messages.length==0){
            let messageTable = $('<table>')
                .append($('<tr>').append(
                    '<th>From</th><th>Message</th>',
                    ' <th>Date Received</th><th>Actions</th>'));
            $('#myMessages').appendTo(messageTable)
        }
        else {
                let messageTable = $('<table>')
                    .append($('<tr>').append(
                        '<th>From</th><th>Message</th>',
                        ' <th>Date Received</th>'));
            for (let message of messages)
                appendMessageRow(message, messageTable);
            $('#myMessages').append(messageTable);
        }


    }

    function appendMessageRow(message, messageTable) {
        let sender = formatSender(message.sender_name, message.sender_username);
        let receivedDate=formatDate(message._kmd.lmt);

        messageTable.append($('<tr>').append(
            $('<td>').text(sender),
            $('<td>').text(message.text),
            $('<td>').text(receivedDate)
        ));
    }
}

function listArchive() {
    $("#sentMessages").empty();
    let name = sessionStorage.getItem('userName');


    $.ajax({
        method: "GET",
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/messages?query="+ `{"sender_username":"${name}"}`,
        headers: getKinveyUserAuthHeaders(),
        success: listArchiveSuccess,
        error: handleAjaxError
    });
    
    function listArchiveSuccess(messages) {
        showInfo('Messages loaded.');
        if(messages.length==0){
            let messageTable = $('<table>')
                .append($('<tr>').append(
                    '<th>To</th><th>Message</th>',
                    ' <th>Date Received</th><th>Actions</th>'));
            $('#sentMessages').appendTo(messageTable)
        }
        else {
            let messageTable = $('<table>')
                .append($('<tr>').append(
                    '<th>To</th><th>Message</th>',
                    ' <th>Date Received</th><th>Actions</th>'));
            for (let message of messages)
                appendArchiveMessageRow(message, messageTable);
            $('#sentMessages').append(messageTable);
        }
    }

    function appendArchiveMessageRow(message,messageTable) {
        let links=[];
        let deleteButton=$('<input/>').attr({
            type:"button",
            id:"buttonForDelete",
            value:"Delete"
        }).click(function () { deleteCurrentMessage(message) });
        links.push(deleteButton);
        let receivedDate=formatDate(message._kmd.lmt);
        let msgContent=`from ${message.sender_username} to ${message.recipient_username}`;

        messageTable.append($('<tr>').append(
            $('<td>').text(message.recipient_username),
            $('<td>').text(message.text),
            $('<td>').text(receivedDate),
            $('<td>').append(deleteButton)
        ));
        showView('viewArchiveSent');
    }
}

function deleteCurrentMessage(message) {
    $.ajax({
        method: "DELETE",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/messages/" + message._id,
        headers: getKinveyUserAuthHeaders(),
        success: deleteCurrentMessageSuccess,
        error: handleAjaxError
    });
    
    function deleteCurrentMessageSuccess(response) {
        listArchive();
        showInfo('Message deleted.');
    }

}

function showSendMessageMenu() {
    $.ajax({
        method:'GET',
        url:kinveyBaseUrl + "user/" + kinveyAppKey,
        headers:getKinveyUserAuthHeaders(),
        success:loadUserSuccess,
        error:handleAjaxError
    });
    showView('viewSendMessage')
}

function loadUserSuccess(users) {
    $('#msgRecipientUsername').empty();
    for(let user of users){
        let username = formatSender(user.username, user.name);
        let option = $("<option>")
            .text(username)
            .val(user._id);
        $('#msgRecipientUsername').append(option)
    }


}


function sendMessage(event) {
    event.preventDefault();
    let userValue=$('#msgRecipientUsername').val();
    let textMsg= $('#formSendMessage input[name=text]').val();

    $.ajax({
        method:'GET',
        url:kinveyBaseUrl + "user/" + kinveyAppKey +`/${userValue}`,
        headers:getKinveyUserAuthHeaders(),
        success:displayUserInfo,
        error:handleAjaxError
    });
    function displayUserInfo(user) {
        let messageData={
            sender_username:sessionStorage.getItem('userName'),
            sender_name:sessionStorage.getItem('name'),
            recipient_username:user.name,
            text:textMsg
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/messages",
            headers: getKinveyUserAuthHeaders(),
            data: messageData,
            success: sendMessageSuccess,
            error: handleAjaxError
        });
        function sendMessageSuccess(response) {
            listArchive();
            showInfo('Message Sent')
        }
        
    }



}

