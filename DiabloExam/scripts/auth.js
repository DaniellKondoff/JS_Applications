const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_SydAR3tXx";
const kinveyAppSecret = "58f51f9fff3d447dbe35625e79372cfd";
const kinveyAppAuthHeaders = {
    'Authorization': "Basic " +
    btoa(kinveyAppKey + ":" + kinveyAppSecret),
};

function registerUser() {

    let pass = $('#formRegister input[name=passwd]').val();
    let passConfirm = $('#formRegister input[name=passwd-confirm]').val();

    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=passwd]').val()
    };

    if (pass == passConfirm) {
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: registerSuccess,
            error: handleAjaxError
        });
    }
    else {
        let errorMsg='Your username or password is not correct';
        showError(errorMsg)
    }

    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showHomeView();
        showInfo('User registration successful.');

    }

}

function loginUser() {
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=passwd]').val()
    };

    $.ajax({
        method:'POST',
        url:kinveyBaseUrl+"user/"+kinveyAppKey+"/login",
        headers:kinveyAppAuthHeaders,
        data:userData,
        success:loginSuccess,
        error:handleAjaxError
    });
    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showHomeView();
        showInfo('Login successful.');
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
        showHomeView();
        showInfo('Logout successful.');
    }
}

function getKinveyUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken'),
    };
}
function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
    sessionStorage.setItem('userName', username);
    $('#loggedInUser').text(' '+username + "!");
}

