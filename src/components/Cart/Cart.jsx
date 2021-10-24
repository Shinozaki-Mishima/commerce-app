import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem';
import useStyles from './cart-styles';

const Cart = ({ cart, onUpdateCartQuantity, onRemoveFromCart, onEmptyCart }) => {
  const classes = useStyles();

  const emptyCartHandler = () => onEmptyCart();
  // function to return some jsx not a sub-component
  const renderEmptyCart = () => (
    <Typography variant="subtitle1">
      You Have no Items in Your Cart
      <Link className={classes.link} to="/">
        <p>Add Items Here, or click the site's logo in the Navbar to be redirected.</p>
      </Link>
    </Typography>
  );
  // check if the line items is empty
  if (!cart.line_items) {
    return 'Loading';
  }

  function renderCart() {
    return (
      <>
        <Grid container spacing={3}>
          {cart.line_items.map((lineItem) => (
            <Grid item xs={12} sm={4} key={lineItem.id}>
              <CartItem item={lineItem} onUpdateCartQuantity={onUpdateCartQuantity} onRemoveFromCart={onRemoveFromCart} />
            </Grid>
          ))}
        </Grid>
        <div className={classes.cardDetails}>
          <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
          <div>
            <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={emptyCartHandler}>Empty cart</Button>
            <Button component={Link} to="/checkout" className={classes.checkoutButton} component={Link} to="/checkout" size="large" type="button" variant="contained" color="primary">Checkout</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>
      { !cart.line_items.length ? renderEmptyCart() : renderCart() }
    </Container>
  );
};

export default Cart;
