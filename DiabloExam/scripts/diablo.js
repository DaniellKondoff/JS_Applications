/**
 * Created by Kondoff on 10-Dec-16.
 */
function startApp() {
    //sessionStorage.clear(); // Clear user auth data
    showHideMenuLinks();
    showView('viewGuestHome');

    // Bind the navigation menu links
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListHeroes").click(listHeroes);
    $('#linkListMyHeroes').click(listMyHeroes);
    $("#linkLogout").click(logoutUser);

    //Additional
    $('#linkHomeToLogin').click(showLoginView);
    $('#linkLoginToRegister').click(showRegisterView);
    $('#linkRegToLogin').click(showLoginView);
    $('#linkHomeToHeroList').click(listMyHeroes);
    $('#linkHomeToAddHero').click(showAddHeroView);

    // Bind the form submit buttons
    $("#buttonLoginUser").click(loginUser);
    $("#buttonRegisterUser").click(registerUser);
    $('#buttonCreateHero').click(creteHero)

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

}

function listHeroes() {
    showView('listHeroes')
}



