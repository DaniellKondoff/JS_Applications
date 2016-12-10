/**
 * Created by Kondoff on 21-Nov-16.
 */
function attachEvents() {
    let getWeatherURL="https://judgetests.firebaseio.com/locations.json";
    let currentWeatherURL="https://judgetests.firebaseio.com/forecast/today/";
    let upcomingWeatherURL="https://judgetests.firebaseio.com/forecast/upcoming/";

    const weatherContainer = $('#forecast');
    const todayWeather = $('#current');
    const upcomingWeather = $('#upcoming');

    $('#submit').click(getLocationCode);

    function getLocationCode() {
        let locationName=$('#location').val();
        if(locationName!==''){
            $.ajax({
                method:'GET',
                url:getWeatherURL
            })
                .then(function (data) {
                    let locationCode=data.filter(e=>e.name===locationName)[0].code;
                    if(locationCode){
                        getLocationReport(locationCode)
                    }
                })
                .catch(displayError)
        }
    }

    function getLocationReport(code) {

        let currentWeatherRequest=$.ajax({
            method:'GET',
            url:currentWeatherURL+`${code}.json`
        });

        let upcomingWeatherRequest=$.ajax({
            method:'GET',
            url:upcomingWeatherURL+`${code}.json`
        });

        Promise.all([currentWeatherRequest,upcomingWeatherRequest])
            .then(processConditions)
            .catch(displayError)
    }

    function processConditions([today,treeDays]) {
        weatherContainer.show();
        displayCurrentWeather(today);
        displayUpcomingWeather(treeDays);
    }

    function displayCurrentWeather(data) {
        $('#current').find('.label').nextAll().remove();
        todayWeather
        .append($('<span>')
            .addClass('condition symbol')
            .html(getWeatherIcon(data.forecast.condition)))
            .append($('<span>')
                .addClass('condition')
                .append($('<span>')
                    .addClass('forecast-data')
                    .text(data.name))
                .append($('<span>')
                    .addClass('forecast-data')
                    .html(`${data.forecast.low}&#176;/${data.forecast.high}&#176;`))
                .append($('<span>')
                    .addClass('forecast-data')
                    .text(data.forecast.condition)));
    }

    function getWeatherIcon(condition) {
        return {
            'Sunny': '&#x2600;',
            'Partly sunny': '&#x26C5;',
            'Overcast': '&#x2601;',
            'Rain': '&#x2614;'
        }[condition];
    }

    function displayUpcomingWeather(data) {
        upcomingWeather.find('.label').nextAll().remove();

        for(let condition of data.forecast){
            upcomingWeather
                .append($("<span>")
                    .addClass('upcoming')
                    .append($("<span>")
                        .addClass('symbol')
                        .html(getWeatherIcon(condition.condition)))
                    .append($('<span>')
                        .addClass('forecast-data')
                        .html(`${condition.low}&#176;/${condition.high}&#176;`))
                    .append($('<span>')
                        .addClass('forecast-data')
                        .text(condition.condition))
                );
        }
    }

    function displayError() {
        weatherContainer.show();
        weatherContainer.text('Error');
    }

}