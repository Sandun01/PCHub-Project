const finalReportTemplate = (data) => {
    const today = new Date();
  

    var items = data.items;
  
    //   console.log(items)
  
    function itemsTemplate(item) {
      return `
        <tr>
           <td>${item.item_name}</td>
           <td>${item.category}</td>
           <td>${item.price}</td>
           <td>${item.countInStock}</td>
        </tr>
     `;
    }
  
    return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF All Products Report</title>
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
              background: rgb(255, 255, 255);
              border-bottom: 1px solid #ddd;
              font-weight: bold;
             }
             .invoice-box table tr.heading th {
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
             
           <h1 class="justify-center">PCHub 2021</h1>
           <h4 class="justify-center">All Products</h4>

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
                    <td></td>
                 </tr>
                 <tr class="information">
                    <td></td>
                 </tr>

                 <tr class="heading">
                   <th>Item Name</th>
                   <th>Category</th>
                   <th>Unit Price</th>
                   <th>Stock qty</th>
                 </tr>


                ${items.map(itemsTemplate).join("")}
                 
             </table>
             <br />
             
             

             <hr />

             <p style=" margin-top: 30px; ">
              <b>Note:</b>
              Please note that, when you are doing a full check up on all products in the store, this report values should align with the actual available quantities in the store. if not please report to the administration.
             </P>

          </div>
       </body>
    </html>
       `;
  };
  
  export default finalReportTemplate;
  