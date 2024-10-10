import { useQuery } from '@tanstack/react-query';
import Product from '../components/Product';
import axios from 'axios';
import { Skeleton, Box, Typography, Grid } from '@mui/material';
import { SERVER_URL } from '../constants';

const fetchProducts = async () => {
  const response = await axios.get('/api/admin/products/all');
  return response.data;
};

export default function AllProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Skeleton variant="text" width="60%" sx={{ marginTop: 2 }} />
        <Skeleton variant="text" width="40%" sx={{ marginTop: 1 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
        <Typography variant="h6" color="error">
          Something went wrong. Please try again later.
        </Typography>
      </Box>
    );
  }

  if (!data || !data.products) {
    return null; // Or some fallback UI
  }

  return (
    <Grid container spacing={2} sx={{ p: 4 }}>
      {data.products.map((product) => (
        <Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
          <Product
            _id={product._id}
            name={product.name}
            image={SERVER_URL + product.image}
            price={product.price}
            quantity={product.quantity}
            isFeatured={product.isFeatured}
          />
        </Grid>
      ))}
    </Grid>
  );
}
