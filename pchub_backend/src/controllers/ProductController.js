import Product from "../models/ProductModel.js"

const createProduct = async (req, res) => {
    if (req.body) {
        const product = new Product(req.body)
        await product.save()
            .then(data => {
                res.status(200).send({ Productraz : data })
            })
            .catch(error => {
                res.status(500).send({ error: error.message })
            })
        }else{
            res.status(200).send({ 'message': "No Data Found" })
        }
    }

    export default{
        createProduct
    }
