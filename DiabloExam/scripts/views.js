/**
 * Created by Kondoff on 10-Dec-16.
 */
function showHideMenuLinks() {
    $("#linkHome").show();
    if(sessionStorage.getItem('authToken')){
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListHeroes").show();
        $("#linkListMyHeroes").show();
        $("#linkLogout").show()
    }
    else {
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListHeroes").hide();
        $("#linkListMyHeroes").hide();
        $("#linkLogout").hide();
    }
}

function showView(viewName) {
    // Hide all views and show selected only
    $('main>section').hide();
    $('#'+viewName).show();
}

function showHomeView() {
    if(sessionStorage.getItem('authToken')){
        showView('viewUserHome')
    }
    else {
        showView('viewGuestHome');
    }
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}
function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}

function showAddHeroView() {
    showView('addHero')
}