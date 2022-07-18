function myFirstPromise(shouldFail){

    return new Promise((resolve, reject) =>{
        if(shouldFail){
            reject("Fail")
        }
        if(!shouldFail){
            resolve("Success")
        }
    });

}
