/**
 * Created by Kondoff on 11-Dec-16.
 */
function startApp() {
    sessionStorage.clear(); // Clear user auth data
    showHideMenuLinks();
    showView('viewAppHome');

    // Bind the navigation menu links
    $("#linkMenuAppHome").click(showHomeView);
    $('#linkMenuLogin').click(showLoginView);
    $('#linkMenuRegister').click(showRegisterView);

    $('#linkMenuUserHome').click(showHomeUserMenu);
    $('#linkMenuMyMessages').click(listMyMessages);
    $('#linkMenuArchiveSent').click(listArchive);
    $('#linkMenuSendMessage').click(showSendMessageMenu);
    $('#linkMenuLogout').click(logoutUser);
    $('#linkUserHomeMyMessages').click(listMyMessages);
    $('#linkUserHomeSendMessage').click(showSendMessageMenu);
    $('#linkUserHomeArchiveSent').click(listArchive);

    // Bind the form submit buttons
    $('#formRegister').submit(registerUser);
    $('#formLogin').submit(loginUser);
    $('#formSendMessage').submit(sendMessage);

    $('#infoBox, #errorBox,#loadingBox').hide();



    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });





}