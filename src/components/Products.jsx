import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import Product from "./Product";
import { SERVER_URL } from "../constants";

const Products = ({ featuredProducts = [], latestProducts = [] }) => {
  const fadeInAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 300 },
  });

  return (
    <Container sx={{ padding: "2rem 0" }}>
      <style>
        {`
          .product-container {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 1rem;
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .product-container:hover {
            transform: translateY(-10px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .section-title {
            margin: 2rem 0 1rem;
            color: #333;
            font-weight: bold;
            text-align: center;
          }
        `}
      </style>

      <Typography variant="h4" className="section-title">
        Featured Products
      </Typography>
      <Box>
        <Grid container spacing={3} justifyContent="center">
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <animated.div style={fadeInAnimation} className="product-container">
                <Product
                  _id={product._id}
                  name={product.name}
                  image={`${SERVER_URL}${product.image}`}
                  price={product.price}
                  quantity={product.quantity}
                  isFeatured={product.isFeatured}
                />
              </animated.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="h4" className="section-title">
        Latest Products
      </Typography>
      <Box>
        <Grid container spacing={3} justifyContent="center">
          {latestProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <animated.div style={fadeInAnimation} className="product-container">
                <Product
                  _id={product._id}
                  name={product.name}
                  image={`${SERVER_URL}${product.image}`}
                  price={product.price}
                  quantity={product.quantity}
                  isFeatured={product.isFeatured}
                />
              </animated.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Products;
