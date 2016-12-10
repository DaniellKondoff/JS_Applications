function listMyHeroes() {
    $('#hero-detailed').empty();
    showView('listMyHeroes')

    let name = sessionStorage.getItem('userName');

    $.ajax({
        method:'GET',
        url:kinveyBaseUrl + "appdata/" + kinveyAppKey + "/heroes?query="+ `{"creator":"${name}"}`,
        headers:getKinveyUserAuthHeaders(),
        success:listMyHeroesSuccess,
        error:handleAjaxError
    });

    function listMyHeroesSuccess(heroes) {
        console.dir(heroes);
        showInfo('Heroes loaded.');
        if(heroes.length==0){
            $('#hero-detailed').text('You have No Heroes')
        }
        else {
            let div=$('#hero-detailed');
            for(let hero of heroes){
                appendMyHeroesRow(hero,div);
                $('#hero-detailed').append(div)
            }
        }
    }
    function appendMyHeroesRow(hero,div) {
        let divInside=$('<div>');
        div.append(divInside.append(
            $('<h2>').text(hero.name)
        ))
    }
}

function creteHero() {

}
