import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import jwt from 'jwt-decode'
import axios from 'axios'
import { api_url } from '../../utils/utils'

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await axios.post(`${api_url}/api/admin-login`, info)
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const hospital_login = createAsyncThunk(
    'auth/hospital_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await axios.post(`${api_url}/api/hospital-login`, info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue }) => {
        try {
            //const { data } = await axios.get('/logout', { withCredentials: true })
            localStorage.removeItem('accessToken')
            if (role === 'admin') {
                navigate('/admin/login')
            } else {
                navigate('/login')
            }
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const hospital_register = createAsyncThunk(
    'auth/hospital_register',
    async (info, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const { data } = await axios.post(`${api_url}/api/hospital-register`, info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const profile_image_upload = createAsyncThunk(
    'auth/profile_image_upload',
    async (image, { rejectWithValue, fulfillWithValue, getState }) => {

        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${api_url}/api/profile-image-upload`, image, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add',
    async (info, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.post(`${api_url}/api/profile-info-add`, info, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_all_users = createAsyncThunk(
    'auth/get_all_users',
    async ( params,   { rejectWithValue, fulfillWithValue, getState }) => {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }, params 
      };
      try {
        const { data } = await axios.get(`${api_url}/api/all-users`, config);
        console.log(data, "data")
        return fulfillWithValue(data);
      } catch (error) {
        console.log(error, "error")
        
        return rejectWithValue(error.response.data);
      }
    }
  );
  


export const get_user_info = createAsyncThunk(
    'auth/get_user_info',
    async (_, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`${api_url}/api/get-user`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const returnRole = (token) => {
    if (token) {
        const decodeToken = jwt(token)
        const expireTime = new Date(decodeToken.exp * 1000)
        if (new Date() > expireTime) {
            localStorage.removeItem('accessToken')
            return ''
        } else {
            return decodeToken.role
        }
    } else {
        return ''
    }
}


export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: returnRole(localStorage.getItem('accessToken')),
        token: localStorage.getItem('accessToken'),
        totalUsers : 0,
        users  : []
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [admin_login.pending]: (state, _) => {
            state.loader = true
        },
        [admin_login.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [admin_login.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.token = payload.token
            state.role = returnRole(payload.token)
        },
        [hospital_login.pending]: (state, _) => {
            state.loader = true
        },
        [hospital_login.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [hospital_login.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.token = payload.token
            state.role = returnRole(payload.token)
        },
        [hospital_register.pending]: (state, _) => {
            state.loader = true
        },
        [hospital_register.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [hospital_register.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.token = payload.token
            state.role = returnRole(payload.token)
        },
        [get_user_info.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.userInfo = payload.userInfo
            state.role = payload.userInfo.role
        },
        [profile_image_upload.pending]: (state, _) => {
            state.loader = true
        },
        [profile_image_upload.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.userInfo = payload.userInfo
            state.successMessage = payload.message
        },
        [profile_image_upload.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [profile_info_add.pending]: (state, _) => {
            state.loader = true
        },
        [profile_info_add.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.userInfo = payload.userInfo
            state.successMessage = payload.message
        },
        [profile_info_add.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [get_all_users.pending]: (state, _) => {
            state.loader = true
        },
        [get_all_users.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.totalUsers = payload.totalUsers
            state.successMessage = payload.message
            state.users = payload.users
        },
        [get_all_users.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
    }

})
export const { messageClear } = authReducer.actions
export default authReducer.reducer