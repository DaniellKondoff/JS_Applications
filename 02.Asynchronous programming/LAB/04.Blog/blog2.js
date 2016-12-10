/**
 * Created by Kondoff on 21-Nov-16.
 */
$(document).ready(function () {
    const kinveyAppId = "kid_ryxkcd1Mx";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
    const kinveyUsername = "peter";
    const kinveyPassword = "p";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = { "Authorization": "Basic " + base64auth };

    $("#btnLoadPosts").click(loadPostsClick);
    $("#btnViewPost").click(viewPostClick);

    function loadPostsClick() {
        let loadPostRequest={
            method:'GET',
            url:serviceUrl+'/Posts',
            headers:authHeaders
        };

        $.ajax(loadPostRequest)
            .then(loadPostsInDrownMenu)
            .catch(displayError)
    }
    function loadPostsInDrownMenu(posts) {
        $("#posts").empty();
        for(let post of posts){
            let option=$('<option>');
            option.text(post.title);
            option.val(post._id);
            $('#posts').append(option);
        }
    }
    function displayError(err) {
        let errorDiv = $("<div>").text("Error: " +
            err.status + ' (' + err.statusText + ')');
        $(document.body).prepend(errorDiv);
        setTimeout(function() {
            $(errorDiv).fadeOut(function() {
                $(errorDiv).remove();
            });
        }, 3000);
    }

    function viewPostClick() {
        let selectedPostId=$('#posts').val();
        if (!selectedPostId) return;

        let postRequest=$.ajax({
            method:'GET',
            url:serviceUrl+'/Posts/'+selectedPostId,
            headers:authHeaders
        });

        let commentRequest=$.ajax({
            method:"GET",
            url:serviceUrl+`/comments/?query={"post_id":"${selectedPostId}"}`,
            headers:authHeaders
        });

        Promise.all([postRequest,commentRequest])
            .then(displayPostWithComments)
            .catch(displayError)
    }
    
    function displayPostWithComments([posts,comments]) {
        $('#post-title').text(posts.title);
        $('#post-body').text(posts.body);
        $("#post-comments").empty();

        for(let comment of comments){
            let li=$('<li>');
            li.text(comment.title)
            $("#post-comments").append(li)
        }
    }


});
