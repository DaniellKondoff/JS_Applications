class WomanModel{
    constructor(baseURL,appKey,requester,authorizationService){
        this.baseURL=baseURL;
        this.appKey=appKey;
        this.requester=requester;
        this.authorizationService=authorizationService;
    }

    getWomen(){
        let requestURL=this.baseURL+ 'appdata/' + this.appKey +'/women';

        return this.requester.get(requestURL,this.authorizationService.getHeaders());
    }
    postWoman(data){
        let requestURL=this.baseURL+ 'appdata/' + this.appKey +'/women';

        return this.requester
            .post(requestURL,this.authorizationService.getHeaders(),data)
    }
}