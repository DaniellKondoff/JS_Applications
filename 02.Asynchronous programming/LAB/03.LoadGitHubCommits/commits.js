/**
 * Created by Kondoff on 20-Nov-16.
 */
function loadCommits() {
    $("#commits").empty();
    let url = "https://api.github.com/repos/" +
        $("#username").val() + "/" +
        $("#repo").val() + "/commits";

    $.get(url)
        .then(displayResult)
        .catch(displayError);

    function displayError(err) {
        $("#commits").append($("<li>").text("Error: " +
            err.status + ' (' + err.statusText + ')'));
    }

    function displayResult(commits) {
        for(commit of commits){
            $('#commits').append($('<li>').text(commit.commit.author.name +': ' + commit.commit.message));
        }
    }
}