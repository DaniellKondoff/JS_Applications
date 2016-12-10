/**
 * Created by Kondoff on 21-Nov-16.
 */
(function () {
    let appId = "kid_BJXTsSi-e";
    let appSecret = "447b8e7046f048039d95610c1b039390";
    let token = "Basic " + btoa('guest:guest');

    let baseURL = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock';
    let requestURL = baseURL + "?query=Knock Knock.";
    console.log('Knock Knock.');
    $.ajax({
        method: 'GET',
        url: requestURL,
        headers: {
            'Authorization': token,
            'Content-Type': "application/json"
        },
        success: function (success) {
            console.log(success.answer);
            console.log(success.message);
            let requestURL = baseURL + "?query="+success.message;
            $.ajax({
                method:"GET",
                url: requestURL,
                headers: {
                    'Authorization': token,
                    'Content-Type': "application/json"
                },
                success:function (success2) {
                    console.log(success2.answer);
                    console.log(success2.message);
                    let requestURL = baseURL + "?query="+success2.message;
                    $.ajax({
                        method:"GET",
                        url: requestURL,
                        headers: {
                            'Authorization': token,
                            'Content-Type': "application/json"
                        },
                        success:function (success3) {
                            console.log(success3.answer);
                            //console.log(success3.message)
                        },
                        error:function (error3) {
                            console.log(error3)
                        }
                    })

                },
                error:function (error2) {
                    console.log(error2)
                }
            })
        },
        error: function (error) {
            console.log(error)
        }
    });

})();
