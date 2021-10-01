const OrderReport_Template = (data) => {
    const today = new Date();

    // console.log(data)
  
    var orders_arr = data;
    
    // ${orders_arr.map(ordersTemplate).join("")}

    function ordersTemplate(order) {
      return `
        <tr>
           <td>
                <div>User Data</div>
                <div>${order.user.fname}</div>
                <div>${order.user.lname}</div>
                <div>${order.user.email}</div>
                <div>Order Items</div>
                <div>${order.orderItems.map(itemsTemplate).join("")}</div>
                <hr>
           </td>
           <td>
           <div>Delivery Details</div>
           <div>${order.deliveryDetails.paymentMethod}</div>
           <div>${order.deliveryDetails.addressLine1}</div>
           <div>${order.deliveryDetails.addressLine2}</div>
           <div>${order.deliveryDetails.contactNumber}</div>
           <div>${order.deliveryDetails.city}</div>
           <div><b>Total Amount: Rs.${order.deliveryDetails.totalAmount}</b></div>
           </td>
        </tr>
     `;
    }

    function itemsTemplate(item) {
      return `
        <div>
           <div>${item.name}</div>
           <div>${item.price} X ${item.qty} = ${item.price * item.qty}</div>
           <hr>
        </div>
     `;
    }
  
    return `
       <!doctype html>
       <html>
          <head>
             <meta charset="utf-8">
             <title>PDF Order Bill</title>
             <style>
                .invoice-box {
                 max-width: 800px;
                 margin: auto;
                 padding: 30px;
                 border: 1px solid #eee;
                 box-shadow: 0 0 10px rgba(0, 0, 0, .15);
                 font-size: 20px;
                 line-height: 24px;
                 color: #555;
                 font-family: Arial, Helvetica, sans-serif;
                }
                .margin-top {
                 margin-top: 50px;
                }
                .justify-center {
                 text-align: center;
                }
                .invoice-box table {
                 width: 100%;
                 line-height: inherit;
                 text-align: left;
                }
                .invoice-box table td {
                 padding: 5px;
                 vertical-align: top;
                }
                .invoice-box table tr td:nth-child(2) {
                 text-align: right;
                }
                .invoice-box table tr.top table td {
                 padding-bottom: 20px;
                }
                .invoice-box table tr.top table td.title {
                 font-size: 45px;
                 line-height: 45px;
                 color: #333;
                }
                .invoice-box table tr.information table td {
                 padding-bottom: 40px;
                }
                .invoice-box table tr.heading td {
                 background: #eee;
                 border-bottom: 1px solid #ddd;
                 font-weight: bold;
                }
                .invoice-box table tr.details td {
                 padding-bottom: 20px;
                }
                .invoice-box table tr.item td {
                 border-bottom: 1px solid #eee;
                }
                .invoice-box table tr.item.last td {
                 border-bottom: none;
                }
                .invoice-box table tr.total td:nth-child(2) {
                 border-top: 2px solid #eee;
                 font-weight: bold;
                }
                @media only screen and (max-width: 600px) {
                    .invoice-box table tr.top table td {
                       width: 100%;
                       display: block;
                       text-align: center;
                    }
                    .invoice-box table tr.information table td {
                       width: 100%;
                       display: block;
                       text-align: center;
                    }
                 }
  
             </style>
          </head>
          <body>
             <div class="invoice-box">
                
              <h1 class="justify-center">PCHub Order Report</h1>
  
                <table cellpadding="0" cellspacing="0">
                   <tr class="top">
                      <td colspan="2">
                         <table>
                            <tr>
                               <td class="title">
                               <img  src="https://www.michigan.gov/images/msi/How_To_Order_Icon_666058_7.png"
                                  style="width:100%; max-width:156px;"></td>
                               <td>
                                  Date: ${`${today.getDate()}. ${
                                    today.getMonth() + 1
                                  }. ${today.getFullYear()}.`}
                               </td>
                            </tr>
                         </table>
                      </td>
                   </tr>
  
                   <tr class="information">
                       <td>
                       </td>
                    </tr>   
                   
                    <tr class="information">
                       <td></td>
                    </tr>
                    <tr class="information">
                       <td></td>
                    </tr>
  
                    <tr class="heading">
                      <td>Order Details</td>
                      <td></td>
                    </tr>

                    ${orders_arr.map(ordersTemplate).join("")}
                    
                </table>
                <br />
                
  
                <hr />
  
             </div>
          </body>
       </html>
       `;
  };
  
  export default OrderReport_Template;
  