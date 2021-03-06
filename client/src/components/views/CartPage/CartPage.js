import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Result, Empty } from "antd";
import Axios from "axios";

function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0);
    const [ShowTotal, setShowTotal] = useState(false);

    useEffect(() => {
        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id);
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart));
            }
        }
    }, [props.user.userData]);

    useEffect(() => {
        if (props.user.cartDetail && props.user.cartDetail.length > 0) {
            calculateTotal(props.user.cartDetail);
        }
    }, [props.user.cartDetail]);

    const calculateTotal = cartDetail => {
        let total = 0;
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity;
        });
        setTotal(total);
        setShowTotal(true);
    };

    const checkout = function() {
        props.history.push("/checkout");
    };

    const removeFromCart = productId => {
        dispatch(removeCartItem(productId)).then(() => {
            Axios.get("/api/users/userCartInfo").then(response => {
                if (response.data.success) {
                    if (response.data.cartDetail.length <= 0) {
                        setShowTotal(false);
                    } else {
                        console.log("from dispatch", response.data.cartDetail);
                        calculateTotal(response.data.cartDetail);
                    }
                } else {
                    alert("Failed to get cart info");
                }
            });
        });
    };

    return (
        <div style={{ width: "85%", margin: "3rem auto" }}>
            <h1>My Cart</h1>
            <div>
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} calculateTotal={calculateTotal} setShowTotal={setShowTotal} />

                {ShowTotal ? (
                    <div style={{ marginTop: "3rem" }}>
                        <br />
                        <br />
                        <br />
                        <h2>Total amount: ${Total} </h2>
                    </div>
                ) : (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}
                    >
                        <br />
                        <Empty description={false} />
                        <p>No Items In the Cart</p>
                    </div>
                )}
            </div>

            {/* Updates the quantity in DB */}
            <button onClick={checkout} className="float-left">
                Continue to Checkout
            </button>
        </div>
    );
}

export default CartPage;
