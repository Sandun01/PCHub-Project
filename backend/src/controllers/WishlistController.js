import Wishlist from '../models/WishlistModel.js';
import Product from '../models/ProductModel.js';


const createWishlist = async (req, res) => {
    if (req.body) {
        const wishlist = new Wishlist(req.body)
        await wishlist.save()
            .then(data => {
                res.status(200).send({ Wishlist: data })
            })
            .catch(error => {
                res.status(500).send({ error: error.message })
            })
    } else {
        res.status(200).send({ 'message': "No Data Found" })
    }
}

const getWishlistByUserId = async (req, res) => {

    if (req.params && req.params.id) {
        await Wishlist.find({ userID: req.params.id }).populate('product' )
            .then(data => {
                res.status(200).send({ data: data })
            })
            .catch((error) => {
                res.status(500).send({ error: error.messege })
            })
    }
    else {
        res.status(200).send({ 'message': "Id not found" })
    }
}

const checkIfAlreadyInWishlist = async (req, res) => {

    if (req.body) {
        await Wishlist.find({ userID: req.body._id }).populate('product' )
            .then(data => {
                data.forEach(data => {
                    if(data.Product._id == req.body.itemID){

                    }
                });
                
                res.status(200).send(data)
            })
            .catch((error) => {
                res.status(500).send({ error: error.messege })
            })
    }
    else {
        res.status(200).send({ 'message': "Id not found" })
    }
}


const deleteWishlistItem = async(req, res) => {

    if(req.params && req.params.id){
        
        await Wishlist.deleteOne( {"_id":req.params.id} )
        .then( result => {
            res.status(200).send({ success: true, 'message': "Wishlist item removed Successfully!" })
        })
        .catch( (error) => {
            res.status(500).send({ success: false, 'message': error })
        } )
    }else{
        res.status(200).send({ success: false, 'message': "No Id Found" })
    }
}


export default {
    createWishlist,
    getWishlistByUserId,
    deleteWishlistItem

}