//Authorization Part
const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_BkDMLmLfx";
const kinveyAppSecret =
    "87956afb59f9436583d7f251922b3459";
const kinveyAppAuthHeaders = {
    'Authorization': "Basic " +
    btoa(kinveyAppKey + ":" + kinveyAppSecret),
};

function registerUser(event) {
    event.preventDefault();
    let pass=$('#formRegister input[name=passwd]').val();
    let passConfirm=$('#formRegister input[name=confirmpass]').val();

    let userData={
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=passwd]').val()
    };
    if(pass===passConfirm){
        $.ajax({
            method:'POST',
            url:kinveyBaseUrl +'user/'+kinveyAppKey,
            headers:kinveyAppAuthHeaders,
            data:userData,
            success:registerSuccess,
            error:handleAjaxError
        });
    }
    else {
        let errorMsg='Your username or password is now correct';
        showError(errorMsg)
    }

    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listBooks();
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
    $('#loggedInUser').text(
        "Welcome, " + username + "!");
}


function loginUser() {
    let userData={
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=passwd]').val()
    };

    $.ajax({
        method:'POST',
        url:kinveyBaseUrl +'user/'+kinveyAppKey+'/login',
        headers:kinveyAppAuthHeaders,
        data:userData,
        success:loginSuccess,
        error:handleAjaxError
    });

    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listBooks();
        showInfo('Login successful.')
    }
}

function logoutUser() {
    $.ajax({
        method:'POST',
        url:kinveyBaseUrl +'user/'+kinveyAppKey+'/_logout',
        headers:getKinveyUserAuthHeaders(),
        success:logoutSeccess,
        error:handleAjaxError
    });
    function logoutSeccess(data) {
        sessionStorage.clear();
        $('#loggedInUser').text("");
        showHideMenuLinks();
        showView('viewHome');
        showInfo('Logout successful.');
    }
}

function getKinveyUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken'),
    };
}

