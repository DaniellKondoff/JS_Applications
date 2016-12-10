/**
 * Created by Kondoff on 09-Dec-16.
 */
function showHideMenuLinks() {
    $("#linkHome").show();
    if(sessionStorage.getItem('authToken')){
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListCalendar").show();
        $("#linkListMyLectures").show();
        $("#linkLogout").show()
    }
    else {
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListCalendar").hide();
        $("#linkListMyLectures").hide();
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

function showAddEventView() {
    showView('addLecture')
}
function cancelReadMore(lecture) {
    showView('listCalendar')
}
function cancelCreateLecture() {
    showView('listCalendar')
}
function cancelMyReadMore() {
    showView('listMyCalendar')
}
function cancelEditLecture() {
    showView('viewDetailsLecture')
}
function cancelDeleteLecture() {
    showView('viewDetailsLecture')
}