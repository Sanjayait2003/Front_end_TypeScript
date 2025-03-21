import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
}

const ProductPage: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    name: "",
    minStock: 0,
    startDate: "",
  });

  const navigate = useNavigate();
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    images: [] as File[],
  });

  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (files) {
      setNewProduct((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(
        "http://localhost:5000/api/products"
      );
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price.toString());
    formData.append("stock", newProduct.stock.toString());

    newProduct.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post<Product>(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data) {
        setProducts((prev) => [...prev, response.data]);
      } else {
        console.error("No product data received", response);
      }      setNewProduct({ name: "", price: 0, stock: 0, images: [] });
      setOpenAddDialog(false);
    } catch (error) {
      setError("Failed to create product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.request({
        method: 'DELETE',
        url: "http://localhost:5000/api/products/delete",
        data: { id }, 
      });
  
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      setError("Failed to delete product");
    }
  };
  

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productToEdit) return;

    const formData = new FormData();
    formData.append("name", productToEdit.name);
    formData.append("price", productToEdit.price.toString());
    formData.append("stock", productToEdit.stock.toString());

    try {
      const response = await axios.put<Product>(
        `http://localhost:5000/api/products/${productToEdit._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prev) =>
        prev.map((product) =>
          product._id === productToEdit._id
            ? { ...product, ...response.data }
            : product
        )
      );

      setOpenEditDialog(false);
      setProductToEdit(null);
    } catch (error) {
      setError("Failed to update product");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleFilterSubmit = async () => {
    setLoading(true);
    setError(null);

    console.log("Filter Name before API call:", filter.name);

    try {
      const responseName = await axios.post(
        "http://localhost:5000/api/products/filter/name",
        { name: filter.name }
      );

      console.log("API Response for Name Filter:", responseName.data);

      if (!Array.isArray(responseName.data)) {
        return setError("Error: No data found for the specified filter.");
      }

      setProducts(responseName.data);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByMinStock = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Filter Min Stock before API call:", filter.minStock);

      const response = await axios.post(
        "http://localhost:5000/api/products/filter/stock",
        { minStock: filter.minStock }
      );

      console.log("API Response for Min Stock Filter:", response.data);

      if (!Array.isArray(response.data)) {
        return setError("Error: No data found for the specified filter.");
      }

      setProducts(response.data);
    } catch (err) {
      console.error("Error applying min stock filter:", err);
      setError("Failed to apply min stock filter.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByStartDate = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Filter Start Date before API call:", filter.startDate);

      const response = await axios.post(
        "http://localhost:5000/api/products/filter/createdAt",
        { startDate: filter.startDate }
      );

      console.log("API Response for Start Date Filter:", response.data);

      if (!Array.isArray(response.data)) {
        return setError("Error: No data found for the specified filter.");
      }

      setProducts(response.data);
    } catch (err) {
      console.error("Error applying start date filter:", err);
      setError("Failed to apply start date filter.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      style={{
        background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" sx={{ marginBottom: "20px" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DASHBOARD{" "}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          marginBottom: "20px",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Button color="inherit" onClick={toggleDrawer}>
          Filters
        </Button>

        <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
          <Box sx={{ width: 250, padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: "20px" }}>
              Filters
            </Typography>

            <TextField
              label="Filter by Name"
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
              fullWidth
              sx={{ marginBottom: "15px" }}
            />
            <Button
              onClick={() => handleFilterSubmit()}
              variant="contained"
              sx={{ marginBottom: "20px" }}
            >
              Apply Name Filter
            </Button>

            <TextField
              label="Min Stock"
              name="minStock"
              value={filter.minStock}
              onChange={handleFilterChange}
              type="number"
              fullWidth
              sx={{ marginBottom: "15px" }}
            />
            <Button
              onClick={() => handleFilterByMinStock()}
              variant="contained"
              sx={{ marginBottom: "20px" }}
            >
              Apply Min Stock Filter
            </Button>

            <TextField
              label="Start Date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              type="date"
              fullWidth
              sx={{ marginBottom: "15px" }}
            />
            <Button
              onClick={() => handleFilterByStartDate()}
              variant="contained"
              sx={{ marginBottom: "20px" }}
            >
              Apply Start Date Filter
            </Button>
          </Box>
        </Drawer>
      </Box>
      <Box sx={{ padding: "40px 20px", textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{ marginBottom: "20px", fontWeight: "bold" }}
        >
          Product List
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
          sx={{ marginBottom: "20px" }}
        >
          Add Product
        </Button>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Create Product</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <div style={{ marginTop: "15px" }}>
                <TextField
                  label="Name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  required
                />
              </div>
              <DialogActions>
                <Button
                  onClick={() => setOpenAddDialog(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Create Product
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            {productToEdit && (
              <form onSubmit={handleEditSubmit}>
                <div style={{ marginTop: "15px" }}>
                  <TextField
                    label="Name"
                    name="name"
                    value={productToEdit.name}
                    onChange={(e) =>
                      setProductToEdit({
                        ...productToEdit,
                        name: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                </div>
                <div style={{ marginTop: "10px" }}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={productToEdit.price}
                    onChange={(e) =>
                      setProductToEdit({
                        ...productToEdit,
                        price: Number(e.target.value),
                      })
                    }
                    fullWidth
                    required
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={productToEdit.stock}
                    onChange={(e) =>
                      setProductToEdit({
                        ...productToEdit,
                        stock: Number(e.target.value),
                      })
                    }
                    fullWidth
                    required
                  />
                </div>

                <DialogActions>
                  <Button
                    onClick={() => setOpenEditDialog(false)}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Save Changes
                  </Button>
                </DialogActions>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </Box>

      <Grid container spacing={4} sx={{ padding: "20px" }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <StyledCard>
              {product.images?.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000/${product.images[0]}`}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "16px" }}
                >
                  Price: ${product.price}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "16px" }}
                >
                  Stock: {product.stock}
                </Typography>
                <Box sx={{ marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginRight: "10px" }}
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const StyledCard = styled(Card)({
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    transform: "translateY(-10px)",
    transition: "all 0.3s ease-in-out",
  },
});

export default ProductPage;
