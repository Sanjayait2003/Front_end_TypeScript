import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from "./redux/productSlice";
import { RootState } from "./redux/store";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  Fab,
  Typography,
} from "@mui/material";
import { Edit, Delete, AddCircle, PhotoCamera } from "@mui/icons-material"; // Import icons
import axios from "axios";
import { AppDispatch } from "./redux/store";
import { Product } from "./redux/productSlice";

// Apply a custom theme to your components if desired
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#d32f2f",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h6: {
      fontWeight: 600,
      color: "#333",
    },
    body1: {
      fontWeight: 400,
    },
  },
});

const ProductDataTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const rows = products.map((product) => ({
    id: product._id,
    ...product,
  }));

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    images: [] as string[],
    files: [] as File[],
  });

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "stock", headerName: "Stock", width: 150 },
    {
      field: "images",
      headerName: "Images",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
<div style={{ display: "flex", flexWrap: "wrap" }}>
  {params.row.images &&
    params.row.images.map((imageUrl: string, index: number) => {
      const fixedImageUrl = imageUrl.replace(/\\/g, "/");
      return (
        <img
          key={index}
          src={`http://localhost:5000/${fixedImageUrl}`}  // Corrected URL format
          alt={`Product ${params.row.id} image ${index + 1}`}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            marginRight: "5px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      );
    })}
</div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: "flex", gap: "15px" }}>
          <Tooltip title="Update Product">
            <IconButton
              color="primary"
              onClick={() => handleEdit(params.row)}
              sx={{ "&:hover": { color: "white", backgroundColor: "#1976d2" } }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton
              color="secondary"
              onClick={() => handleDelete(params.row.id)}
              sx={{ "&:hover": { color: "white", backgroundColor: "#d32f2f" } }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await axios.request({
        method: "DELETE",
        url: "http://localhost:5000/api/products/delete",
        data: { id },
      });

      dispatch(deleteProduct(id));
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.files.length === 0) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price.toString());
    formData.append("stock", newProduct.stock.toString());

    newProduct.files.forEach((file) => {
      formData.append("images", file);
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
        dispatch(addProduct(response.data));
        setNewProduct({ name: "", price: 0, stock: 0, images: [], files: [] });
        setOpenAddDialog(false);
      } else {
        console.error("No product data received", response);
      }
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (editProduct) {
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("price", editProduct.price.toString());
      formData.append("stock", editProduct.stock.toString());

      editProduct.images.forEach((image) => {
        formData.append("images", image); 
      });

      try {
        const response = await axios.put<Product>(
          `http://localhost:5000/api/products/${editProduct._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          dispatch(updateProduct(response.data));
          setEditProduct(null);
          setOpenEditDialog(false);
        } else {
          console.error("No product data received", response);
        }
      } catch (error) {
        console.error("Error updating product", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setOpenEditDialog(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files); // Convert FileList to Array
      const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));
  
      setNewProduct((prev) => ({
        ...prev,
        files: [...prev.files, ...selectedFiles], // Append selected files
        images: imageUrls, // Update image preview URLs
      }));
    }
  };
  

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Management
        </Typography>

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          onClick={() => setOpenAddDialog(true)}
        >
          <AddCircle />
        </Fab>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Create Product</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: +e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
              Upload Image
              <input type="file" multiple onChange={(e) => handleImageChange(e)} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddProduct} color="primary">
              Create Product
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Update Product</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={editProduct?.name || ""}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={editProduct?.price || 0}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={editProduct?.stock || 0}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
              Upload Image
              <input type="file" multiple onChange={handleImageChange} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} color="primary">
              Update Product
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            sx={{
              boxShadow: 2,
              borderRadius: 2,
              "& .MuiDataGrid-cell": {
                fontSize: "14px",
                padding: "10px",
                transition: "all 0.2s ease-in-out",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f1f1",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1976d2",
                color: "black",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
          />
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default ProductDataTable;
