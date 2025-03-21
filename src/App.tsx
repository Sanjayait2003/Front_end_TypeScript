import React from "react";
import logo from "./logo.svg";
import "./App.css";
import RegisterPage from "./RegisterPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import ProductPage from "./ProductPage";
import ProductDataTable from "./ProductDataTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path='/productpage' element ={<ProductPage/>} />
        <Route path='/productable' element ={<ProductDataTable/>} />

      </Routes>
    </Router>
  );
}

export default App;
