class LocalStorageService{
    
    ls = window.localStorage;
    
    setItem(key, value){
        value = JSON.stringify(value)
        this.ls.setItem(key, value);
        return true;
    }

    getItem(key){
        try{
            let value = this.ls.getItem(key);
            let realVal = JSON.parse(value);
            return realVal;
        }
        catch(error){
            return null;
        }

    }

}

export default new LocalStorageService();