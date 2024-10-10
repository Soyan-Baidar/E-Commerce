import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { useCartContext } from '../context/CartContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { keyframes } from '@mui/system';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from "../constants";

const scaleUp = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
`;

const scaleDown = keyframes`
  0% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const styles = {
  listItem: {
    marginBottom: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '8px',
    transition: 'box-shadow 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
  },
  avatar: {
    marginRight: '16px',
  },
  chip: {
    margin: '0 8px',
    animation: `${scaleUp} 0.3s ease-in-out`,
    '&:hover': {
      animation: `${scaleDown} 0.3s ease-in-out`,
    },
  },
  iconButton: {
    margin: '0 4px',
  },
  totalAmount: {
    marginTop: '16px',
    padding: '16px',
    borderTop: '1px solid #ddd',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'right',
  },
};

export function Cart() {
  const { cart, setCart } = useCartContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  

  const mutation = useMutation({
    mutationFn: (data) => axios.post("/api/checkout", data),
    onSuccess: (res) => {
      console.log(res);
      window.location.replace(res.data.url);
    },
  });


  const totalAmount = cart.reduce((total, product) => total + (product.price * product.orderQuantity), 0);

  const handleIncreaseQuantity = (productId) => {
    setCart(cart.map(product =>
      product._id === productId ? { ...product, orderQuantity: product.orderQuantity + 1 } : product
    ));
  };

  const handleDecreaseQuantity = (productId) => {
    setCart(cart.map(product =>
      product._id === productId
        ? product.orderQuantity > 1
          ? { ...product, orderQuantity: product.orderQuantity - 1 }
          : null
        : product
    ).filter(product => product !== null));
  };

  const handleDeleteItem = (product) => {
    setCart(cart.filter(p => p._id !== product._id));
    setItemToRestore(product);
    setSnackbarOpen(true);
    const timeoutId = setTimeout(() => {
      if (itemToRestore) {
        setItemToRestore(null);
      }
    }, 7000);
    setUndoTimeout(timeoutId);
  };

  const handleUndo = () => {
    if (itemToRestore) {
      setCart(prevCart => [...prevCart, itemToRestore]);
      setItemToRestore(null);
      clearTimeout(undoTimeout);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  

  return (
    <>
      <List>
        {cart.map((product) => (
          <ListItem key={product._id} style={styles.listItem}>
            <ListItemAvatar>
              <Avatar alt={product.name} src={product.image} style={styles.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={product.name}
              secondary={`Price: $${product.price} x ${product.orderQuantity}`}
            />
            <IconButton
              edge="end"
              aria-label="increase"
              onClick={() => handleIncreaseQuantity(product._id)}
              style={styles.iconButton}
            >
              <AddCircleOutlineIcon />
            </IconButton>
            <Chip label={product.orderQuantity} color="primary" style={styles.chip} />
            <IconButton
              edge="end"
              aria-label="decrease"
              onClick={() => handleDecreaseQuantity(product._id)}
              style={styles.iconButton}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteItem(product)}
              style={styles.iconButton}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <div style={styles.totalAmount}>Total: ${totalAmount.toFixed(2)}</div>
      {cart.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => mutation.mutate(cart)}
          disabled={loading}
          fullWidth
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      )}
      <Snackbar
        open={snackbarOpen}
        message={itemToRestore ? "Product removed" : "Payment failed"}
        action={
          itemToRestore && (
            <Button color="secondary" size="small" onClick={handleUndo}>
              UNDO
            </Button>
          )
        }
        onClose={handleCloseSnackbar}
      />
    </>
  );
}
