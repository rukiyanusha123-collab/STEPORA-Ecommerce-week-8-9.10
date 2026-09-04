import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // SET CART
    setCart: (state, action) => {
      state.items = action.payload;
    },

    // ADD TO CART
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
    },

    // REMOVE FROM CART
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size
          )
      );
    },

    // INCREASE QUANTITY
    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // DECREASE QUANTITY
    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // CLEAR CART
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;