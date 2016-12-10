/**
 * Created by Kondoff on 20-Nov-16.
 */
$(document).ready(function () {
    const kinveyAppId = "kid_ryxkcd1Mx";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
    const kinveyUsername = "peter";
    const kinveyPassword = "p";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = { "Authorization": "Basic " + base64auth };


    $('#btnLoadPosts').click(loadPostClicked);
    $('#btnViewPost').click(viewPostClicked);

    function loadPostClicked() {
        let getPosts={
            method:'GET',
            url:serviceUrl+"/Posts",
            headers:authHeaders
        };
        $.ajax(getPosts)
            .then(displayPostsInDropDown)
            .catch(displayError)
    }

    function displayPostsInDropDown(posts) {
        for(let post of posts){
            let option=$('<option>');
            option.text(post.title);
            option.val(post._id);
            $('#posts').append(option);
        }
    }
    function displayError(err) {
        let errDiv = $("<div>").text("Error: " +
            err.status + ' (' + err.statusText + ')');
        $(document.body).prepend(errDiv);
        setTimeout(function () {
            errDiv.fadeOut(function () {
                errDiv.remove();
            });
        },2000)
    }
    
    
    function viewPostClicked() {
        let selectedPostId=$('#posts').val();

        let postRequest={
            method:'GET',
            url:serviceUrl+"/Posts/"+selectedPostId,
            headers:authHeaders
        };
        $.ajax(postRequest)
            .then(displayPostsInBody)
            .catch(displayError);

        let commentRequest={
            method:'GET',
            url:serviceUrl+`/comments/?query={"post_id":"${selectedPostId}"}`,
            headers:authHeaders
        };
        $.ajax(commentRequest)
            .then(displayCommentsInBody)
            .catch(displayError)
    }

    function displayPostsInBody(post) {
        $('#post-title').text(post.title);
        $('#post-body').text(post.body);
    }

    function displayCommentsInBody(comments) {
        $("#post-comments").empty()
        for(let comment of comments){
            let commentItem = $("<li>")
                .text(comment.title);
            $("#post-comments")
                .append(commentItem);

        }
    }
});