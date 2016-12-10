/**
 * Created by Kondoff on 07-Dec-16.
 */
function startApp() {
    //sessionStorage.clear(); //clear user session

    showHideMenuLinks();
    showView('viewHome');

    // Bind the navigation menu links
    $('#linkHome').click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(listBooks);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logoutUser);


    // Bind the form submit buttons
    $("#buttonLoginUser").click(loginUser);
    $("#formRegister").submit(registerUser);

    $("#buttonCreateBook").click(createBook);
    $("#buttonEditBook").click(editBook);

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });


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



    //CRUD
    function listBooks() {
        $('#books').empty();
        showView('viewBooks');

        $.ajax({
            method:'GET',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
            headers: getKinveyUserAuthHeaders(),
            success: loadBooksSuccess,
            error: handleAjaxError
        });

        function loadBooksSuccess(books) {
            showInfo('Books loaded.');

            if (books.length == 0) {
                $('#books').text('No books in the library.');
            }
            else {
                let booksTable=$('<table>')
                    .append($('<tr>')
                        .append('<th>Title</th><th>Author</th>',
                            '<th>Desciption</th><th>Actions</th>'));

                for(let book of books) {
                    appendBookRow(book, booksTable);
                    $('#books').append(booksTable);
                }
            }
        }


        function appendBookRow(book, booksTable) {
            let links=[];
            if(book._acl.creator==sessionStorage['userId']){
                let deleteLink=$('<a href="#">[Delete]</a>')
                    .click(function () {
                        deleteBook(book)
                    });
                let editLink=$('<a href="#">[Edit]</a>')
                    .click(function () {
                        loadBookForEdit(book)
                    });
                links=[deleteLink,' ',editLink]
            }
            booksTable.append($('<tr>').append(
                $('<td>').text(book.title),
                $('<td>').text(book.author),
                $('<td>').text(book.description),
                $('<td>').append(links)
            ));

            //CommentsPart
            let commentsRow = $('<tr>').addClass('commentRow').attr('data-question', JSON.stringify(book));
            let commentsSection = $('<td colspan="4">');

            if (book.comments) {
                appendBookCommentsRow(commentsSection, book);
                commentsRow.append(commentsSection);
            }
            appendAddCommentRow(commentsSection, book);

            commentsRow.append(commentsSection);
            booksTable.append(commentsRow);

            function appendBookCommentsRow(bookCommentsRow, book) {

                for (let comment of book.comments) {
                    let text = comment.text;
                    let author = comment.author;
                    bookCommentsRow
                        .append(
                            $('<div>').addClass('bookCommentsText').html(text),
                            $('<div style="font-style: italic">').addClass('bookCommentsAuthor').html('&emsp;-- ' + author),
                            $('<br>')
                        );
                }
            }
            function getAddCommentsForm() {
                let commentForm = $('<form style="display: none">')
                    .addClass('formComment')
                    .on('submit', function (e) {
                        let bookData = JSON.parse($(this).closest('tr').attr('data-question'));
                        let commentText = $(this).find('.textComment').val();
                        let commentAuthor = $(this).find('.textCommentAuthor').val();

                        $(this).find('.textComment').val('');
                        $(this).find('.textCommentAuthor').val('');

                        e.preventDefault();

                        addBookComment(bookData, commentText, commentAuthor);

                        $(this).hide();
                        $(this).closest('tr').find('.hyperlinkAddComment').show()
                    })
                    .on('reset', function (e) {
                        $(this).hide();
                        $(this).closest('tr').find('.hyperlinkAddComment').show()
                    })
                    .append($('<span>Comment: </span>'))
                    .append($('<input type="text" required>').addClass('textComment'))
                    .append($('<span>Author: </span>'))
                    .append($('<input type="text" required>').addClass('textCommentAuthor'))
                    .append($('<input type="submit" value="Add comment">'))
                    .append($('<input type="reset" value="Cancel">'));
                return commentForm;
            }

            function appendAddCommentRow(commentsSection, book) {
                commentsSection.append(
                    (($('<div></div>')
                        .addClass('bookCommentsAuthor'))
                        .append($('<a href="#">Add Comment</a>')
                            .click(function () {
                                $(this).hide();
                                $(this).closest('tr').find('.formComment').show();
                            })
                            .addClass('hyperlinkAddComment'))));

                let commentForm = getAddCommentsForm();
                commentsSection.append(commentForm);
            }
            //END COmment Part

        }
    }
    //END CRUD

    function showCreateBookView() {
        $('#books').empty();
        showView('viewCreateBook');
        $('#formCreateBook').trigger('reset');
    }



    //Authorization Part
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_BkDMLmLfx";
    const kinveyAppSecret =
        "87956afb59f9436583d7f251922b3459";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    function registerUser(event) {
        event.preventDefault();
        let pass=$('#formRegister input[name=passwd]').val();
        let passConfirm=$('#formRegister input[name=confirmpass]').val();

        let userData={
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };
        if(pass===passConfirm){
            $.ajax({
                method:'POST',
                url:kinveyBaseUrl +'user/'+kinveyAppKey,
                headers:kinveyAppAuthHeaders,
                data:userData,
                success:registerSuccess,
                error:handleAjaxError
            });
        }
        else {
            let errorMsg='Your username or password is now correct';
            showError(errorMsg)
        }

        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('User registration successful.')
        }
    }

    function saveAuthInSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('userName', username);
        $('#loggedInUser').text(
            "Welcome, " + username + "!");
    }


    function loginUser() {
        let userData={
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };

        $.ajax({
            method:'POST',
            url:kinveyBaseUrl +'user/'+kinveyAppKey+'/login',
            headers:kinveyAppAuthHeaders,
            data:userData,
            success:loginSuccess,
            error:handleAjaxError
        });

        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('Login successful.')
        }
    }

    function logoutUser() {
        $.ajax({
            method:'POST',
            url:kinveyBaseUrl +'user/'+kinveyAppKey+'/_logout',
            headers:getKinveyUserAuthHeaders(),
            success:logoutSeccess,
            error:handleAjaxError
        });
        function logoutSeccess(data) {
            sessionStorage.clear();
            $('#loggedInUser').text("");
            showHideMenuLinks();
            showView('viewHome');
            showInfo('Logout successful.');
        }
    }

    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " +
            sessionStorage.getItem('authToken'),
        };
    }
    //End Authorization


    //CRUD
    function createBook() {
        let bookData = {
            title: $('#formCreateBook input[name=title]').val(),
            author: $('#formCreateBook input[name=author]').val(),
            description: $('#formCreateBook textarea[name=descr]').val()
        };

        $.ajax({
            method:'POST',
            url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: createBookSuccess,
            error: handleAjaxError
        });

        function createBookSuccess(response) {
            listBooks();
            showInfo('Book created.');
        }

    }

    function deleteBook(book) {
        $.ajax({
            method:'DELETE',
            url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/"+book._id,
            headers:getKinveyUserAuthHeaders(),
            success:deleteBookSuccess,
            error:handleAjaxError
        });

        function deleteBookSuccess(response) {
            listBooks();
            showInfo('Book has been deleted.');
        }
    }

    function loadBookForEdit(book) {
        $.ajax({
            method:'GET',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + book._id,
            headers:getKinveyUserAuthHeaders(),
            success:loadBookForEditSyccess,
            error:handleAjaxError
        });
        function loadBookForEditSyccess(book) {
            $('#formEditBook input[name=id]').val(book._id);
            $('#formEditBook input[name=title]').val(book.title);
            $('#formEditBook input[name=author]').val(book.author);
            $('#formEditBook textarea[name=descr]').val(book.description);
            showView('viewEditBook');
        }
    }

    function editBook() {
        let bookData={
            title: $('#formEditBook input[name=title]').val(),
            author: $('#formEditBook input[name=author]').val(),
            description: $('#formEditBook textarea[name=descr]').val()
        };
        $.ajax({
            method:'PUT',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + $('#formEditBook input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: editBookSuccess,
            error: handleAjaxError
        });

        function editBookSuccess(response) {
            listBooks();
            showInfo('Book has been edited.')
        }
    }

    function addBookComment(bookData, commentText, commentAuthor) {

        if (!bookData.comments) {
            bookData.comments = [];

        }
        bookData.comments.push({text: commentText, author: commentAuthor});

        $.ajax({
            method:'PUT',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + bookData._id,
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: addBookCommentSuccess,
            error: handleAjaxError
        });

        function addBookCommentSuccess() {
            listBooks();
            showInfo('Book comment added.');
        }

    }
    //CRUD
    function createBook() {
        let bookData = {
            title: $('#formCreateBook input[name=title]').val(),
            author: $('#formCreateBook input[name=author]').val(),
            description: $('#formCreateBook textarea[name=descr]').val()
        };

        $.ajax({
            method:'POST',
            url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: createBookSuccess,
            error: handleAjaxError
        });

        function createBookSuccess(response) {
            listBooks();
            showInfo('Book created.');
        }

    }

    function deleteBook(book) {
        $.ajax({
            method:'DELETE',
            url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/"+book._id,
            headers:getKinveyUserAuthHeaders(),
            success:deleteBookSuccess,
            error:handleAjaxError
        });

        function deleteBookSuccess(response) {
            listBooks();
            showInfo('Book has been deleted.');
        }
    }

    function loadBookForEdit(book) {
        $.ajax({
            method:'GET',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + book._id,
            headers:getKinveyUserAuthHeaders(),
            success:loadBookForEditSyccess,
            error:handleAjaxError
        });
        function loadBookForEditSyccess(book) {
            $('#formEditBook input[name=id]').val(book._id);
            $('#formEditBook input[name=title]').val(book.title);
            $('#formEditBook input[name=author]').val(book.author);
            $('#formEditBook textarea[name=descr]').val(book.description);
            showView('viewEditBook');
        }
    }

    function editBook() {
        let bookData={
            title: $('#formEditBook input[name=title]').val(),
            author: $('#formEditBook input[name=author]').val(),
            description: $('#formEditBook textarea[name=descr]').val()
        };
        $.ajax({
            method:'PUT',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + $('#formEditBook input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: editBookSuccess,
            error: handleAjaxError
        });

        function editBookSuccess(response) {
            listBooks();
            showInfo('Book has been edited.')
        }
    }

}