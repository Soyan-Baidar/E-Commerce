import React, { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// Schema validation with Yup
const schema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  })
  .required();

export default function SignIn() {
  const { setAuthState } = useContext(AuthContext); // Accessing AuthContext
  const navigate = useNavigate();

  // React Hook Form setup with Yup schema validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Mutation for handling sign-in API request
  const mutation = useMutation({
    mutationFn: (data) => axios.post("/api/auth/signin", data),
    onSuccess: (res) => {
      setAuthState(res.data); // Set authentication state
      localStorage.setItem("authState", JSON.stringify(res.data));
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Sign-in failed.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  // Handle form submission
  const onSubmit = (data) => mutation.mutate(data);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error.response?.data?.errors?.[0]?.message ||
                "Something went wrong."}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register("password")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={mutation.isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {mutation.isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
