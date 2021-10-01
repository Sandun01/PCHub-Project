import Product from "../models/ProductModel.js";
import UtilFunctions from "../utils/UtilFunctions.js";
import pdf from 'html-pdf';
import finalReportTemplate from '../utils/productReports/allProductsReports.js';
import path from 'path';

// @desc  Create Product
// @route POST /api/products/
// @access Admin 

const createProduct = async(req, res) => {

    if(req.body){
        const product = new Product(req.body)
        
        await product.save()
        .then( data => {
            res.status(201).send({ success: true, 'message': "product Created Successfully!"})
        })
        .catch( (error) => {
            res.status(500).send({ success: false, 'message': error })
        } )

    }else{
        res.status(200).send({ success: false, 'message': "No Data Found" })
    }
}

// @desc  Get All Products
// @route GET /api/products/
// @access Admin

const getAllProducts = async (req, res) => {
  await Product.find({})
    .then((data) => {
      res.status(200).send({ success: true, products: data });
    })
    .catch((error) => {
      res.status(500).send({ success: false, message: error });
    });
};

// @desc  Get Product by product ID
// @route GET /api/products/:id
// @access Admin

const getProductByID = async (req, res) => {
  if (req.params && req.params.id) {
    await Product.findById(req.params.id)
      .then((data) => {
        res.status(200).send({ success: true, product: data });
      })
      .catch((error) => {
        res.status(400).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: "Id Not Found" });
  }
};

// @desc  Update Product
// @route PUT /api/products/:id
// @access Admin

const updateProductDetails = async (req, res) => {
  if (req.body && req.params) {
    const query = { _id: req.params.id };
    const update = {
      item_name: req.body.item_name,
      item_description: req.body.item_description,
      item_image: req.body.item_image,
      rating: req.body.rating,
      price: req.body.price,
      countInStock: req.body.countInStock,
    };

    await Product.updateOne(query, update)
      .then((result) => {
        res
          .status(200)
          .send({ success: true, message: "Product Updated Successfully!" });
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: "No Data Found" });
  }
};

// @desc  Delete Product
// @route Delete /api/products/:id
// @access Admin

const deleteProductDetails = async (req, res) => {
  if (req.params && req.params.id) {
    await Product.deleteOne({ _id: req.params.id })
      .then((result) => {
        res
          .status(200)
          .send({ success: true, message: "Product Deleted Successfully!" });
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: "No Id Found" });
  }
};

// @desc  Get latest 3 products
// @route GET /api/products/latest
// @access User
// Home page - Sandun.

const getLatestProducts = async (req, res) => {
  await Product.find()
    .sort({ $natural: -1 })
    .limit(3)
    .then((data) => {
      res.status(200).send({ success: true, products: data });
    })
    .catch((error) => {
      res.status(400).send({ success: false, message: error });
    });
};

// @desc  Get latest 3 products
// @route POST /api/products/filterProducts
// @access User
// Home page - Sandun.

const filterProducts = async (req, res) => {
  const data = req.body;
  const pageNumber = data.pagination.pageNumber;
  const nPerPage = data.pagination.noPerPage;

  const category = data.filterData.category;

  const filterQuery = {
    category: category,
  };

  const totalCount = await Product.find(filterQuery).countDocuments(); // find(filterQuery).count();

  if (totalCount > 0) {
    await Product.find(filterQuery)
      .skip((pageNumber - 1) * nPerPage)
      .limit(nPerPage)
      .sort({ $natural: -1 })
      .then((data) => {
        res
          .status(200)
          .send({ success: true, totResults: totalCount, products: data });
      })
      .catch((error) => {
        res.status(400).send({ success: false, message: error });
      });
  } else {
    res
      .status(200)
      .send({ success: false, totResults: 0, message: "Not Found!" });
  }
};

// @desc  Search products
// @route GET /api/products/search
// @access User
// Home page - Sandun.

const searchProductByName = async (req, res) => {
  const data = req.body;
  const name = data.filterData.name;
  const s_name = name.toLowerCase();

  Product.collection.createIndex({ item_name: "text" });

  const search_query = {
    $text: {
      $search: s_name,
      $caseSensitive: false,
      $diacriticSensitive: true,
    },
  };

  await Product.find(search_query).then((search_res) => {
      // console.log(search_res);
      
      var s_res_empty = UtilFunctions.isEmpty(search_res);

      if (s_res_empty === false) {
        const totalCount = search_res.length;
        console.log(totalCount);
        res
          .status(200)
          .send({ success: true, totResults: totalCount, products: search_res });
      } else {
        res
          .status(200)
          .send({ success: false, totResults: 0, message: "Not Found!" });
      }
    })
    .catch((error) => {
      res.status(400).send({ success: false, message: error });
    });
};

//Generate final order bill
// @route post /api/orders/generateFinalBill
// @access User(Registered) 
const generateAllProductsReport = async(req, res) => {

  // console.log("generate Final Order Bill");
  
  const __dirname = path.resolve()
  
  const data = req.body;
  // console.log(data);
  
  //generate bill
  pdf.create(finalReportTemplate(data), {}).toFile(`${__dirname}/files/allProductsReport.pdf`, (err) => {
      if(err) {
          console.log(err)
          res.send(Promise.reject());
      }
      
      res.send(Promise.resolve());
  });
  
}

//get final order bill
// @route get /api/orders/fetchFinalBill
// @access User(Registered) 
const getAllProductsReport = async(req, res) => {

  console.log("get All Procuts report");

  const __dirname = path.resolve()

  res.sendFile(`${__dirname}/files/allProductsReport.pdf`)
}


export default{
    createProduct,
    getAllProducts,
    getProductByID,
    updateProductDetails,
    deleteProductDetails,
    getLatestProducts,
    filterProducts,
    searchProductByName,
    generateAllProductsReport,
    getAllProductsReport
}
