import axios from 'axios';

 class AuthService{

    validateJWTToken = () => {
        // console.log('Validate JWT');
        var result = this.loginWithJWTToken();

        if(result){
            return result;
        }
        else{
            return null;
        }

    }

    loginWithJWTToken = () => {

        var user_Data = this.getUserData();
        var user = null;
        
        // console.log("user_Data",user_Data);

        //user logged in and validate token
        if(user_Data){
            user = user_Data.userData;
            var token = user.token;

            var data = {
                "token": token
            };

            // console.log("user////",user);

            axios.post('/api/users/profile/auth',data)
            .then(res => {
                // console.log(res);
                // token expired
                if(res.data.message == "Expired"){
                    this.userLogout();
                    return null;
                }
                else{ 
                    //token not expired set data agin to prevent local storage changes
                    user = res.data.data;
                    var token = res.data.token;
                    this.setUserDataToLocal(user, token);
                    // console.log("user",res);
                }
            })
            .catch(error => {
                console.log('Error',error);
                this.userLogout();
            })
        }
        else{
            //user not logged in
            this.userLogout();
            return null;
        }

        return user;
    }
    
    //set local data to local storage
    setUserDataToLocal = (data, token) => {

        var uData = {
            "id": data._id,
            "name": data.name,
            "email": data.email,
            "contact_no": data.contact_no,
            "user_type": data.user_type,
            "isAdmin": data.isAdmin,
            "token": data.token
        }

        localStorage.setItem('user_info', JSON.stringify(uData));
        localStorage.setItem('token', token);
        return true;
    }

    //get user data from local storage
    getUserData = () => {
        var userToken = localStorage.getItem('token');
        var u_data = localStorage.getItem('user_info');

        if(userToken && u_data){
            var userData = JSON.parse(u_data);
            return {userToken, userData};
        }
        else{
            return null;
        }
    }

    //remove user data from local storage - logout
    userLogout = () => {
        localStorage.removeItem('user_info');
        localStorage.removeItem('token');
    }

}

export default new AuthService();