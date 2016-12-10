/**
 * Created by Kondoff on 03-Dec-16.
 */
function attachEvents() {
    const kinveyAppId = "kid_ryxkcd1Mx";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
    const kinveyUsername = "peter";
    const kinveyPassword = "p";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = { "Authorization": "Basic " + base64auth };

    $('#btnLoadPosts').click(loadPosts);
    $('#btnViewPost').click(viewPost);

    function loadPosts() {
        $.ajax({
            method:'GET',
            url:serviceUrl+'/Posts',
            headers:authHeaders,
            success:displayPosts,
            error:displayError
        })
    }

    function displayPosts(posts) {
        $("#posts").empty();
        console.dir(posts);
        for(post of posts){
            let option=$('<option>')
                .text(post.title)
                .val(post._id);
            $('#posts').append(option)
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

    function viewPost() {
        let selectedPostId = $("#posts").val();
        if (!selectedPostId) return;
        console.dir(selectedPostId);
        let requestPost=$.ajax({
            method:'GET',
            url:serviceUrl+'/Posts/'+selectedPostId,
            headers:authHeaders
        });
        let requestComment=$.ajax({
            method:'GET',
            url:serviceUrl+`/comments/?query={"post_id":"${selectedPostId}"}`,
            headers:authHeaders
        });

        Promise.all([requestPost,requestComment])
            .then(displayPostsAndComments)
            .catch(displayError)
    }



    function displayPostsAndComments([posts,comments]) {
        console.dir(comments);
        $('#post-title').text(posts.title);
        $('#post-body').text(posts.body);
        $("#post-comments").empty();
        for(let comment of comments){
            let li=$('<li>');
            li.text(comment.title);
            $("#post-comments").append(li);
        }
    }

}