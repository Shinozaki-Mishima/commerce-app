import React from "react";
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";

import useStyles from "./product-styles";

const Product = ({ product, onAddToCart }) => {
  const classes = useStyles();

  const addToCartHandler = () => onAddToCart(product.id, 1);

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={product.image.url}
        title={product.name}
      />
      <CardContent>
        <div className={classes.cardContent}>
          {/* 
            Typography: used for any text in material-ui 
            gutterBottom: space at the bottom 
            */}
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
            ${product.price.formatted}
          </Typography>
        </div>
        <Typography
          dangerouslySetInnerHTML={{ __html: product.description }}
          variant="body2"
          color="textSecondary"
          component="p"
        />
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <IconButton aria-label="Add to Cart" onClick={addToCartHandler}>
          <AddShoppingCart />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Product;
