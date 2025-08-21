import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { api_url } from '../../utils/utils'

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('image', image)
            const { data } = await axios.post(`${api_url}/api/category-add`, formData, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const categoryEdit = createAsyncThunk(
    'category/categoryEdit',
    async ({ id, name, image }, { rejectWithValue, fulfillWithValue, getState }) => {
        console.log(id)
        const token = getState().auth.token;
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('name', name);
            if (image) formData.append('image', image); // Only append image if it's provided

            const { data } = await axios.put(`${api_url}/api/category-edit/${id}`, formData, config);

            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const categoryDelete = createAsyncThunk(
    'category/categoryDelete',
    async (id, { rejectWithValue, fulfillWithValue, getState }) => {
        console.log(id)
      const token = getState().auth.token;
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
  
      try {
        const { data } = await axios.delete(`${api_url}/api/category-delete/${id}`, config);
        return fulfillWithValue(data); // Return the response data on success
      } catch (error) {
        return rejectWithValue(error.response.data); // Return the error message on failure
      }
    }
  );
  
export const get_category = createAsyncThunk(
    'category/get_category',
    async (_, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`${api_url}/api/category/get`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categorys: [],
        totalCategory: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [categoryAdd.pending]: (state, _) => {
            state.loader = true
        },
        [categoryAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.categorys = [...state.categorys, payload.category]
        },
        [categoryEdit.pending]: (state, _) => {
            state.loader = true
        },
        [categoryEdit.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryEdit.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [categoryDelete.pending]: (state, _) => {
            state.loader = true
        },
        [categoryDelete.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryDelete.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_category.fulfilled]: (state, { payload }) => {
            state.categorys = payload
        },
    }

})
export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer