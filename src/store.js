import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from 'redux-thunk';
import rootReducer from "./reducers/rootReducer.js";
import { composeWithDevTools } from 'redux-devtools-extension';
import { Cookies } from "react-cookie";

const initialState = (function(){
    return {
    tasks:{
        isLoading:false,
        submitting:false,
        items:{},
        updatedAt:0
    },
    ui:{
    },
    login:{
        isLoading:false
    }
}})();
const store = createStore(rootReducer,initialState,composeWithDevTools({trace:true})(applyMiddleware(thunkMiddleware)));


export default store;