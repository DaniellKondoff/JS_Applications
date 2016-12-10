/**
 * Created by Kondoff on 09-Dec-16.
 */
function listCalendar() {
    $('#listItem').empty();
    showView('listCalendar')

    $.ajax({
        method:'GET',
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+"/lectures",
        headers:getKinveyUserAuthHeaders(),
        success:loadLecturesSuccess,
        error:handleAjaxError
    });

    function loadLecturesSuccess(lectures) {
        showInfo('Calendar loaded.');
        if(lectures.length==0){
            $('#listCalendar').text('No lectures in the Calendar')
        }
        else {
            let ul=$('<ul>');
            for (let lecture of lectures){
                appendLectureRow(lecture,ul);
                $('#listItem').append(ul)
            }
        }
    }
}
function appendLectureRow(lecture, ul) {
    let links=[];
    let readMore=$('<a href="#">[ReadMore]</a>').click(function () {
        loadForReadMore(lecture)
    });
    links.push(readMore);
    ul.append($('<li>').append(
        $('<h2>').text(lecture.start + ' ' +lecture.title ),
        $('<div>').append(links)
    ));
}

function loadForReadMore(lectureID) {
    $('#formDetailsLecture').empty();
    $.ajax({
        method: "GET",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/lectures/" + lectureID._id,
        headers: getKinveyUserAuthHeaders(),
        success: displayLectureSuccess,
        error: handleAjaxError
    });


    function displayLectureSuccess(lecture) {
        let lectureInfo=$('<div>');
        let cancelButton=$('<input/>').attr({
            type:"button",
            id:"buttonCancelReadMore",
            value:"Cancel"
        });
        lectureInfo.append(
            $('<h2>').text(lecture.title),
            $('<p>').html(`<b>Starts on</b> ${lecture.start}`),
            $('<p>').html(`<b>ENDS on</b> ${lecture.end}`),
            $('<h2>').text(`Lecturer: ${lecture.lecturer}`),
            $(cancelButton)
    );
        lectureInfo.appendTo($('#formDetailsLecture'));
        showView('viewDetailsLecture');
        $('#buttonCancelReadMore').click(function () {
            cancelReadMore(lecture)
        })

    }
}

//Create
function createLecture() {
    let lectureData={
        title:$('#formCreateLecture input[name=title]').val(),
        start:$('#formCreateLecture input[name=start]').val(),
        end:$('#formCreateLecture input[name=end]').val(),
        lecturer:sessionStorage.getItem('userName'),
    };
    $.ajax({
        method:"POST",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+"/lectures",
        headers:getKinveyUserAuthHeaders(),
        data:lectureData,
        success:createLectureSuccess,
        error:handleAjaxError
    });

    function createLectureSuccess(response) {
        listCalendar();
        showInfo('Book created.');
    }
}


// List Mt Own Lectures
function listMyLecture() {
    $('#listMyItem').empty();
    showView('listMyCalendar');
    let name = sessionStorage.getItem('userName');

    $.ajax({
        method:'GET',
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/lectures?query="+ `{"lecturer":"${name}"}`,
        headers:getKinveyUserAuthHeaders(),
        success:loadMyLecturesSuccess,
        error:handleAjaxError
    });

    function loadMyLecturesSuccess(lectures) {
        showInfo('Calendar loaded.');
        if(lectures.length==0){
            $('#listMyCalendar').text('No lectures in the Calendar')
        }
        else {
            let ul=$('<ul>');
            for (let lecture of lectures){
                appendMyLectureRow(lecture,ul);
                $('#listMyItem').append(ul)
            }
        }
    }

}
function appendMyLectureRow(lecture, ul) {
    let links=[];
    let readMore=$('<a href="#">[ReadMore]</a>').click(function () {
        loadForMyReadMore(lecture)
    });
    links.push(readMore);
    ul.append($('<li>').append(
        $('<h2>').text(lecture.start + ' ' +lecture.title ),
        $('<div>').append(links)
    ));
}

function loadForMyReadMore(lectureID) {
    $('#formDetailsLecture').empty();
    $.ajax({
        method: "GET",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/lectures/" + lectureID._id,
        headers: getKinveyUserAuthHeaders(),
        success: displayMyLectureSuccess,
        error: handleAjaxError
    });

    function displayMyLectureSuccess(lecture) {
        let lectureInfo=$('<div>');
        let cancelButton=$('<input/>').attr({
            type:"button",
            id:"buttonCancelReadMore",
            value:"Cancel"
        });
        let editButton=$('<input/>').attr({
            type:"button",
            id:"buttonLoadForEdit",
            value:"Edit"
        });
        let deleteButton=$('<input/>').attr({
            type:"button",
            id:"buttonLoadForDelete",
            value:"Delete"
        });
        lectureInfo.append(
            $('<h2>').text(lecture.title),
            $('<p>').html(`<b>Starts on</b> ${lecture.start}`),
            $('<p>').html(`<b>ENDS on</b> ${lecture.end}`),
            $('<h2>').text(`Lecturer: ${lecture.lecturer}`),
            $(cancelButton),
            $(editButton),
            $(deleteButton)
        );
        lectureInfo.appendTo($('#formDetailsLecture'));
        showView('viewDetailsLecture');
        $('#buttonCancelReadMore').click(function () {
            cancelMyReadMore(lecture)
        });
        $('#buttonLoadForEdit').click(function () {
            loadMyLectureForEdit(lecture)
        });
        $('#buttonLoadForDelete').click(function () {
            loadMyLectureForDelete(lecture)
        })

    }
}

function loadMyLectureForEdit(lecture) {
    $.ajax({
        method:'GET',
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/lectures/" + lecture._id,
        headers:getKinveyUserAuthHeaders(),
        success:loadMyLectureForEditSuccess,
        error:handleAjaxError
    });
    function loadMyLectureForEditSuccess(lecture) {
        $('#formEditLecture input[name=id]').val(lecture._id);
        $('#formEditLecture input[name=title]').val(lecture.title);
        $('#formEditLecture input[name=start]').val(lecture.start);
        $('#formEditLecture input[name=end]').val(lecture.end);
    }
    showView('editLecture');
}
function editLecture(lecture) {
    let lectureData={
        title:$('#formEditLecture input[name=title]').val(),
        start:$('#formEditLecture input[name=start]').val(),
        end:$('#formEditLecture input[name=end]').val(),
        lecturer:sessionStorage.getItem('userName')
    };
    $.ajax({
        method:'PUT',
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/lectures/"+$('#formEditLecture input[name=id]').val(),
        headers:getKinveyUserAuthHeaders(),
        data:lectureData,
        success:editLectureSuccess,
        error:handleAjaxError
    });

    function editLectureSuccess(response) {
        listMyLecture();
        showInfo('Lecture Edited.')
    }
}
function loadMyLectureForDelete(lecture) {
    $.ajax({
        method:'GET',
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/lectures/" + lecture._id,
        headers:getKinveyUserAuthHeaders(),
        success:loadMyLectureForDeleteSuccess,
        error:handleAjaxError
    });
    function loadMyLectureForDeleteSuccess(lecture) {
        $('#formDeleteNote input[name=id]').val(lecture._id);
        $('#formDeleteNote input[name=title]').val(lecture.title);
        $('#formDeleteNote input[name=start]').val(lecture.start);
        $('#formDeleteNote input[name=end]').val(lecture.end);
    }
    showView('deleteLectureView');
}

function deleteLecture() {
    $.ajax({
        method:'PUT',
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/lectures/"+$('#formDeleteNote input[name=id]').val(),
        headers:getKinveyUserAuthHeaders(),
        success:deleteLectureSuccess,
        error:handleAjaxError
    });

    function deleteLectureSuccess(response) {
        listMyLecture();
        showInfo('Lecture deleted.')

    }
}