import axios from 'axios';
import { BackendApi_URL } from '../components/utils/AppConst';
import LocalStorageService from './LocalStorageService';
import { saveAs } from 'file-saver';
import Utils from '../components/utils/Utils';

class UserServices {
  async generateUserDetails(data) {
    var result = 0;

    try {
      var genPdfResult = await axios.post(
        BackendApi_URL + '/auth/generateUserData',
        data
      );
      console.log('----------------generateUserData called');

      if (!Utils.isEmptyObject(genPdfResult)) {
        if (genPdfResult.status === 200) {
          //pdf generate user success

          //get user pdf
          var genPdfResult2 = await axios.get(
            BackendApi_URL + '/auth/fetchUserData',
            { responseType: 'blob' }
          );

          if (!Utils.isEmptyObject(genPdfResult2)) {
            //get user pdf response success

            if (genPdfResult2.status === 200) {
              const pdfBlob = new Blob([genPdfResult2.data], {
                type: 'application/pdf',
              });
              saveAs(pdfBlob, 'newUser.pdf');

              // console.log(genPdfResult2);
              result = 1;
            } else {
              //get user pdf response not success
              result = 0;
            }
          } else {
            //get user pdf response not success
            result = 0;
          }
        } else {
          //generate user report response not success
          result = 0;
        }
      } else {
        //generate user report response not success
        result = 0;
      }
    } catch (err) {
      console.log(err);
      result = 0;
    }

    return result;
  }
}

export default new UserServices();
