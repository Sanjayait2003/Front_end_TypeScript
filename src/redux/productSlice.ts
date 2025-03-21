import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Fetch products from API
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get<Product[]>('http://localhost:5000/api/products');
  return response.data;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string, { dispatch }) => {
  dispatch(removeProductOptimistic(id));
  
  await axios.request({
    method: 'DELETE',
    url: 'http://localhost:5000/api/products/delete',
    data: { id },
  });

  return id;
});

export const addProduct = createAsyncThunk('products/addProduct', async (product: Product) => {
  const response = await axios.post<Product>('http://localhost:5000/api/products', product);
  return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product: Product, { dispatch }) => {
  dispatch(updateProductOptimistic(product));

  const response = await axios.put<Product>(`http://localhost:5000/api/products/${product._id}`, product);

  return response.data;
});

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    removeProductOptimistic: (state, action) => {
      state.products = state.products.filter((product) => product._id !== action.payload);
    },

    updateProductOptimistic: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex((product) => product._id === updatedProduct._id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load products';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.products.findIndex((product) => product._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      });
  },
});

export const { removeProductOptimistic, updateProductOptimistic } = productsSlice.actions;

export default productsSlice.reducer;
