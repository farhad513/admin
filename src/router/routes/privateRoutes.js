import {adminRoutes} from './admin.routes'
import {hospitalRoutes} from './hospital.Routes'

export const privateRoutes = [
    ...adminRoutes,
    ...hospitalRoutes
]