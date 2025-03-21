import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Grid, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/users";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      setSuccessMessage("Registration successful!");
      navigate("/login");
      setErrorMessage("");
      console.log("User registered:", response.data);
    } catch (error: any) {
      setErrorMessage(error.message || "An unknown error occurred");
      setSuccessMessage("");
      console.error("Registration failed:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ background: "linear-gradient(to right, #4c7bf0, #1d4289)" }}
    >
      <Paper
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
          backgroundColor: "",
        }}
      >
        <Typography variant="h5" gutterBottom align="center" color="primary">
          SIGN IN{" "}
        </Typography>

        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                placeholder="Enter your full name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1d4289" },
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#1d4289",
                    "&:hover fieldset": { borderColor: "#1d4289" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                placeholder="example@example.com"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1d4289" },
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#1d4289",
                    "&:hover fieldset": { borderColor: "#1d4289" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1d4289" },
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#1d4289",
                    "&:hover fieldset": { borderColor: "#1d4289" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1d4289" },
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#1d4289",
                    "&:hover fieldset": { borderColor: "#1d4289" },
                  },
                }}
              />
            </Grid>

            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2" align="center">
                  {errorMessage}
                </Typography>
              </Grid>
            )}

            {successMessage && (
              <Grid item xs={12}>
                <Typography color="primary" variant="body2" align="center">
                  {successMessage}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} textAlign="center">
              <Typography variant="body2" color="#1d4289">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#4c7bf0",
                    fontWeight: "bold",
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  padding: "10px",
                  backgroundColor: "#1d4289",
                  "&:hover": { backgroundColor: "#4c7bf0" },
                }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
