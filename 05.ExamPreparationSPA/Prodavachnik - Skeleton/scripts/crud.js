/**
 * Created by Kondoff on 28-Nov-16.
 */
function listAdverts() {
    $('#ads').empty();
    showView('viewAds');
    $.ajax({
        method:'GET',
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/OLX",
        headers: getKinveyUserAuthHeaders(),
        success: loadAdvertsSuccess,
        error: handleAjaxError
    })
}

function loadAdvertsSuccess(adverts) {
    showInfo('Adverts loaded.');
    if (adverts.length == 0) {
        $('#ads').text('No books in the library.');
    } else {
        let advertTable=$('<table>')
            .append($('<tr>')
                .append(`<th>Title</th>
                    <th>Publisher</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Date Published</th>
                    <th>Actions</th>`));
        for(advert of adverts){
            appendAdvertRow(advert, advertTable);
        }
        $('#ads').append(advertTable)
    }
}

function appendAdvertRow(advert, advertTable) {
    let readMoreLink=$('<a href="#">[Read More]</a>').click(function () {
        displayAdvert(advert)
    });
    let links=[readMoreLink];

    if(advert._acl.creator==sessionStorage['userId']){
        let deleteLink=$('<a href="#">[Delete]</a>').click(function () {
            deleteAdvert(advert)
        });
        let editLink=$('<a href="#">[Edit]</a>').click(function () {
            loadAdvertForEdit(advert)
        });
        links=[readMoreLink,' ',deleteLink,' ',editLink];
    }

    advertTable.append($('<tr>').append(
        $('<td>').text(advert.title),
        $('<td>').text(advert.publisher),
        $('<td>').text(advert.description),
        $('<td>').text(advert.price),
        $('<td>').text(advert.date),
        $('<td>').append(links)

    ))
}
function loadAdvertForEdit(advert) {
    $.ajax({
        method: "GET",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/OLX/" + advert._id,
        headers: getKinveyUserAuthHeaders(),
        success: loadBookForEditSuccess,
        error: handleAjaxError
    });

    function loadBookForEditSuccess(advert) {
        $('#formEditAd input[name=id]').val(advert._id);
        $('#formEditAd input[name=title]').val(advert.title);
        $('#formEditAd textarea[name=description]').val(advert.description);
        $('#formEditAd input[name=datePublished]').val(advert.date);
        $('#formEditAd input[name=price]').val(advert.price);
        $('#formEditAd input[name=image]').val(advert.image);
        showView('viewEditAd')
    }
}

function deleteAdvert(advert) {
    $.ajax({
        method:'DELETE',
        url:kinveyBookUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/OLX/" + advert._id,
        headers: getKinveyUserAuthHeaders(),
        success: deleteBookSuccess,
        error: handleAjaxError
    });
    function deleteBookSuccess(response) {
        listAdverts();
        showInfo('Advert deleted.')
    }
}

function createAdvert() {
    let advertData = {
        title: $('#formCreateAd input[name=title]').val(),
        description: $('#formCreateAd textarea[name=description]').val(),
        date: $('#formCreateAd input[name=datePublished]').val(),
        price: $('#formCreateAd input[name=price]').val(),
        publisher: sessionStorage.getItem('userName'),
        image: $('#formCreateAd input[name=image]').val(),
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/OLX",
        headers: getKinveyUserAuthHeaders(),
        data: advertData,
        success: createNewAdvertSuccess,
        error: handleAjaxError

    });
    function createNewAdvertSuccess(respons) {
        listAdverts();
        showInfo('Advert created.');
    }
}
function editAdvert() {
    let advertData = {
        title: $('#formEditAd input[name=title]').val(),
        description: $('#formEditAd textarea[name=description]').val(),
        date: $('#formEditAd input[name=datePublished]').val(),
        price: $('#formEditAd input[name=price]').val(),
        image: $('#formEditAd input[name=image]').val(),
        publisher: sessionStorage.getItem('userName')
    };
    $.ajax({
        method: "PUT",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey +
        "/OLX/" + $('#formEditAd input[name=id]').val(),
        headers: getKinveyUserAuthHeaders(),
        data: advertData,
        success: editAdvertSuccess,
        error: handleAjaxError
    });

    function editAdvertSuccess(response) {
        listAdverts();
        showInfo('Adverts edited.');
    }
}

function displayAdvert(advertIid) {
    $.ajax({
        method: "GET",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/OLX/" + advertIid._id,
        headers: getKinveyUserAuthHeaders(),
        success: displayAdvertSuccess,
        error: handleAjaxError
    });

    $('#viewDetailsAd').empty();

    function displayAdvertSuccess(advert) {

        let advertInfo=$('<di>');
        advertInfo.append(
            $('<img height="300" width="300">').attr('src',advert.image),
            $('<br>'),
            $('<label>').text('Price:'),
            $('<h1>').text(advert.price),
            $('<label>').text('Title:'),
            $('<h1>').text(advert.title),
            $('<label>').text('Description:'),
            $('<p>').text(advert.description),
            $('<label>').text('Publisher:'),
            $('<div>').text(advert.publisher),
            $('<label>').text('Date:'),
            $('<div>').text(advert.date)
        );
        advertInfo.appendTo($('#viewDetailsAd'));
        showView('viewDetailsAd')
    }
}