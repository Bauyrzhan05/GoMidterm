const storedUser = JSON.parse(localStorage.getItem("token"));

const initalState = {
    user: storedUser ? storedUser : null
}

function authReducer(state = initalState, action) {
    switch (action.type){
        case "LOGIN":
            localStorage.setItem("token", JSON.stringify(action.payload));
            return {...state, user: action.payload}
        case "LOGOUT":
            localStorage.removeItem("token");
            return {...state, user: null}
        default:
            return state
    }
}

export default authReducer;