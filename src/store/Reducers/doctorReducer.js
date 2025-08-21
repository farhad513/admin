import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { api_url } from '../../utils/utils'

export const add_doctor = createAsyncThunk(
    'doctor/add_doctor',
    async (doctor, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${api_url}/api/doctor-add`, doctor, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const update_doctor = createAsyncThunk(
    'doctor/updateProduct',
    async (doctor, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${api_url}/api/doctor-update`, doctor, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const doctor_image_update = createAsyncThunk(
    'doctor/doctor_image_update',
    async ({ oldPublicId, newImage,  doctorId }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const formData = new FormData()
            formData.append('oldPublicId', oldPublicId)
            formData.append('newImage', newImage)
            formData.append('doctorId', doctorId)
            const { data } = await axios.post(`${api_url}/api/doctor-image-update`, formData, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_doctors = createAsyncThunk(
    'doctor/get_doctors',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        console.log(config)
        try {
            const { data } = await axios.get(`${api_url}/api/doctors-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const delete_doctor = createAsyncThunk(
    'doctor/delete_doctor',
    async (doctorId, { rejectWithValue, fulfillWithValue, getState }) => {
      const token = getState().auth.token;  
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      };  
      console.log(doctorId)
      try {
        const { data } = await axios.delete(`${api_url}/api/doctor-delete/${doctorId}`, config);
        return fulfillWithValue(data); 
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );


export const get_doctor = createAsyncThunk(
    'doctor/get_doctor',
    async (doctorId, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`${api_url}/api/doctor-get/${doctorId}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const get_all_doctor_admin = createAsyncThunk(
  "home/get_all_doctor_admin",
  async (query, { fulfillWithValue, rejectWithValue,getState }) => {
    console.log(query, "query");
const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    // Start building the URL
    let url = `${api_url}/api/doctors-get-admin?page=${query.page}&parPage=${query.parPage}`;

    // Conditionally add filters to the URL if they're defined
    if (query.division) url += `&division=${query.division}`;
    if (query.district) url += `&district=${query.district}`;
    if (query.upazila) url += `&upazila=${query.upazila}`;
    if (query.category) url += `&category=${query.category}`;
    if (query.searchValue) url += `&searchValue=${query.searchValue}`;

    try {
      const { data } = await axios.get(url,config);
      console.log(data, "data");
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data || error.response);
    }
  }
);



export const doctorReducer = createSlice({
    name: 'doctor',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        doctors: [],
        doctor: '',
        totalDoctor: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [add_doctor.pending]: (state, _) => {
            state.loader = true
        },
        [add_doctor.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [add_doctor.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_doctors.fulfilled]: (state, { payload }) => {
            state.totalDoctor = payload.totalDoctor
            state.doctors = payload.doctors
        },
        [get_doctor.fulfilled]: (state, { payload }) => {
            state.doctor = payload.doctor
        },
        [update_doctor.pending]: (state, _) => {
            state.loader = true
        },
        [update_doctor.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [update_doctor.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.doctor = payload.doctor
            state.successMessage = payload.message
        },
        [doctor_image_update.fulfilled]: (state, { payload }) => {
            state.doctor = payload.doctor
            state.successMessage = payload.message
        },
        [get_all_doctor_admin.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [get_all_doctor_admin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.doctors = payload?.doctors;
      state.totalDoctor = payload?.totalDoctor;
    },
    }

})
export const { messageClear } = doctorReducer.actions
export default doctorReducer.reducer