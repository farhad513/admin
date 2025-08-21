import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_url } from "../../utils/utils";

export const AmbulanceAdd = createAsyncThunk(
    "ambulance/AmbulanceAdd",
    async (formData, { rejectWithValue, fulfillWithValue, getState }) => {
      const token = getState().auth.token; // Get token from the state
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      };
  
      try {
        const { data } = await axios.post(`${api_url}/api/ambulance/ambulance-add`, formData, config);
        return fulfillWithValue(data);
      } catch (error) {
        return rejectWithValue(error.response.data); // Handle error
      }
    }
  );

export const AmbulanceDelete = createAsyncThunk(
  "blog/AmbulanceDelete",
  async (id, { rejectWithValue, fulfillWithValue, getState }) => {
    console.log(id, "id");
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.delete(
        `${api_url}/api/ambulance/delete-ambulance/${id}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const GetAmbulance = createAsyncThunk(
  "ambulance/GetAmbulance",
  async (ambulanceId, { rejectWithValue, fulfillWithValue, getState }) => {
   
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/ambulance/get-ambulance/${ambulanceId}`,
        config
      );
      console.log(data, "data")
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const admin_ambulance_get = createAsyncThunk(
  "ambulance/admin_ambulance_get",
  async (ambulanceId, { rejectWithValue, fulfillWithValue, getState }) => {
   
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/ambulance/admin-get-ambulance/${ambulanceId}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetAmbulances = createAsyncThunk(
  "ambulance/GetAmbulances",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/ambulance/ambulance-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const AdminGetAmbulances = createAsyncThunk(
  "ambulance/AdminGetAmbulances",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/ambulance/get-ambulances?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const update_ambulance = createAsyncThunk(
  "ambulance/update_ambulance",
  async (ambulanceData, { rejectWithValue, fulfillWithValue, getState }) => {
    console.log(ambulanceData, "ambulanceData")
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${api_url}/api/ambulance/update-ambulance`,
        ambulanceData,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const ambulance_image_update = createAsyncThunk(
  "ambulance/image_update",
  async (
    { oldImage, newImage, ambulanceId },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const formData = new FormData();
      formData.append("oldImage", oldImage);
      formData.append("newImage", newImage);
      formData.append("ambulanceId", ambulanceId);

      const { data } = await axios.post(
        `${api_url}/api/ambulance/image-update`,
        formData,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const admin_ambulance_status_update = createAsyncThunk(
  'appoinment/admin_ambulance_status_update',
  async ({ ambulanceId,status }, { rejectWithValue, fulfillWithValue, getState }) => {
    console.log(ambulanceId, status)
      const token = getState().auth.token
      const config = {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      }

      try {
          const { data } = await axios.put(`${api_url}/api/ambulance/ambulance-status/update/${ambulanceId}`,  status,config)
          console.log(data)
          return fulfillWithValue(data)
      } catch (error) {
          return rejectWithValue(error.response.data)
      }
  }
)

export const ambulanceReducer = createSlice({
  name: "ambulance",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    ambulances: [],
    totalAmbulance: 0,
    ambulance: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [AmbulanceAdd.pending]: (state, _) => {
      state.loader = true;
    },
    [AmbulanceAdd.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [AmbulanceAdd.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.ambulance = [...state.ambulance, payload.ambulance];
    },
    [GetAmbulance.pending]: (state, _) => {
      state.loader = true;
    },
    [GetAmbulance.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [GetAmbulance.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.ambulance = payload.ambulance;
    },
    [admin_ambulance_get.pending]: (state, _) => {
      state.loader = true;
    },
    [admin_ambulance_get.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [admin_ambulance_get.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.ambulance = payload.ambulance;
    },
    [update_ambulance.pending]: (state, _) => {
      state.loader = true;
    },
    [update_ambulance.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [update_ambulance.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.ambulance = payload.ambulance;
      state.successMessage = payload.message;
    },
    
    [AmbulanceDelete.pending]: (state, _) => {
      state.loader = true;
    },
    [AmbulanceDelete.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [AmbulanceDelete.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [GetAmbulances.fulfilled]: (state, { payload }) => {
      state.totalAmbulance = payload.totalAmbulance;
      state.ambulances = payload.ambulances;
    },
    [AdminGetAmbulances.fulfilled]: (state, { payload }) => {
      state.totalAmbulance = payload.totalAmbulance;
      state.ambulances = payload.ambulances;
    },
    [ambulance_image_update.fulfilled]: (state, { payload }) => {
      state.ambulance = payload.ambulance;
      state.successMessage = payload.message;
    },
    [admin_ambulance_status_update.fulfilled]: (state, { payload }) => {
     
      state.successMessage = payload.message;
    },
    [admin_ambulance_status_update.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
  },
});
export const { messageClear } = ambulanceReducer.actions;
export default ambulanceReducer.reducer;
