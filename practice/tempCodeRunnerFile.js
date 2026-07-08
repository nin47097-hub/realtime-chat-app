const promise = new promise((resolve, regect)=>{
    const password = true;
    if(password){
        resolve();
    }
    else{
        regect();
    }
});
promise
.then((message)=>{
    console.log(message);
})
.catch((erroe)=>{
    console.log(error);
});