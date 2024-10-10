import React, { useEffect, forwardRef } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Bounce } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  quantity: Yup.number().required('Quantity is required').min(0, 'Quantity cannot be negative'),
  // image: Yup.mixed().required('Image is required').test(
  //   'fileSize',
  //   'The file is too large',
  //   (value) => value && value.size <= 5000000000  ).test(
  //   'fileType',
  //   'Unsupported file format',
  //   (value) => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
  // ),
  isFeatured: Yup.boolean(),
});

// Custom styled components
const StyledButton = styled(Button)({
  backgroundColor: '#007bff',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: 8,
    padding: 24,
    backgroundColor: '#fff',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#007bff',
    },
  },
  '& .MuiInputBase-input': {
    color: '#000',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 16,
  borderBottom: '1px solid #ddd',
  color: '#000',
  backgroundColor: '#f5f5f5',
});

const StyledCheckbox = styled(Checkbox)({
  '& .MuiSvgIcon-root': {
    fill: '#007bff',
    backgroundColor: '#e7f0ff',
    borderRadius: 4,
    border: '1px solid #007bff',
  },
  '&.Mui-checked': {
    '& .MuiSvgIcon-root': {
      fill: '#007bff',
      backgroundColor: '#e7f0ff',
    },
  },
});

const StyledFormControlLabel = styled(FormControlLabel)({
  marginBottom: 16,
  color: '#000',
});

// Slide transition component for dialog
const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Main ProductDialog component
const ProductDialog = ({ open, handleClose, product }) => {
  const queryClient = useQueryClient();

  // React Hook Form setup with validation schema
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Effect to reset form fields when the product prop changes
  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset({
        name: '',
        price: '',
        quantity: '',
        image: '',
        isFeatured: false,
      });
    }
  }, [product, reset]);

  // Mutation for handling form submission
  const mutation = useMutation({
    mutationFn: (productData) => {
      const url = product ? `/api/admin/products/${product._id}` : '/api/admin/products';
      const method = product ? 'put' : 'post';

      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('quantity', productData.quantity);
      formData.append('isFeatured', productData.isFeatured);
      if (productData.image[0]) {
        formData.append('image', productData.image[0]); // Upload the file
      }

      return axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      });
    },
    onSuccess: () => {
      toast.success(`Product ${product ? 'updated' : 'added'} successfully`, {
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
      handleClose();
    },
    onError: (error) => {
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

  // Handle form submission
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <StyledDialog open={open} onClose={handleClose} TransitionComponent={Transition} fullWidth maxWidth="sm">
      <StyledDialogTitle>
        {product ? 'Edit Product' : 'Add New Product'}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <StyledTextField
            label="Product Name"
            fullWidth
            margin="dense"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...control.register('name')}
          />
          <StyledTextField
            label="Price"
            type="number"
            fullWidth
            margin="dense"
            error={!!errors.price}
            helperText={errors.price?.message}
            {...control.register('price')}
          />
          <StyledTextField
            label="Quantity"
            type="number"
            fullWidth
            margin="dense"
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
            {...control.register('quantity')}
          />
          <StyledTextField
            label="Image"
            type="file"
            fullWidth
            margin="dense"
            error={!!errors.image}
            helperText={errors.image?.message}
            {...control.register('image')}
            InputLabelProps={{ shrink: true }}
          />
          <StyledFormControlLabel
            control={
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <StyledCheckbox
                    checked={field.value}
                    {...field}
                  />
                )}
              />
            }
            label="Featured Product"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <StyledButton onClick={handleSubmit(onSubmit)} color="primary">
          {product ? 'Update Product' : 'Add Product'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ProductDialog;
