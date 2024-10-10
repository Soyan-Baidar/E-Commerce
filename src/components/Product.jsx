import React, { useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useSpring, animated } from '@react-spring/web';
import { CartContext } from "../context/CartContext";
import { IconButton } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";

const Product = ({ _id, name, image, price, quantity, isFeatured }) => {
  const { addToCart } = useContext(CartContext);
  const springProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const handleAddToCart = () => {
    const productData = { _id, name, image, price, quantity, isFeatured };
    addToCart(productData);
  };

  return (
    <animated.div style={springProps}>
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <CardMedia component="img" height="170" image={image} alt={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Price: ${price}
          </Typography>
          {quantity === 0 && (
            <Chip label="Out of Stock" color="error" sx={{ mt: 1 }} />
          )}
          {isFeatured && (
            <Chip label="Featured" color="primary" sx={{ mt: 1, ml: 1 }} />
          )}
          <IconButton onClick={handleAddToCart} color="primary" aria-label="add to shopping cart">
            <AddShoppingCart />
          </IconButton>
        </CardContent>
      </Card>
    </animated.div>
  );
};

export default Product;
