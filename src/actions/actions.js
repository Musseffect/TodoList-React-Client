export const ERROR = "ERROR";


export var setTitle =  function(title){
    document.title = title;
}
export var handleError = function(message,errorType){
    return {type:ERROR,message,errorType};
}
