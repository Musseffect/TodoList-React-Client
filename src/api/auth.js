import config from "./config.js";
export const auth = function(state){
    return window.open(encodeURI(`${config.authBaseURL}/oauth/authorize?response_type=token&client_id=${config.clientId}&state=${state}&redirect_uri=${config.redirectURI}&scopes=read,write`),"_self");
}