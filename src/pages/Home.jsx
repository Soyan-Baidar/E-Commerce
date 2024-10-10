import { useQuery } from '@tanstack/react-query';
import BannerCarousel from '../components/Carousel';
import Products from '../components/Products';
import axios from 'axios';
import { Skeleton, Box, Typography } from '@mui/material';

const fetchProducts = async () => {
  const response = await axios.get('/api/home/products');
  return response.data;
};

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['home-products'],
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

  const featuredProducts = data?.featuredProducts || [];
  const latestProducts = data?.latestProducts || [];

  return (
    <>
      <BannerCarousel />
      <Products featuredProducts={featuredProducts} latestProducts={latestProducts} />
    </>
  );
}
