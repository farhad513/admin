import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_url } from "../../utils/utils";

export const get_hospital_request = createAsyncThunk(
  "hospital/get_hospital_request",
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
        `${api_url}/api/request-hospital-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_hospital = createAsyncThunk(
  "hospital/get_hospital",
  async (hospitalId, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/get-hospital/${hospitalId}`,
        config
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const hospital_status_update = createAsyncThunk(
  "hospital/hospital_status_update",
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${api_url}/api/hospital-status-update`,
        info,
        config
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_active_hospitals = createAsyncThunk(
  "hospital/get_active_hospitals",
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
        `${api_url}/api/get-hospitals?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_deactive_hospitals = createAsyncThunk(
  "hospital/get_deactive_hospitals",
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
        `${api_url}/api/get-deactive-hospitals?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        config
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const hospitalReducer = createSlice({
  name: "hospital",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    hospitals: [],
    totalHospital: 0,
    hospital: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [get_hospital_request.fulfilled]: (state, { payload }) => {
      state.hospitals = payload.hospitals;
      state.totalHospital = payload.totalHospital;
    },
    [get_hospital.fulfilled]: (state, { payload }) => {
      state.hospital = payload.hospital;
    },
    [hospital_status_update.fulfilled]: (state, { payload }) => {
      state.hospital = payload.hospital;
      state.successMessage = payload.message;
    },
    [get_deactive_hospitals.fulfilled]: (state, { payload }) => {
      state.hospitals = payload.hospitals;
      state.totalHospital = payload.totalHospital; // এইটা যোগ করো
      state.successMessage = payload.message;
    },

    [get_active_hospitals.fulfilled]: (state, { payload }) => {
      state.hospitals = payload.hospitals;
      state.totalHospital = payload.totalHospital;
    },
  },
});
export const { messageClear } = hospitalReducer.actions;
export default hospitalReducer.reducer;
