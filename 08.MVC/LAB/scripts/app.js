sessionStorage.setItem('authToken',btoa('guest:guest'));

function run() {

    let router=Sammy(function () {
        const baseURL='https://baas.kinvey.com/';
        const appKey='kid_SJ-0Qg0fx';
        const appSecret='dbf0c91c5f1c49f78c5846cd52858fb3';

        let requester=new Requester();

        let authorizationService = new AuthorizationService(appKey,appSecret);

        let womanView= new WomanView();
        let womanModel=new WomanModel(baseURL,appKey,requester,authorizationService);
        let womanController=new WomenController(womanModel,womanView);



        this.get('#/women',function () {
            womanController.getWomen();
        });
        this.get('#/home',function () {
            console.log('You are home')
        });

        this.bind('getHome',function (ev,data) {
            console.log('You got home, ' + data)

        })
    });

    router.run('#/');

    // womanController.postWoman({
    //     'name':'Desi',
    //     'age':35,
    //     'weight':135,
    //     'mantalitet':'kifla'
    // })
    // womanController.postWoman({
    //     'name':'Desi',
    //     'age':35,
    //     'weight':135,
    //     'mantalitet':'kifla'
    // })
}