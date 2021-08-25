import axios from 'axios';
import { BackendApi_URL } from '../components/utils/AppConst';
import LocalStorageService from './LocalStorageService';

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
      id: item._id,
      name: item.item_name,
      category: item.category,
      maxQty: item.countInStock,
      qty: 1,
      image: item.item_image,
      price: item.price,
      product: item.item_name,
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
      if(item.id !== id){
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
    // console.log(itemsArr);
    
    //check with item id
    itemsArr.forEach(item => {
      if(item.id === id)
      {
        var max = item.maxQty;
        if(max > qty){
          item.qty = qty;
        }
        else{
          item.qty = max - 1;
        }
      }
      itemsArrNew.push(item);
    })
    
    //set new items to local
    var resAdd = LocalStorageService.setItem(this.LOCAL_KEY, itemsArrNew);
    // console.log(resAdd);

    return itemsArrNew;

  }
  
  // Get item from DC
  // async getItemFromDB(id){
  //   var itemRes = await axios.get(BackendApi_URL+"/products/"+id);
  //   var itemData = itemRes.data.product;

  //   return itemData;
  // }


}

export default new OrderServices();