import axios from 'axios'

export const createOne = (student: any) => axios.post('/api/student/create', student)
export const borrowBook = (borrowDetails: any) => axios.post('/api/student/borrow', borrowDetails)
export const returnBook = (returnDetails: any) => axios.post('/api/student/return', returnDetails)
export const fetchInfo = (admNo: number) => axios.get(`/api/student/${admNo}`)

export const fetch = (params?: any) => axios.get('api/user/students', {
    params
})

export const fetchBorrowed = (admNo: number, params?: any) => axios.get(`/api/student/${admNo}/borrowed`, {
    params
})

export const fetchOverdue = (admNo: number) => axios.get(`/api/student/${admNo}/overdue`)