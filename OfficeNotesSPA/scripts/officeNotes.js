/**
 * Created by Kondoff on 08-Dec-16.
 */
function startApp() {
    //sessionStorage.clear(); // Clear user auth data
    showHideMenuLinks();
    //showView('viewHome');

    // Bind the navigation menu links
    $("#linkHome").click(showHomeView);
    $("#linkListNotes").click(listNotes);
    $("#linkListMyNotes").click(listMyNotes);
    $("#linkCreateNote").click(showCreateNoteView);
    $("#linkLogout").click(logoutUser);

    // Bind the form submit buttons
    $("#buttonLinkLoginUser").click(linkToLoginView);//
    $("#buttonLinkRegisterUser").click(linkToRegisterView);//
    $("#buttonLoginUser").click(loginUser);//
    $("#buttonRegisterUser").click(registerUser);//
    $('#buttonCreateNote').click(createNewNote);//
    $('#buttonEditNote').click(editNote);
    $('#buttonDeleteNote').click(deleteNote);
    $('#buttonCancelDeleteNote').click(cancelDeleteNote);

    // Bind the info / error boxes: hide on click
    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });
    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    //View Function
    function showHideMenuLinks() {
        if (sessionStorage.getItem('authToken')) {
            showView('viewHome');
            $("#linkHome").show();
            $("#linkListNotes").show();
            $("#linkListMyNotes").show();
            $("#linkCreateNote").show();
            $("#linkLogout").show();

        }
        else {
            // No logged in user
            $("#linkHome").hide();
            $("#linkListNotes").hide();
            $("#linkListMyNotes").hide();
            $("#linkCreateNote").hide();
            $("#linkLogout").hide();
            showView('dialog-box');
            linkToLoginView
            linkToRegisterView
        }
    }
    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }
    function showHomeView() {
        showView('viewHome');
    }
    function linkToLoginView() {
        showView('viewLogin');
        $('#formLogin').trigger('reset');
    }
    function linkToRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
    }

    //Authoziration part
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_SyH2G6Lmx";
    const kinveyAppSecret = "30a564ab413b427b84030ef2ae2d9ace";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    function registerUser() {
        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val(),
            fullName:$('#formRegister input[name=fullname]').val()
        };
        $.ajax({
            method:"POST",
            url:kinveyBaseUrl+'user/'+kinveyAppKey+'/',
            headers:kinveyAppAuthHeaders,
            data:userData,
            success:registerSuccess,
            error:handleAjaxError
        });

        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            //showView('viewHome');
            showInfo('User registration successful.')
        }

    }
    function saveAuthInSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('userName', username);
        let fullname=userInfo.fullName;
        sessionStorage.setItem('fullName', fullname);
        $('#loggedInUser').text(`${fullname} (${username})`);
    }
    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }
    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }


    function loginUser() {
        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };

        $.ajax({
            method:'POST',
            url:kinveyBaseUrl+'user/'+kinveyAppKey+'/login',
            headers:kinveyAppAuthHeaders,
            data:userData,
            success:loginSuccess,
            error:handleAjaxError
        });

        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            //showView('viewHome');
            showInfo('Login successful.')
        }
    }
    function logoutUser() {
        $.ajax({
            method:'POST',
            url:kinveyBaseUrl +'user/'+kinveyAppKey+'/_logout',
            headers:getKinveyUserAuthHeaders(),
            success:logoutSuccess,
            error:handleAjaxError
        });
        function logoutSuccess(data) {
            sessionStorage.clear();
            $('#loggedInUser').text("");
            showHideMenuLinks();
            showInfo('Logout successful.');
        }
    }
    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " +
            sessionStorage.getItem('authToken'),
        };
    }
    //END Authorization


    //CRUD
    function listNotes() {
        $('#listItem').empty();
        showView('listItems');
        let date=new Date().toISOString().slice(0,10);

        $.ajax({
            method:'GET',
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+"/notes?query="+`{"deadline":"${date}"}`,
            headers:getKinveyUserAuthHeaders(),
            success:loadNotesSuccess,
            error:handleAjaxError
        });
        function loadNotesSuccess(notes) {
            showInfo('Notes loaded.');
            if(notes.length==0){
                $('#listItem').text('No Notes in the Office')
            }
            else {
                let ul=$('<ul>');
                for (let note of notes){
                    appendNoteRow(note,ul);
                    $('#listItem').append(ul)
                }

            }

        }
    }
    function appendNoteRow(note, ul) {
        ul.append($('<li>').append(
            $('<h2>').text(note.title),
            $('<p>').text(note.text),
            $('<div>').text(note.author),
            $('<div>').text(note.deadline)
        ));
    }

    function listMyNotes() {
        $('#listItem').empty();
        showView('listItems');
        let name = sessionStorage.getItem('fullName');
        //let obj={'author':sessionStorage.getItem('fullName')};

        $.ajax({
            method:'GET',
            url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/notes?query="+ `{"author":"${name}"}`,
            headers:getKinveyUserAuthHeaders(),
            success:loadNotesSuccess,
            error:handleAjaxError
        });
        function loadNotesSuccess(notes) {
            showInfo('Notes loaded.');
            if(notes.length==0){
                $('#listItem').text('No Notes in the Office')
            }
            else {
                let ul=$('<ul>');
                for (let note of notes){
                    appendMyNoteRow(note,ul);
                    $('#listItem').append(ul)
                }

            }

        }

    }
    function appendMyNoteRow(note, ul) {
        let links=[];
        let deleteLink=$('<a href="#">[Delete]</a>').click(function () {
            loadNoteForDelete(note)
        });
        let editLink=$('<a href="#">[Edit]</a>').click(function () {
            loadNoteForEdit(note)
        });
        links=[editLink,' ',deleteLink];
        ul.append($('<li>').append(
            $('<h2>').text(note.title),
            $('<p>').text(note.text),
            $('<div>').text(note.author),
            $('<div>').text(note.deadline),
            $('<div>').append(links)
    ));
    }
    function showCreateNoteView() {
        showView('createNote')
    }

    function createNewNote() {
        let noteData={
            title: $('#formCreateNote input[name=title]').val(),
            text:$('#formCreateNote input[name=text]').val(),
            deadline:$('#formCreateNote input[name=deadline]').val(),
            author:sessionStorage.getItem('fullName')
        };
        console.dir(noteData);
        $.ajax({
            method:"POST",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+"/notes",
            headers:getKinveyUserAuthHeaders(),
            data:noteData,
            success:createNoteSuccess,
            error:handleAjaxError
        });
        function createNoteSuccess(response) {
            listMyNotes();
            showInfo('Note created.');
        }
    }

    function loadNoteForEdit(note) {
        $.ajax({
            method:'GET',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/notes/" + note._id,
            headers:getKinveyUserAuthHeaders(),
            success:loadNoteForEditSuccess,
            error:handleAjaxError
        });
        function loadNoteForEditSuccess(note) {
            $('#editEditNote input[name=id]').val(note._id);
            $('#editEditNote input[name=title]').val(note.title);
            $('#editEditNote input[name=text]').val(note.text);
            $('#editEditNote input[name=deadline]').val(note.deadline);
            showView('editNote')

        }
    }

    function editNote() {
        let noteData={
            title: $('#editEditNote input[name=title]').val(),
            text:$('#editEditNote input[name=text]').val(),
            deadline:$('#editEditNote input[name=deadline]').val(),
            author:sessionStorage.getItem('fullName')
        };
        $.ajax({
            method:'PUT',
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+"/notes/"+$('#editEditNote input[name=id]').val(),
            headers:getKinveyUserAuthHeaders(),
            data:noteData,
            success:editedNoteSuccess,
            error:handleAjaxError
        });
        function editedNoteSuccess(response) {
            listMyNotes();
            showInfo('Note Edited')
        }
    }

    function loadNoteForDelete(note) {
        $.ajax({
            method:'GET',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/notes/" + note._id,
            headers:getKinveyUserAuthHeaders(),
            success:loadNoteForDeleteSuccess,
            error:handleAjaxError
        });
        function loadNoteForDeleteSuccess(note) {
            $('#formDeleteNote input[name=id]').val(note._id);
            $('#formDeleteNote input[name=title]').val(note.title);
            $('#formDeleteNote input[name=text]').val(note.text);
            $('#formDeleteNote input[name=deadline]').val(note.deadline);
            showView('deleteNoteView')
        }
    }
    function deleteNote() {
        $.ajax({
            method:"DELETE",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+"/notes/"+$('#formDeleteNote input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            success: deleteNoteSuccess,
            error: handleAjaxError
        });
        function deleteNoteSuccess(response) {
            listMyNotes();
            showInfo('Note deleted.')
        }

    }

    function cancelDeleteNote() {
        listMyNotes();
    }


}