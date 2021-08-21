import Wishlist from '../models/WishlistModel.js';

    const createWishlist = async (req, res) => {
        if (req.body) {
            const wishlist = new Wishlist(req.body)
            await wishlist.save()
                .then(data => {
                    res.status(200).send({ Wishlist : data })
                })
                .catch(error => {
                    res.status(500).send({ error: error.message })
                })
            }else{
                res.status(200).send({ 'message': "No Data Found" })
            }
        }

    const getWishlistByUserId = async(req, res) => {

        if(req.params && req.params.id){
            await Wishlist.find({userID: req.params.id}).populate('products')
                .then( data => {
                    res.status(200).send({ data : data })
                })
                .catch( (error) => {
                    res.status(500).send({ error: error.messege })
                } )
            }
            else{
                res.status(200).send({ 'message': "Id not found" })
            }
        }




    export default{
        createWishlist,
        getWishlistByUserId
    }