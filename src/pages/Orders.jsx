import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  TextField,
  Box,
  Button,
  Typography,
  TablePagination,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Toolbar,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useMediaQuery } from "@mui/material";

const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 440,
  borderRadius: 4,
  marginBottom: 16,
  boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
}));

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  padding: 12,
  fontSize: 14,
  color: theme.palette.text.primary,
}));

export default function UserOrders() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState(""); // State for search query
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchUserOrders = async ({ queryKey }) => {
    const [, { page, rowsPerPage, status, search }] = queryKey;
    const response = await axios.get("/api/home/user/orders", {
      params: { page: page + 1, limit: rowsPerPage, status, search },
    });
    return response.data;
  };

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["userOrders", { page, rowsPerPage, status, search }],
    queryFn: fetchUserOrders,
    keepPreviousData: true,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(["userOrders"]);
    toast.success("Data refreshed", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box>
      <Toolbar disableGutters>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          User Orders
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Filter">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
          >
            Add Order
          </Button>
        </Stack>
      </Toolbar>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search Orders"
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      {isFetching && <CircularProgress size={24} />} {/* Show loading indicator when fetching */}
      <CustomTableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <CustomTableCell sx={{ color: 'blue', fontWeight: 'bold' }}>No of Products</CustomTableCell>
              <CustomTableCell sx={{ color: 'blue', fontWeight: 'bold' }}>Total Amount</CustomTableCell>
              <CustomTableCell sx={{ color: 'black', fontWeight: 'bold' }}>Status</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((order) => (
              <TableRow key={order._id}>
                <CustomTableCell>{order.products.length}</CustomTableCell>
                <CustomTableCell>
                  ${order.totalAmount.toFixed(2)}
                </CustomTableCell>
                <CustomTableCell>{order.status}</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTableContainer>
      <TablePagination
        component="div"
        count={data?.count || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Box>
  );
}
