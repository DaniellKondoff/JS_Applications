/**
 * Created by Kondoff on 09-Dec-16.
 */
function startApp() {
    sessionStorage.clear(); // Clear user auth data
    showHideMenuLinks();
    showView('viewGuestHome');

    // Bind the navigation menu links
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListCalendar").click(listCalendar);
    $("#linkListMyLectures").click(listMyLecture);
    $("#linkLogout").click(logoutUser);

    $("#linkToLogin").click(showLoginView);
    $("#linkLoginToRegister").click(showRegisterView);
    $("#linkRegToLogin").click(showLoginView);
    $("#linkHomeToCalendar").click(listCalendar);
    $("#linkHomeToAddLect").click(showAddEventView);

    // Bind the form submit buttons
    $("#buttonLoginUser").click(loginUser);
    $("#buttonRegisterUser").click(registerUser);
    $('#buttonAddEvent').click(showAddEventView);
    $('#buttonCreateLecture').click(createLecture);
    $('#buttonCancelCreateLecture').click(cancelCreateLecture);
    $('#buttonAddMyEvent').click(showAddEventView);
    $('#buttonEditLecture').click(editLecture);
    $('#buttonCancelEditLecture').click(cancelEditLecture);
    $('#buttonDeleteLecture').click(deleteLecture);
    $('#buttonCancelDeleteLecture').click(cancelDeleteLecture);


    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });


}