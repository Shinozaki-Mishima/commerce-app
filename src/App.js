import React, { useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import Products from './components/products/Products';
// import NavBar from './components/NavBar/NavBar';

import { Navbar, Products, Cart, Checkout } from './components';
import { commerce } from './lib/commerce';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [incomingOrder, setIncomingOrder] = useState({});
  const [errMessage, setErrMessage] = useState('');

  // fetch the product list 
  const fetchProductsHandler = async () => {
    const { data } = await commerce.products.list();

    setProducts(data);
  };

  // fetch cart from api
  const fetchCartHandler = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const addToCartHandler = async (product_id, quantity) => {
    const item = await commerce.cart.add(product_id, quantity);

    setCart(item.cart);
  };

  const handleUpdateCartQuantity = async (item_id, quantity) => {
    const response = await commerce.cart.update(item_id, { quantity });

    setCart(response.cart);
  };

  const handleRemoveFromCart = async (item_id) => {
    const response = await commerce.cart.remove(item_id);

    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();

    setCart(response.cart);
  };

  const refreshCart = async () => {
    const newCartResponse = await commerce.cart.refresh();

    setCart(newCartResponse);
  }

  const captureCheckoutHandler = async (checkout_token_id, newOrder) => {
    try {
      const newIncomingOrder = await commerce.checkout.capture(checkout_token_id, newOrder);

      setIncomingOrder(newIncomingOrder);
      refreshCart();
    } catch (error) {
      refreshCart();
      setErrMessage(error.data.error.message)
    }
  }

  useEffect(() => {
    fetchProductsHandler();
    fetchCartHandler();
  }, []);


  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={addToCartHandler} handleUpdateCartQty />
          </Route>
          <Route exact path="/cart">
            <Cart cart={cart} onUpdateCartQuantity={handleUpdateCartQuantity} onRemoveFromCart={handleRemoveFromCart} onEmptyCart={handleEmptyCart} />
          </Route>
          <Route exact path="/checkout">
            <Checkout cart={cart} incomingOrder={incomingOrder} onCaptureCheckout={captureCheckoutHandler} error={errMessage}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
