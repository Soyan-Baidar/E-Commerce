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
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Bounce } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

// Validation schema using Yup
const validationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  isAdmin: yup.boolean(),
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

// Main AddUserDialog component
export default function AddUserDialog({ handleClose, open, onUserAdded, user }) {
  const queryClient = useQueryClient();

  // React Hook Form setup with validation schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Reset form with user data when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        isAdmin: user.isAdmin,
        profileImage: null,
      });
    }
  }, [user, reset]);

  // Mutation for handling form submission
  const mutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.isAdmin !== undefined) formData.append('isAdmin', data.isAdmin);
      if (data.profileImage && data.profileImage[0]) {
        formData.append('profileImage', data.profileImage[0]);
      }

      // Determine whether to create or update a user
      const url = user && user._id
        ? `/api/admin/users/${user._id}`
        : '/api/admin/users';
      const method = user && user._id ? 'patch' : 'post';

      return axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      toast.success('User saved successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
      queryClient.invalidateQueries(['users']);
      onUserAdded();
      handleClose();
    },
    onError: (error) => {
      console.error('Error saving user:', error);
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

  // Submit form handler
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
    >
      <StyledDialogTitle>
        {user ? 'Edit User' : 'Add User'}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <StyledTextField
            label="First Name"
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName')}
          />
          <StyledTextField
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName')}
          />
          <StyledTextField
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <StyledTextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />
          <StyledFormControlLabel
            control={
              <Controller
                name="isAdmin"
                control={control}
                render={({ field }) => (
                  <StyledCheckbox
                    checked={field.value || false}
                    {...field}
                  />
                )}
              />
            }
            label="Is Admin"
          />
          <StyledTextField
            type="file"
            fullWidth
            margin="normal"
            inputProps={{
              accept: 'image/*',
            }}
            {...register('profileImage')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <StyledButton onClick={handleSubmit(onSubmit)}>
          {user ? 'Update' : 'Save'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
}
