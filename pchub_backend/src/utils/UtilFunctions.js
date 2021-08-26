
function isEmpty(data) {
    
    if (typeof(data) === 'object') {
      if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
        return true;
      } 
      else if (!data) {
        return true;
      }
      return false;
    } 
    else if (typeof(data) === 'string') {
      if (!data.trim()) {
        return true;
      }
      return false;
    } 
    else if (typeof(data) === 'undefined') {
      return true;
    } 
    else {
      return false;
    }
}

export default{
    isEmpty,
}