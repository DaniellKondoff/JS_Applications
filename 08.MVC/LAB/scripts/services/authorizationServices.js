class AuthorizationService{
    constructor(appKey,appSecret){
        this.appKey=appKey;
        this.appSecret=appSecret;
    }
        isLoggedIn(){
            return sessionStorage.getItem('authToken');
        }

        getHeaders(){
            let headers={
                'Content-Type': 'application/json'
            };
            if(this.isLoggedIn()){
                headers['Authorization']='Basic ' + this.isLoggedIn()
            }
            else {
                headers['Authorization']='Basic ' + btoa(this.appKey + ':' + this.appSecret)
            }

            return headers
        }
}