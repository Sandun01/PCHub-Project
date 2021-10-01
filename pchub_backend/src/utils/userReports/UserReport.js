const UserReport = (data) => {
  const today = new Date();

  var allData = data.users;

  console.log(allData);

  function userTemplate(user) {
    return `
        <tr>
           <td>${user.fname}</td>
           <td>${user.lname}</td>
           <td>${user.email}</td>
           <td>${user.isAdmin}</td>
        </tr>
     `;
  }

  return `
       <!doctype html>
       <html>
          <head>
             <meta charset="utf-8">
             <title>PDF User Details</title>
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
                 text-align: left;
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
                
              <h1 class="justify-center">PCHub User Details</h1>
  
              <div style="display:flex;justify-content:space-between">
                              <div>
                                 <img  src="https://cdn-icons-png.flaticon.com/512/634/634013.png"
                                    style="width:100%; max-width:156px;">
                              </div>   
                           
                              
                           </div>
                <table cellpadding="0" cellspacing="0">
                   <tr class="top">
                      <td colspan="2">
                      </td>
                   </tr>
                   <tr>
                     <th>First Name</th>
                     <th>Last Name</th>
                     <th>Email</th>
                     <th>isAdmin</th>
                  </tr>
                   
  
                   ${allData.map(userTemplate).join('')}
                    
                </table>
                <br />
                
  
               
  
             </div>

             <div>
                                 Date: ${`${today.getDate()}. ${
                                   today.getMonth() + 1
                                 }. ${today.getFullYear()}.`}
                              </div>
          </body>
       </html>
       `;
};

export default UserReport;
