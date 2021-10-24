import React from 'react';
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';

import useStyles from './cart-styles';

const CartItem = ({ item, onUpdateCartQuantity, onRemoveFromCart }) => {
  const classes = useStyles();

  const updateCartQuantityHandler = (lineItemId, newQuantity) => onUpdateCartQuantity(lineItemId, newQuantity);

  const removeFromCartHandler = (lineItemId) => onRemoveFromCart(lineItemId);

  return (
    <Card className="cart-item">
      <CardMedia image={item.image.url} alt={item.name} className={classes.media} />
      <CardContent className={classes.cardContent}>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h5">{item.line_total.formatted_with_symbol}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.buttons}>
          <Button type="button" size="small" onClick={() => updateCartQuantityHandler(item.id, --item.quantity )}>-</Button>
          <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
          <Button type="button" size="small" onClick={() => updateCartQuantityHandler(item.id, ++item.quantity )}>+</Button>
        </div>
        <Button variant="contained" type="button" color="secondary" onClick={() => removeFromCartHandler(item.id)}>Remove</Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
