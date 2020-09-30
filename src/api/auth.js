import config from "./config.js";
export const auth = function(state){
    return window.open(encodeURI(`${config.authBaseURL}/oauth/authorize?response_type=token&client_id=${config.clientId}&state=${state}&redirect_uri=${config.redirectURI}&scopes=read,write`),"_self");
}
/*
export const auth = async code=>{
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let state = "";
    for (let i = 0; i < 40; i++)
    state += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    const response = await fetch(`${config.authBaseURL}/oauth2/authorize`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body:`grant_type="Imlicit"&client_id=${config.clientId}&state=${"state"}&redirect_uri=${config.redirectURI}&scopes="read,write"`
    })
    if(response.status!=200)
        throw new Error();
    console.log(await response.text());
}*/