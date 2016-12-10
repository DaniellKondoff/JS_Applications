/**
 * Created by Kondoff on 28-Nov-16.
 */
function showHideMenuLinks() {
    $('#menu a').hide();
    if(sessionStorage.getItem('authToken')){
        $('#linkHome').show();
        // We have logged in user
        $("#linkListAds").show();
        $("#linkCreateAd").show();
        $("#linkLogout").show();
    }
    else {
        //We have NO logged user
        $('#linkHome').show();
        $("#linkLogin").show();
        $("#linkRegister").show();

    }
}

function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();
}

function showHomeView() {
    showView('viewHome')
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}

function showCreateAdvertView() {
    $('#viewCreateAd').trigger('reset');
    showView('viewCreateAd')
}
