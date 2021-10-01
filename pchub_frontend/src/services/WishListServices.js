import axios from 'axios';
import { BackendApi_URL } from '../components/utils/AppConst';

class WishListServices {

    async addToWishList(wishlist) {

        //get all from wishlist
        // await await axios.get(BackendApi_URL + "/wishlists/" + wishlist.userID)
        //     .then(res => {
        //         console.log("check", res.data);
        //         return res
        //     })
        /**
         * TO DO
         * Stop From adding the same to wishlist
         */
        //.foreach( ()=> { if()});

        //send to database
        await axios.post(BackendApi_URL + "/wishlists/create", wishlist)
            .then(res => {
                console.log("success")
            }).catch(error => {
                console.log(error.errorMessage);
            })
    }
    async deleteItemFromWishList(wishlistItemID) {

        await axios.delete(BackendApi_URL + "/wishlists/delete/" + wishlistItemID)
            .then(res => {
                console.log("success")
            }).catch(error => {
                console.log(error.errorMessage);
            })
    }

    
}

export default new WishListServices();