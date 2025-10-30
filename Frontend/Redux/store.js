import {createStore, combineReducers} from "redux";
import authReducer from "./authReducer";
import cartReducer from "./cartReduser";

const roodReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
});

const store = createStore(roodReducer);

export default store;