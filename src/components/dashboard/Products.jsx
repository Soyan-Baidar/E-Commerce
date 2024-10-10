import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TextField,
  useTheme,
  styled,
  Avatar,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ProductDialog from './AddProductDialog'; 
import { toast, Bounce } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SERVER_URL } from '../../constants';

// Fetch products function
const fetchProducts = async () => {
  const res = await axios.get('/api/admin/products/all');
  return res.data;
};

// Delete product function
const deleteProduct = async (id) => {
  await axios.delete(`/api/admin/products/${id}`);
};

// Styled components for a more professional look
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-root': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.dark,
  },
}));

const Product = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const theme = useTheme();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'An error occurred', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
    },
  });

  const handleAddOrEditProduct = (product = null) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter products based on search query
  const filteredProducts = data?.products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <TextField
        variant="outlined"
        placeholder="Search products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '16px', width: '100%' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddOrEditProduct()}
        style={{ marginBottom: '16px' }}
      >
        Add New Product
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Product Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock Quantity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                  <Avatar
  src={product.image ? `${SERVER_URL}${product.image}` : '/default-product-image.jpg'} // Default image as fallback
  alt={product.name}
/>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <StyledIconButton onClick={() => handleAddOrEditProduct(product)}>
                        <EditIcon />
                      </StyledIconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <StyledIconButton onClick={() => handleDeleteProduct(product._id)}>
                        <DeleteIcon />
                      </StyledIconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        onProductAdded={() => queryClient.invalidateQueries(['products'])}
        product={selectedProduct}
      />
    </div>
  );
};

export default Product;
