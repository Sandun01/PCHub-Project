import axios from "axios";
import { BackendApi_URL } from "../components/utils/AppConst";
import { saveAs } from "file-saver";
import Utils from "../components/utils/Utils";

class ProductServices {
  async addNewProduct(data) {
    var result = null;
    result = await axios.post(BackendApi_URL + "/products", data);

    // console.log(result);
    return result;
  }

  async deleteProduct(id) {
    var result = null;
    result = await axios.delete(BackendApi_URL + "/products/" + id);
    return result;
  }

  async getAllProducts() {
    var result = null;
    result = await axios.get(BackendApi_URL + "/products");
    return result;
  }

  async getproductByID(id) {
    var result = null;

    await axios
      .get(BackendApi_URL + "/products/" + id)
      .then((res) => {
        result = res;
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(result);
    return result;
  }

  async updateProduct(id, data) {
    var result = null;

    result = await axios.put(BackendApi_URL + "/products/" + id, data);

    console.log("to tesdr", result);
    return result;
  }

  //Database/Backend -- generate pdf
  async generateAllproductsReport(data) {
    var result = 0;

    try {
      var genPdfResult = await axios.post(
        BackendApi_URL + "/products/generateallproductsReport",
        data
      );

      if (!Utils.isEmptyObject(genPdfResult)) {
        if (genPdfResult.status === 200) {
          //pdf generate report success

          
          //get report pdf
          var genPdfResult2 = await axios.get(BackendApi_URL+"/products/fetchallproductsReport", { responseType: 'blob' });
          console.log("=====================")

          if (!Utils.isEmptyObject(genPdfResult2)) {
            //get report pdf response success

            if (genPdfResult2.status === 200) {
              const pdfBlob = new Blob([genPdfResult2.data], {
                type: "application/pdf",
              });
              saveAs(pdfBlob, "allproducts.pdf");

              // console.log(genPdfResult2);
              result = 1;
            } else {
              //get bill pdf response not success
              result = 0;
            }
          } else {
            //get bill pdf response not success
            result = 0;
          }
        } else {
          //generate bill report response not success
          result = 0;
        }
      } else {
        //generate bill report response not success
        result = 0;
      }
    } catch (err) {
      console.log(err);
      result = 0;
    }

    return result;
  }
}

export default new ProductServices();
