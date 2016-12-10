class WomenController{
    constructor(model,view){
        this.model=model;
        this.view=view
    }

    getWomen(){
        let _self=this;
        this.model.getWomen()
            .then(function (successData) {
                _self.view.listWomen(successData)
            })
            .catch(function (errorData) {
                console.log(errorData);
            })
    }

    postWoman(data) {
        this.model.postWoman(data)
            .then(function (successData) {
                console.log('Success!');
            })
            .catch(function (errorData) {
                console.log(errorData);
            })
    }

}