//List Books And Posts
function listBooks() {
    $('#books').empty();
    showView('viewBooks');

    $.ajax({
        method: 'GET',
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
            let booksTable = $('<table>')
                .append($('<tr>')
                    .append('<th>Title</th><th>Author</th>',
                        '<th>Desciption</th><th>Actions</th>'));

            for (let book of books) {
                appendBookRow(book, booksTable);
                $('#books').append(booksTable);
            }
        }
    }

    function appendBookRow(book, booksTable) {
        let readMoreLink=$('<a href="#">[Read More]</a>').click(function () {
            displayBookDetails(book)
        });
        let links = [readMoreLink];
        if (book._acl.creator == sessionStorage['userId']) {
            let deleteLink = $('<a href="#">[Delete]</a>')
                .click(function () {
                    deleteBook(book)
                });
            let editLink = $('<a href="#">[Edit]</a>')
                .click(function () {
                    loadBookForEdit(book)
                });
            links = [readMoreLink,' ',deleteLink, ' ', editLink]
        }
        booksTable.append($('<tr>').append(
            $('<td>').text(book.title),
            $('<td>').text(book.author),
            $('<td>').text(book.description),
            $('<td>').append(links)
        ));

        let commentsRow = $('<tr>').addClass('commentRow').attr('data-question', JSON.stringify(book));
        let commentsSection = $('<td colspan="4">');

        if (book.comments) {
            appendBookCommentsRow(commentsSection, book);
            commentsRow.append(commentsSection);
        }

        appendAddCommentRow(commentsSection, book); // AddComment Button A href

        commentsRow.append(commentsSection);
        booksTable.append(commentsRow);

    }

    //List current Comments
    function appendBookCommentsRow(bookCommentsRow, book) {
        for (let comment of book.comments) {
            let text = comment.text;
            let author = comment.author;
            bookCommentsRow
                .append(
                    $('<div>').addClass('bookCommentsText').html(text),
                    $('<div style="font-style: italic">').addClass('bookCommentsAuthor').text('  --' + author),
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

    // Add Comment to Comments - PUT
    function addBookComment(bookData, commentText, commentAuthor) {

        if (!bookData.comments) {
            bookData.comments = [];

        }
        bookData.comments.push({text: commentText, author: commentAuthor});

        $.ajax({
            method: 'PUT',
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
}


//Create Book
function createBook() {
    let bookData = {
        title: $('#formCreateBook input[name=title]').val(),
        author: $('#formCreateBook input[name=author]').val(),
        description: $('#formCreateBook textarea[name=descr]').val(),
        image: $('#formCreateBook input[name=image]').val()
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

//EDIT Book
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
         $('#formEditBook input[name=image]').val(book.image);
        showView('viewEditBook');
    }
}

function editBook() {
    let bookData={
        title: $('#formEditBook input[name=title]').val(),
        author: $('#formEditBook input[name=author]').val(),
        description: $('#formEditBook textarea[name=descr]').val(),
        image: $('#formEditBook input[name=image]').val()
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

//DELETE Book
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

//Ream More
function displayBookDetails(bookId) {
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + bookId._id,
        headers: getKinveyUserAuthHeaders(),
        success: displayBookDetailsSuccess,
        error: handleAjaxError
    });

    $('#viewDetailsBook').empty();

    function displayBookDetailsSuccess(book) {

        let bookInfo = $('<div>');
        bookInfo.append(
            $('<img height="300" width="300">').attr('src', book.image),
            $('<br>'),
            $('<label>').text('Title:'),
            $('<h1>').text(book.title),
            $('<label>').text('Description:'),
            $('<p>').text(book.description),
            $('<label>').text('Publisher:'),
            $('<div>').text(book.author)
        );
        bookInfo.appendTo($('#viewDetailsBook'));
        showView('viewDetailsBook')
    }
}



