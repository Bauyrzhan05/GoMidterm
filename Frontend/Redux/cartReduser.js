const initialState = {
  cartItems: {},
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const addId = action.payload;
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [addId]: (state.cartItems[addId] || 0) + 1,
        },
      };
    case "REMOVE_FROM_CART":
      const removeId = action.payload;
      const updatedCart = { ...state.cartItems };
      if (updatedCart[removeId] > 1) updatedCart[removeId]--;
      else delete updatedCart[removeId];
      return { ...state, cartItems: updatedCart };
    case "CLEAR_CART":
      return { ...state, cartItems: {} };
    default:
      return state;
  }
}

export default cartReducer;
