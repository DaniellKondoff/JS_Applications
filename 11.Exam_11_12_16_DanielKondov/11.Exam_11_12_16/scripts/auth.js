/**
 * Created by Kondoff on 11-Dec-16.
 */
const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_r1SGTd9mx";
const kinveyAppSecret = "74cb69e8699c4a7999bf5b53fc41c945";
const kinveyAppAuthHeaders = {
    'Authorization': "Basic " +
    btoa(kinveyAppKey + ":" + kinveyAppSecret),
};

function registerUser(event) {
    event.preventDefault();

    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=password]').val(),
        name: $('#formRegister input[name=name]').val()

    };

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: registerUserSuccess,
        error: handleAjaxError
    });

    function registerUserSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showHomeUserMenu();
        showInfo('User registration successful.');
    }


}

function loginUser(event) {
    event.preventDefault();

    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=password]').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: loginUserSuccess,
        error: handleAjaxError
    });

    function loginUserSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showHomeUserMenu();
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
    let username = userInfo.name;
    sessionStorage.setItem('userName', username);
    let name=userInfo.username;
    sessionStorage.setItem('name', name);
    $('#spanMenuLoggedInUser').text(
        "Welcome, " + username + "!");
    $('#viewUserHomeHeading').text("Welcome, " + username + "!");

}

