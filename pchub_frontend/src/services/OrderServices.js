import axios from 'axios';
import { BackendApi_URL } from '../components/utils/AppConst';
import LocalStorageService from './LocalStorageService';
import { saveAs } from 'file-saver';
import Utils from '../components/utils/Utils';

class OrderServices {

  LOCAL_KEY = "cartItems";

  //LOCAL -- check item already in the cart 
  checkCartItemExists_Local(item){

    var arr = LocalStorageService.getItem(this.LOCAL_KEY);
    var newProduct = item.product;
    var alreadyHaveItem = false;

    arr.forEach(element => {
      var product = element.product;
      
      if(newProduct === product){
          alreadyHaveItem = true;
      }

    });

    return alreadyHaveItem;

  }

  //LOCAL -- Count no of items in cart
  getNumberOfItemsInCart_Local(){
      var itemsArr = LocalStorageService.getItem(this.LOCAL_KEY);
      var len = 0;

      if(itemsArr != null){
        len = itemsArr.length;
      }
      // console.log(len);

      return len;
  }

  //LOCAL -- get all items in local cart array
  getAllItemsInCart_Local(){
    var itemsArr = LocalStorageService.getItem(this.LOCAL_KEY);
    return itemsArr;
  }

  //LOCAL -- Unregistered User Add Item to cart
  addItemToCart_Local(item){
    var data = item;
    var cartItemArr = []
    var cartItem = {
      product: item._id,
      name: item.item_name,
      category: item.category,
      maxQty: item.countInStock,
      qty: 1,
      image: item.item_image,
      price: item.price,
    }

    if(data){

      //check already added items
      var itemsArr = LocalStorageService.getItem(this.LOCAL_KEY);
      console.log("Local Items:",itemsArr);

      //add new array with item to local
      if(itemsArr === null){
        cartItemArr.push(cartItem);
        console.log("Arr:",cartItemArr)
        var resAdd = LocalStorageService.setItem(this.LOCAL_KEY, cartItemArr);

        if(resAdd){
          return true;
        }
        else{
          return false;
        }

      }
      else{ //add new item to existing local
        
        //check item already exists
        var itemExists = this.checkCartItemExists_Local(cartItem);
        
        if(itemExists === false){
          // console.log(Array.isArray(itemsArr));
          itemsArr.push(cartItem);
          
          //ADD ITEM TO LOCAL
          var resAddToArray = LocalStorageService.setItem(this.LOCAL_KEY, itemsArr);
          // console.log(resAddToArray);
  
          if(resAddToArray){
            return true;
          }
          else{
            return false;
          }
        }
        else{
          return 100; //Item already exists
        }

      }

    }
    else{
      return null;  //no data found
    }

  }

  //LOCAL -- Unregistered User remove Item from cart
  removeItemInCart_Local(id){
    
    var itemsArr = this.getAllItemsInCart_Local();
    var itemsArrNew = [];
    // console.log(itemsArr);
    
    //check with item id
    itemsArr.forEach(item => {
      if(item.product !== id){
        itemsArrNew.push(item);
      }
    })
    
    //set new items to local
    var resAdd = LocalStorageService.setItem(this.LOCAL_KEY, itemsArrNew);
    // console.log(resAdd);

  }

  //LOCAL -- Unregistered User change item quantity in cart
  changeItemQuantityInCart_Local(id, qty){
    
    var itemsArr = this.getAllItemsInCart_Local();
    var itemsArrNew = [];
    var maxQuantity = false;
    // console.log(itemsArr);
    
    //check with item id
    itemsArr.forEach(item => {
      if(item.product === id)
      {
        var max = item.maxQty;
        if(max >= qty){
          item.qty = qty;
        }
        else{
          item.qty = max;
          maxQuantity = true;
        }
      }
      itemsArrNew.push(item);
    })
    
    //set new items to local
    var resAdd = LocalStorageService.setItem(this.LOCAL_KEY, itemsArrNew);
    // console.log(resAdd);

    var data = {
      "max": maxQuantity,
      "itemsArr": itemsArrNew,
    }

    return data;

  }
  
  // Get item from DB
  // async getItemFromDB(id){
  //   var itemRes = await axios.get(BackendApi_URL+"/products/"+id);
  //   var itemData = itemRes.data.product;
  //   return itemData;
  // }

  //Database -- add item to cart
  async addItemToCart_DB(item, userID){

    var result = null;

    var cartItem ={
      "name": item.item_name,
      "category": item.category,
      "qty": 1,
      "image": item.item_image,
      "price": item.price,
      "product": item._id
    }
    
    // console.log("Item",cartItem);

    // add one item to db order
    await axios.put(BackendApi_URL+"/orders/addItem/user/"+userID, cartItem)
      .then(res => {
        // console.log("Item",res);
        result = res;
      })
      .catch(error =>{
        console.log(error);
      })
      
    return result;
  }

  //Database -- get order by user id - DB
  async getOrderByUserID(userID){

    var result = null;
    var data = {
      "active": true,
    }

    await axios.post(BackendApi_URL+"/orders/user/"+userID, data)
    .then(res => {
      result = res;
    })
    .catch(error =>{
      console.log(error);
    })

    console.log(result);
    return result;

  }

  //Database -- Remove order item by order and item id's - DB
  async removeOrderItemByID(ordId, itmId){

    var result = null;
    var data = {
      "orderItemId": itmId
    }
    // console.log("Item",ordId, data);

    await axios.put(BackendApi_URL+"/orders/removeItem/"+ordId, data)
    .then(res => {
      result = res;
    })
    .catch(error =>{
      console.log(error);
    })

    console.log(result);
    return result;

  }

  //Database -- edit order item quantity- DB
  async editOrderItemQty(ordId, data){

    var result = null;
    // {
    //   "orderItemDbID": "61230f8d577e6d3ff0a4a3f5",
    //   "itemID": "612149c38548774608573af1",
    //   "qty": 2
    // }
    // console.log("Item",ordId, data);

    await axios.put(BackendApi_URL+"/orders/qty/edit/"+ordId, data)
    .then(res => {
      result = res;
    })
    .catch(error =>{
      console.log(error);
    })

    // console.log(result);
    return result;

  }

  //Database -- add local items to db when login
  async addLocalItemsToDBLogin(uID, items){

    //remove cart items from local storage
    localStorage.removeItem(this.LOCAL_KEY);

    var result = null;
    var data = {
      "userID": uID,
      "orderItems": items
    }
    // console.log("Item",ordId, data);

    result = await axios.post(BackendApi_URL+"/orders/local/", data);

    return result;

  }

  //Database -- get order by id
  async getOrderByID(id){

    var result = null;

    await await axios.get(BackendApi_URL+"/orders/"+id)
    .then(res => {
      result = res;
    })
    .catch(error =>{
      console.log(error);
    })

    // console.log(result);
    return result;

  }

  //Database -- update payment details
  async updatePaymentDetails(id, data){

    var result = null;
    // console.log(data, id)
    result = await await axios.put(BackendApi_URL+"/orders/payment/"+id, data)

    // console.log(result);
    return result;

  }
  
  //Database -- checkout order
  async checkoutOrder(data, id){

    var result = null;
    // console.log(data, id)
    result = await await axios.post(BackendApi_URL+"/orders/checkout/"+id, data)

    // console.log(result);
    return result;

  }

  //Database -- change payment method
  async changePaymentMethod(id, data){

    var result = null;
    // console.log(data, id)
    result = await await axios.put(BackendApi_URL+"/orders/payment/method/"+id, data)

    // console.log(result);
    return result;

  }

  //Database -- delete Order by id
  async deleteOrderById(id){

    var result = null;
    // console.log(data, id)
    result = await await axios.delete(BackendApi_URL+"/orders/"+id)

    // console.log(result);
    return result;

  }

  //Database/Backend -- generate pdf
  async generateFinalOrderBill(data){

    // axios.post(BackendApi_URL+"/orders/generateFinalBill", data)
    // .then( () => axios.get(BackendApi_URL+"/orders/fetchFinalBill", { responseType: 'blob' })) 
    // .then((res) => {

    //     const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    //     saveAs(pdfBlob, 'newBill.pdf');

    //     // console.log(res);
    //     return res;
    //   })      .catch(err => {
    //     console.log(err);
    //     return err;
    // })

    var result = 0;

    try{
      var genPdfResult = await axios.post(BackendApi_URL+"/orders/generateFinalBill", data);

      if(!Utils.isEmptyObject(genPdfResult)){

        if(genPdfResult.status === 200){ //pdf generate bill success

          //get bill pdf
          var genPdfResult2 = await axios.get(BackendApi_URL+"/orders/fetchFinalBill", { responseType: 'blob' });

          if(!Utils.isEmptyObject(genPdfResult2)){ //get bill pdf response success

            if(genPdfResult2.status === 200){
              const pdfBlob = new Blob([genPdfResult2.data], { type: 'application/pdf' });
              saveAs(pdfBlob, 'newBill.pdf');
      
              // console.log(genPdfResult2);
              result = 1;

            }
            else{ //get bill pdf response not success
              result = 0;
            }

          }
          else{ //get bill pdf response not success
            result = 0;
          }
          
        }
        else{ //generate bill report response not success
          result = 0;
        }
        
      }
      else{ //generate bill report response not success
        result = 0;
      }

    }
    catch(err){
      console.log(err);
      result = 0;
    }
    
    return result;
  
  }


}

export default new OrderServices();