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
import AddUserDialog from './AddUserDialog';
import { toast, Bounce } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SERVER_URL } from '../../constants';

const fetchUsers = async () => {
  const res = await axios.get('/api/admin/users');
  return res.data;
};

const deleteUser = async (id) => {
  await axios.delete(`/api/admin/users/${id}`);
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

const Customers = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const theme = useTheme();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully', {
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
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
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

  const handleAddOrEditUser = (user = null) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredUsers = data?.users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      <TextField
        variant="outlined"
        placeholder="Search users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '16px', width: '100%' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddOrEditUser()}
        style={{ marginBottom: '16px' }}
      >
        Add New User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Profile Image</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                <Avatar src={`${SERVER_URL}${user.profileImage}`} alt={`${user.firstName} ${user.lastName}`} />
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <StyledIconButton onClick={() => handleAddOrEditUser(user)}>
                      <EditIcon />
                    </StyledIconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <StyledIconButton onClick={() => handleDeleteUser(user._id)}>
                      <DeleteIcon />
                    </StyledIconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddUserDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        onUserAdded={() => queryClient.invalidateQueries(['users'])}
        user={selectedUser}
      />
    </div>
  );
};

export default Customers;
