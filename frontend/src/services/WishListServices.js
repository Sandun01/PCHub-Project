import axios from 'axios';
import { BackendApi_URL } from '../components/utils/AppConst';

class WishListServices {

    async addToWishList(wishlist) {

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
    

    async getAllwishlistitems(userID) {
        var result =null;

        await axios.get(BackendApi_URL + "/wishlists/" + userID)
            .then(res => {
                result =res;
                console.log("success")
            }).catch(error => {
                console.log(error.errorMessage);
            })
            return result;
    }
    
}

export default new WishListServices();