/**
 * Created by Kondoff on 08-Dec-16.
 */
let appKey="kid_BJLZizor";
let appSecret="73b694590e614889b33faed34a9fdbc9";

let baseUrl="https://baas.kinvey.com/";

let guestCredentials=btoa("user:pass");

$('#upload-file-button').click(function () {
    let file=$('#uploaded-file')[0].files[0];

    let metadata={
        "_filename":file.name,
        "size":file.size,
        "mimeType":file.type
    };
    upload(metadata,file)
});

function upload(data,file) {
    let requestURL=baseUrl+'blob/'+appKey;
    let requestHeaders={
        'Authorization':`Basic `+guestCredentials,
        'Content-Type':'application/json',
        'X-Kinvey-Content-Type':data.mimeType
    };

    $.ajax({
        method:"POST",
        url:requestURL,
        headers:requestHeaders,
        data:JSON.stringify(data),
        success:successfulAction,
        error:displayError
    });

    function successfulAction(success) {
        let innerHeaders=success._requiredHeaders;
        innerHeaders['Content-Type']=file.type;


        let uploadURL=success._uploadURL;
        let element_Id=success._id;
        $.ajax({
            method:'PUT',
            url:uploadURL,
            headers:innerHeaders,
            processData:false,
            data:file,
            success:uploadData,
            error:displayError
        });
        function uploadData(data) {
            console.log('Successfully uploaded!')
            $('#elements').append(
                `<li id="`+ element_Id +`">`+
                    '  '+file.name+
                    `  <button id="download-button">Download</button>`+
                    `</li>`
            );

            $('#download-button').click(function () {
                let inner_id=$(this).parent().attr('id');
                download(inner_id);
            })
        }
    }
    function displayError(err) {
        console.log(err)
    }
}

function download(id) {
    let requestURL=baseUrl+'blob/'+appKey +'/'+id;
    let requestHeaders={
        'Authorization':`Basic `+guestCredentials,
        'Content-Type':'application/json'
    };

    $.ajax({
        method:'GET',
        url:requestURL,
        headers:requestHeaders,
        success:downloadSuccess,
        error:displayError
    });
    function displayError(err) {
        console.log(err)
    }
    function downloadSuccess(data) {
       let url=data._downloadURL;
       let link=document.createElement("a");
       link.download=url.substr(url.lastIndexOf('/')) ;
        link.href=url;
        link.click()
    }
    
}