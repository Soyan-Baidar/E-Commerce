import React from "react";
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
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { useSpring, animated } from "@react-spring/web";

// Schema for form validation with stricter rules
const schema = yup
  .object({
    firstName: yup
      .string()
      .min(2, "First Name must be at least 2 characters")
      .matches(/^[a-zA-Z]+$/, "First Name can only contain letters")
      .required("First Name is required"),
    lastName: yup
      .string()
      .min(2, "Last Name must be at least 2 characters")
      .matches(/^[a-zA-Z]+$/, "Last Name can only contain letters")
      .required("Last Name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
      .required("Password is required"),
  })
  .required();

const styles = {
  container: { marginTop: "8vh", display: "flex", flexDirection: "column", alignItems: "center" },
  avatar: { margin: 1, backgroundColor: "#3f51b5" },
  form: { marginTop: 3 },
  submitButton: { marginTop: 3, marginBottom: 2, backgroundColor: "#3f51b5", color: "white" },
  submitButtonHover: { backgroundColor: "#303f9f" },
  link: { color: "#3f51b5" }
};

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post("http://localhost:8000/api/auth/signup", data); // Ensure this matches the route defined in auth.route.js
    },
    onSuccess: (res) => {
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
      navigate("/sign-in");
    },
    onError: (error) => {
      console.error("Sign-up error:", error.response?.data);
      toast.error(error.response?.data?.message || "An error occurred", {
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
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <Container component="main" maxWidth="xs">
      <animated.div style={fadeIn}>
        <Box sx={styles.container}>
          <Avatar sx={styles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={styles.form}>
            {mutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {mutation.error.response?.data?.errors?.[0]?.message ?? "Something went wrong."}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  {...register("firstName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                  {...register("lastName")}
                />
              </Grid>
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
              sx={{
                ...styles.submitButton,
                "&:hover": styles.submitButtonHover
              }}
            >
              {mutation.isLoading ? "Signing up..." : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2" sx={styles.link}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </animated.div>
    </Container>
  );
}
