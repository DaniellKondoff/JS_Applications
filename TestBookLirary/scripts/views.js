/**
 * Created by Kondoff on 07-Dec-16.
 */
function showHideMenuLinks() {
    $('#linkHome').show();
    if(sessionStorage.getItem('authToken')){
        //We have logged in user
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListBooks").show();
        $("#linkCreateBook").show();
        $("#linkLogout").show();
    }
    else {
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListBooks").hide();
        $("#linkCreateBook").hide();
        $("#linkLogout").hide();
    }
}

function showView(viewName) {
    //Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}


function showCreateBookView() {
    $('#books').empty();
    showView('viewCreateBook');
    $('#formCreateBook').trigger('reset');
}