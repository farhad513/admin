import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_url } from "../../utils/utils";

export const add_banner = createAsyncThunk(
  "banner/add_banner",
  async (info, { fulfillWithValue, rejectWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${api_url}/api/site-banner/add`,
        info,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const update_banner = createAsyncThunk(
  "banner/update_banner",
  async (
    { id, info },
    { fulfillWithValue, rejectWithValue, getState }
  ) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${api_url}/api/site-banner/update/${id}`,
        info,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_banner = createAsyncThunk(
  "banner/get_banner",
  async (id, { fulfillWithValue, rejectWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/site-banner/get/${id}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data || { message: "Error fetching banner" });
    }
  }
);

export const delete_banner = createAsyncThunk(
  "banner/delete_banner",
  async (id, { fulfillWithValue, rejectWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.delete(
        `${api_url}/api/site-banner/delete/${id}`,
        config
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error);
      // error.response থাকতে নাও পারে, তাই safe check দিন:
      return rejectWithValue(error.response.data)

    }
  }
);



export const get_banners = createAsyncThunk(
  "banner/get_banners",
  async (_, { fulfillWithValue, rejectWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/site-banner/get-banners`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const bannerReducer = createSlice({
  name: "category",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    banners: [],
    banner: "",
    totalBanner: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [add_banner.pending]: (state, _) => {
      state.loader = true;
    },
    [add_banner.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.message;
    },
    [add_banner.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.banner = payload.banner;
    },
    [get_banner.pending]: (state, { payload }) => {
      state.banner = null; 
      state.loader = true;
    },
    [get_banner.fulfilled]: (state, { payload }) => {
      state.banner = payload; 
      state.loader = false;
    },
    [get_banner.rejected]: (state,action) => {
      state.banner = null; 
      state.errorMessage = action.error?.message || "Network Error or Unknown Error";
      state.loader = false;
    },
    [get_banners.fulfilled]: (state, { payload }) => {
      state.banners = payload.banners;
      state.totalBanner = payload.totalBanner;
    },
    [update_banner.pending]: (state, _) => {
      state.loader = true;
    },
    [update_banner.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.message;
    },
    [update_banner.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.banner = payload.banner;
    },
    [delete_banner.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    
  },
});
export const { messageClear } = bannerReducer.actions;
export default bannerReducer.reducer;
