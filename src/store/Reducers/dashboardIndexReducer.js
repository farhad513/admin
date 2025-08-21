import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_url } from "../../utils/utils";

export const get_hospital_dashboard_index_data = createAsyncThunk(
  "dashboardIndex/get_hospital_dashboard_index_data",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/hospital/get-dashboard-index-data`,
        config
      );
      console.log(data, "data");
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error, "error");
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_admin_dashboard_index_data = createAsyncThunk(
  "dashboardIndex/get_admin_dashboard_index_data",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/admin/get-dashboard-index-data`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const dashboardIndexReducer = createSlice({
  name: "dashboardIndex",
  initialState: {
    totalPendingAppoinment: 0,
    totalAppoinment: 0,
    totalDoctor: 0,
    completeAppoinment: 0,
    recentAppoinments: [],
    totalHospital: 0,
    totalUser: 0,
    loading: false,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [get_hospital_dashboard_index_data.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [get_hospital_dashboard_index_data.fulfilled]: (state, { payload }) => {
      state.totalDoctor = payload.totalDoctor;
      state.totalAppoinment = payload.totalAppoinment;
      state.completeAppoinment = payload.totalCompleteAppoinment;
      state.totalPendingAppoinment = payload.totalPendingAppoinment;
      state.recentAppoinments = payload.recentAppoinments;
      state.loading = false;
    },
    [get_hospital_dashboard_index_data.rejected]: (state, { payload }) => {
      state.loading = false;
    },
    [get_admin_dashboard_index_data.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [get_admin_dashboard_index_data.fulfilled]: (state, { payload }) => {
      state.totalDoctor = payload.totalDoctor;
      state.totalAppoinment = payload.totalAppoinment;
      state.totalHospital = payload.totalHospital;
      state.recentAppoinments = payload.recentAppoinments;
      state.totalUser = payload.totalUser;
      state.loading = false;
    },
    [get_admin_dashboard_index_data.rejected]: (state, { payload }) => {
      state.loading = false;
    },
  },
});
export const { messageClear } = dashboardIndexReducer.actions;
export default dashboardIndexReducer.reducer;
