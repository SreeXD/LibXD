import axios from 'axios'

export const signIn = (credentials: any) => axios.post('/api/user/signIn', credentials)
export const signOut = () => axios.post('/api/user/signOut')
export const signUp = (credentials: any) => axios.post('/api/user/create', credentials)
export const fetchCurrentUser = () => axios.get('/api/user/current')