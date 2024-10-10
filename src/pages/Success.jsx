import React from 'react';
import { Container, Typography, Button, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom'; // Updated import
import { SERVER_URL } from '../constants';

const SuccessPage = () => {
  const navigate = useNavigate(); // Updated hook

  // Sample data
  const orderSummary = {
    orderId: '123456',
    items: [
      { id: '1', title: 'Product 1', price: 29.99, image: '/path/to/image1.jpg', quantity: 2 },
      { id: '2', title: 'Product 2', price: 19.99, image: '/path/to/image2.jpg', quantity: 1 },
    ],
    totalAmount: 79.97,
  };

  return (
    <Container component="main" maxWidth="md" sx={{ marginTop: 8, marginBottom: 8 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h3" align="center" color="success.main" gutterBottom>
          <CheckCircleIcon fontSize="large" />
          <br />
          Payment Successful!
        </Typography>

        <Typography variant="h5" align="center" gutterBottom>
          Your order has been processed successfully.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {orderSummary.items.map(item => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  image={`${SERVER_URL}${item.image}`}
                  alt={item.title}
                  sx={{ width: '100%', height: 140 }}
                />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {item.title}
                  </Typography>
                  <Typography variant="body1" align="center">
                    Price: ${item.price}
                  </Typography>
                  <Typography variant="body1" align="center">
                    Quantity: {item.quantity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" align="right" sx={{ marginTop: 4 }}>
          <strong>Total Amount:</strong> ${orderSummary.totalAmount}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 4 }}
          onClick={() => navigate('/order-history')} // Updated navigation
        >
          View Order History
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={() => navigate('/')} // Updated navigation
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default SuccessPage;
