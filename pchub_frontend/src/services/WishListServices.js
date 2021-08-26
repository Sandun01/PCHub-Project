import axios from 'axios';
import { BackendApi_URL } from '../components/utils/AppConst';

class WishListServices{

    addToWishList(wishlist){

        //send to database
        axios.post(BackendApi_URL+"/wishlists/create",wishlist)
        .then(res=>{
            console.log("success")
        }).catch(error=>{
            console.log(error.errorMessage);
        })
    }


}

export default new WishListServices();