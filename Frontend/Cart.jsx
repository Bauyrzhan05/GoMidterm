import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearCart, removeFromCart } from "./Redux/export";

export default function Cart() {

    const cartItems = useSelector((state) => state.cart.cartItems);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const [FoodList, setFoodLIst] = useState([]);

    const fetchFood = async () => {
        try {
            fetch ("http://localhost:8080/food/list")
            .then(res => res.json())
            .then(data => setFoodLIst(data.data));
        }catch(error){
            console.log("Error fetching food:", error)
        }
    }

    useEffect(() => {
        fetchFood();
    },[])

    console.log(cartItems)


    const getTotalCart = () => {
        let total = 0;
        for (let id in cartItems) {
          const item = FoodList.find((food) => food.id === id);
          if (item) {
            total += item.price * cartItems[id];
          }
        }
        return total;
      };

      const handleOrder = async () => {

        if (!user) {
            toast.warning("You should be logged in to order");
            return;
        }

        const total = getTotalCart();
        if (total === 0){
            toast.warning("Your cart is empty");
            return;
        }

        const orderedItems = FoodList
            .filter((item) => cartItems[item.id])
            .map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: cartItems[item.id]
            }));

        const newOrder = {
            userId: user.id,
            userName: user.userName,
            items: orderedItems,
            totalAmount: total,
            status: "Accepted ",
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await fetch("http://localhost:8000/orders", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newOrder),
            });

            if (response.ok){
                toast.success("Order Placed");
                dispatch(clearCart());
            }else{
                toast.error("Failed to place order");
            }

        }catch(error){
            console.log(error);
        };
    };


    return (
    <div className="shopping-cart">
        <div className="cart-container">
          <div className="cart-header">
            <h2 className="cart-title">Your Shopping Cart</h2>
            <div className="cart-header-grid">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </div>
          </div>
      
          {/* Cart Items */}
          <div className="cart-items">
            {FoodList.map((item, index) => {
              if (cartItems[item.id]) {
                return (
                  <div key={index} className="cart-item">
                    <div className="cart-item-grid">
                      <div className="product-info">
                        <div className="product-image-container">
                          <img 
                            src={`http://localhost:8080/${item.image}`} 
                            alt={item.name}
                            className="product-image"
                          />
                        </div>
                        <p className="product-name">{item.name}</p>
                      </div>
                      
                      <div className="product-price">${Number(item.price).toFixed(2)}</div>
                      
                      <div className="product-quantity">
                        <span className="quantity-value">{cartItems[item.id]}</span>
                      </div>
                      
                      <div className="product-total">
                        ${(Number(item.price) * cartItems[item.id]).toFixed(2)}
                      </div>
                      
                      <div className="product-remove">
                        <button 
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="remove-btn"
                        >
                          <svg viewBox="0 0 24 24" className="trash-icon">
                            <path d="M3 6h18l-1.58 14.22A2 2 0 0 1 17.42 22H6.58a2 2 0 0 1-2-1.78L3 6zm3-4h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="item-divider"></div>
                  </div>
                );
              }
            })}
          </div>
      
          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getTotalCart().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className="free">$0.00</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${getTotalCart().toFixed(2)}</span>
              </div>
              <button 
                onClick={handleOrder}
                className="checkout-btn"
              >
                PROCEED TO CHECKOUT
                <svg viewBox="0 0 24 24" className="arrow-icon">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
    </div>
    );
}