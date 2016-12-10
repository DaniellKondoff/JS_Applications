class WomanView{
    constructor(){
    }

    listWomen(data){
        let womenList=$('<div class="women-list"></div>');
        data.forEach(function (woman) {
            let womenElement=$('<div class="women-element"></div>');
            womenElement.append(`<div>${woman.name}</div>`);
            womenElement.append(`<div>${woman.age}</div>`);
            womenElement.append(`<div>${woman.weight}</div>`);
            womenElement.append(`<div>${woman.mantalitet}</div>`);

            womenList.append(womenElement);
        });

        $('#wrapper').append(womenList)
        $('#wrapper').append('<button>Get Home</button>')

        Sammy(function () {
            let _self=this;
            $('.wrapper button').click(function () {
                _self.trigger('getHome')
            })
        })


    }

}