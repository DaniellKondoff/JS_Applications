/**
 * Created by Kondoff on 04-Dec-16.
 */
function attachEvents() {
    const appId='kid_BJ_Ke8hZg';
    const baseUrl = `https://baas.kinvey.com/rpc/${appId}`;
    const getURL = `https://baas.kinvey.com/appdata/${appId}/venues/`;
    const username = 'guest';
    const password = 'pass';

    let authHeaders={
        "Authorization":"Basic "+btoa(`${username}:${password}`),
        "Content-Type":'application/json'
    };

    let venueDate=$('#venueDate');
    let date='25-11';

    $.ajax({
        method:'POST',
        url:baseUrl+`/custom/calendar?query=${date}`,
        headers:authHeaders
    })
        .then(loadData);

    function loadData(data) {
        let requests=[];
        for(let id of data){
            let request = $.ajax({
                method:'GET',
                url:getURL+`${id}`,
                headers:authHeaders
            });
            requests.push(request);
                Promise.all(requests)
                .then(renderResult);

            function renderResult(venues) {
                $('#venue-info .venue').remove();
                for (let venue of venues) {
                    templateVenue(venue).appendTo($('#venue-info'));
                }
            }

        }
    }

    function templateVenue(venue) {
        let btnMore =
            $(`<span class="venue-name">
                    <input class="info" type="button" value="More info">
                    ${venue.name}
                </span>`).click(function () {
                $(this).siblings('div .venue-details').toggle();
            });

        let btnPurchase =
            $(`<td>
                    <input class="purchase" type="button" value="Purchase">
                </td>`).click(function () {
                confirmPurchaseView(venue._id);
            });

        let html = $(`<div class="venue" id="${venue._id}">
                        <div class="venue-details" style="display: none;">
                          <table>
                            <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
                            <tr>
                              <td class="venue-price">${venue.price} lv</td>
                              <td><select class="quantity">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>                                
                              </select></td>
                            </tr>
                          </table>
                          <span class="head">Venue description:</span>
                          <p class="description">${venue.description}</p>
                          <p class="description">Starting time: ${venue.startingHour}</p>
                        </div>
                    </div>`)
            .prepend(btnMore);

        $(html).find('.venue-price').parent()
            .append(btnPurchase);

        return html;

    }
    function confirmPurchaseView(id) {
        let html = templateConfirm(id);
        $('#venue-info').empty();
        $(html).appendTo('#venue-info');
    }

    function templateConfirm(id) {
        let name = $(`#${id} .venue-name`).text().trim();
        let price = Number.parseFloat(
            $(`#${id} .venue-price`)
                .text().replace(/[a-zA-Z]/g, '')
        );

        let quantity = Number.parseFloat(
            $(`#${id} .quantity`).find(":selected").val()
        );


        let html = $(`<span class="head">Confirm purchase</span>
                        <div class="purchase-info">
                          <span>${name}</span>
                          <span>${quantity} x ${price.toFixed(2)}</span>
                          <span>Total: ${(quantity * price).toFixed(2)} lv</span>
                          <input type="button" value="Confirm">
                        </div>`);

        $(html).find(`input[type="button"]`)
            .click(() => transactionCompleteView(id, quantity));

        return html;
    }

    function transactionCompleteView(id, quantity) {
        $.post({
            url: hostInfo.custom + `/purchase?venue=${id}&qty=${quantity}`,
            headers: hostInfo.headers
        })
            .then(response => $("#venue-info").html(response.html))
            .catch(displayError);
    }
    function displayError(error) {
        console.log(error);
    }



}