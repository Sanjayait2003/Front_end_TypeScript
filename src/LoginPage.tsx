import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Grid, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/users";

  interface LoginResponse {
    token: string;
  }

  console.log('Test');
  
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
        email,
        password,
      });
      const data = response.data;

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        setErrorMessage("");
        navigate("/productPage");
        console.log("Login successful:", data);
      } else {
        setErrorMessage("Invalid login response");
      }
    } catch (error: any) {
      setErrorMessage("Invalid email or password");
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: "linear-gradient(to right, #4c7bf0, #1d4289)", 
      }}
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
          Login to Your Account
        </Typography>

        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
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

            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2" align="center">
                  {errorMessage}
                </Typography>
              </Grid>
            )}

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
                Login
              </Button>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Typography variant="body2" color="#1d4289">
                Don't have an account? 
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "#4c7bf0", 
                    fontWeight: "bold",
                  }}
                >
                  Register here
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
