import authReducer from './Reducers/authReducer'
import categoryReducer from './Reducers/categoryReducer'
import doctorReducer from './Reducers/doctorReducer'
import hospitalReducer from './Reducers/hospitalReducer'
import chatReducer from './Reducers/chatReducer'
import AppoinmentReducer from './Reducers/AppoinmentReducer'
import PaymentReducer from './Reducers/PaymentReducer'
import dashboardIndexReducer from './Reducers/dashboardIndexReducer'
import bannerReducer from './Reducers/bannerReducer'
import  blogReducer  from './Reducers/blogReducer'
import  ambulanceReducer  from './Reducers/ambulanceReducer'

const rootReducer = {
    auth: authReducer,
    category: categoryReducer,
    doctor: doctorReducer,
    hospital: hospitalReducer,
    chat: chatReducer,
    appoinment: AppoinmentReducer,
    payment: PaymentReducer,
    dashboardIndex: dashboardIndexReducer,
    banner : bannerReducer,
    blog: blogReducer,
    ambulance : ambulanceReducer
}
export default rootReducer