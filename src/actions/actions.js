import {auth} from "../api/auth.js";



export const SET_TITLE = "SET_TITLE";
export const ERROR = "ERROR";


export var setTitle =  function(title){
    return {type:SET_TITLE,title};
}
export var handleError = function(message,type){
    return {type:ERROR,message,type};
}

export var login = function(state){
    auth(state);
}
