import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { api_url } from '../../utils/utils'

export const get_admin_appoinments = createAsyncThunk(
    'appoinment/get_admin_appoinments',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {

        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`${api_url}/api/admin/appoinments?page=${page}&searchValue=${searchValue}&parPage=${parPage}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_hospital_appoinments = createAsyncThunk(
    'order/get_hospital_appoinments',
    async ({ parPage, page, searchValue, hospitalId }, { rejectWithValue, fulfillWithValue, getState }) => {

        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`${api_url}/api/hospital/appoinments/${hospitalId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_admin_appoinment = createAsyncThunk(
    'appoinment/get_admin_appoinment',
    async (appoinmentId, { rejectWithValue, fulfillWithValue, getState }) => {

        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`${api_url}/api/admin/appoinment/${appoinmentId}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_hospital_appoinment = createAsyncThunk(
    'appoinment/get_hospital_appoinment',
    async (appoinmentId, { rejectWithValue, fulfillWithValue, getState }) => {

        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`${api_url}/api/hospital/appoinment/${appoinmentId}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const admin_appoinment_status_update = createAsyncThunk(
    'appoinment/admin_appoinment_status_update',
    async ({ appoinmentId, info }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.put(`${api_url}/api/admin/appoinment-status/update/${appoinmentId}`, info, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)




export const hospital_appoinment_status_update = createAsyncThunk(
    'appoinment/hospital_appoinment_status_update',
    async ({ appoinmentId, info }, { rejectWithValue, fulfillWithValue, getState }) => {

        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.put(`${api_url}/api/hospital/appoinment-status/update/${appoinmentId}`, info, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const AppoinmentReducer = createSlice({
    name: 'appoinment',
    initialState: {
        successMessage: '',
        errorMessage: '',
        totalAppoinments: 0,
        appoinment: {},
        myAppoinments: [],
        loading : false
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [get_admin_appoinments.pending]: (state, { payload }) => {
            state.loading = true
        },
        [get_admin_appoinments.fulfilled]: (state, { payload }) => {
            state.myAppoinments = payload.appointments
            state.totalAppoinments = payload.totalAppointments
            state.loading = false;
        },
        [get_admin_appoinment.pending]: (state, { payload }) => {
            state.loading = true
        },
        [get_admin_appoinment.fulfilled]: (state, { payload }) => {
            state.appoinment = payload.appoinment
        },
        
        [admin_appoinment_status_update.rejected]: (state, { payload }) => {
            state.errorMessage = payload.message
        },
        [admin_appoinment_status_update.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        },
        [get_hospital_appoinments.fulfilled]: (state, { payload }) => {
            state.myAppoinments = payload.appoinments
            state.totalAppoinments = payload.totalAppoinments
        },
        [get_hospital_appoinment.fulfilled]: (state, { payload }) => {
            state.appoinment = payload.appoinment
        },
        [hospital_appoinment_status_update.rejected]: (state, { payload }) => {
            state.errorMessage = payload.message
        },
        [hospital_appoinment_status_update.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        },
    }

})
export const { messageClear } = AppoinmentReducer.actions
export default AppoinmentReducer.reducer