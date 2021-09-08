const finalBillTemplate = (data) => {
  const today = new Date();

  var allData = data;

  var name = allData.userName;

  var orderID = allData.OrderID;
  var order = allData.order;
  var total = order.totalAmount;

  var items = allData.items;

  //   console.log(items)

  function itemsTemplate(item) {
    return `
      <tr>
         <td>${item.name}</td>
         <td>${item.price} X ${item.qty} = ${item.price * item.qty}</td>
      </tr>
   `;
  }

  function orderDetailsTemplate(order) {
    return `
      <div>Payment Method: ${order.paymentMethod}</div>
      <div>Address Line 1: ${order.addressLine1}</div>
      <div>Address Line 2: ${order.addressLine2}</div>
      <div>City: ${order.city}</div>
      <div>Zip Code: ${order.zipCode}</div>
      <div>Contact Number: ${order.contactNumber}</div>
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
              
            <h1 class="justify-center">PCHub Order Invoice</h1>

              <table cellpadding="0" cellspacing="0">
                 <tr class="top">
                    <td colspan="2">
                       <table>
                          <tr>
                             <td class="title">
                             <img  src="https://cdn-icons-png.flaticon.com/512/972/972601.png"
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
                        Customer name: ${name}
                     </td>
                  </tr> 
                 <tr class="information">
                    <td>
                     <b>Receipt number: ${orderID}</b>
                     </td>
                  </tr>   
                 
                  <tr class="information">
                     <td></td>
                  </tr>
                  <tr class="information">
                     <td></td>
                  </tr>

                  <tr class="heading">
                    <td>Bought items:</td>
                    <td>Price</td>
                  </tr>

                 ${items.map(itemsTemplate).join("")}
                  
              </table>
              <br />
              
              <h3 class="justify-center">Total price: Rs.${total}</h3>

              <hr />

              <h3>Delivery Details</h3>
              ${orderDetailsTemplate(order)}

              <hr />

              <p style=" margin-top: 30px; ">
               <b>Note:</b>
               Please note that there can be a delay of up-to 7 working days or slightly more due to delivery difficulties prevailing in these days.
              </P>

           </div>
        </body>
     </html>
     `;
};

export default finalBillTemplate;
