/**
 * Created by Kondoff on 11-Dec-16.
 */

function showHideMenuLinks() {
    if(sessionStorage.getItem('authToken')){
        $('#linkMenuAppHome').hide();
        $('#linkMenuLogin').hide();
        $('#linkMenuRegister').hide();
        $('#linkMenuUserHome').show();
        $('#linkMenuMyMessages').show();
        $('#linkMenuArchiveSent').show();
        $('#linkMenuSendMessage').show();
        $('#linkMenuLogout').show();
        $('#spanMenuLoggedInUser').show()
    }
    else {
        $('#linkMenuAppHome').show();
        $('#linkMenuLogin').show();
        $('#linkMenuRegister').show();
        $('#linkMenuUserHome').hide();
        $('#linkMenuMyMessages').hide();
        $('#linkMenuArchiveSent').hide();
        $('#linkMenuSendMessage').hide();
        $('#linkMenuLogout').hide();
        $('#spanMenuLoggedInUser').hide()
    }

}

function showView(viewName) {
    // Hide all views and show selected only
    $('main>section').hide();
    $('#'+viewName).show();
}

function showHomeView() {
    showView('viewAppHome');
}
function showHomeUserMenu() {
    showView('viewUserHome');

}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}





