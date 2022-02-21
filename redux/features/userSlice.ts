import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import * as userApi from '../../api/user'

interface UserState {
    userId?: string,
    email?: string,
    name?: string,
    status: 'none' | 'progress' | 'success' | 'failed',
    errorMessage?: string
}

interface UserData {
    userId: string,
    email: string,
    name: string,
}

interface RejectType {
    message: string
}

interface SignInCredentials {
    userId: string,
    password: string
}

interface SignUpCredentials {
    userId: string,
    email: string
    name: string,
    password: string
}

const signInUser = createAsyncThunk<UserData, SignInCredentials, { rejectValue: RejectType }>('user/signIn', async (credentials, ThunkAPI) => {
    try {
        const res = await userApi.signIn(credentials)

        if (res.status == 200) {
            return {
                userId: res.data.userId,
                email: res.data.email,
                name: res.data.name
            } as UserData
        }

        else {
            return ThunkAPI.rejectWithValue({ message: res.data.message } as RejectType)
        }
    }

    catch (error: any) {
        return ThunkAPI.rejectWithValue({ message: ((error.response && error.response.data.message) || error.message) } as RejectType)
    }
})

const signUpUser = createAsyncThunk<void, SignUpCredentials, { rejectValue: RejectType }>('user/signUp', async (credentials, ThunkAPI) => {
    try {
        const res = await userApi.signUp(credentials)

        if (res.status == 200) {
            return 
        }

        else {
            return ThunkAPI.rejectWithValue({ message: res.data.message } as RejectType)
        }
    }

    catch (error: any) {
        return ThunkAPI.rejectWithValue({ message: ((error.response && error.response.data.message) || error.message) } as RejectType)
    }
})

const signOutUser = createAsyncThunk<void, void, { rejectValue: RejectType }>('user/signOut', async (_, ThunkAPI) => {
    try {
        const res = await userApi.signOut()

        if (res.status == 200) {
            return 
        }

        else {
            return ThunkAPI.rejectWithValue({ message: res.data.message } as RejectType)
        }
    }
    
    catch (error: any) {
        return ThunkAPI.rejectWithValue({ message: ((error.response && error.response.data.message) || error.message) } as RejectType)
    }
})

const getCurrentUser = createAsyncThunk<UserData, void, { rejectValue: RejectType }>('user/getCurrentUser', async (_, ThunkAPI) => {
    try {
        const res = await userApi.fetchCurrentUser()

        if (res.status == 200) {
            return {
                userId: res.data.userId,
                email: res.data.email,
                name: res.data.name
            }
        }

        else {
            return ThunkAPI.rejectWithValue({ message: res.data.message } as RejectType)
        }
    }

    catch (error: any) {
        return ThunkAPI.rejectWithValue({ message: ((error.response && error.response.data.message) || error.message) } as RejectType)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        status: 'none'
    } as UserState,

    reducers: { },

    extraReducers: (builder) => {
        builder.addCase(signInUser.pending, (state, action) => {
            return { status: 'progress',  }
        })

        builder.addCase(signInUser.fulfilled, (state, action) => {
            return { status: 'success', ...action.payload }
        })

        builder.addCase(signInUser.rejected, (state, action) => {
            return { status: 'failed', errorMessage: action.payload && action.payload.message }
        }) 

        builder.addCase(signUpUser.pending, (state, action) => {
            return { status: 'progress' }
        })

        builder.addCase(signUpUser.fulfilled, (state, action) => {
            return { status: 'success' }
        })

        builder.addCase(signUpUser.rejected, (state, action) => {
            return { status: 'failed', errorMessage: action.payload && action.payload.message }
        })

        builder.addCase(signOutUser.pending, (state, action) => {
            return { status: 'progress' }
        })

        builder.addCase(signOutUser.fulfilled, (state, action) => {
            return { status: 'success' }
        })

        builder.addCase(signOutUser.rejected, (state, action) => {
            return { status: 'failed', errorMessage: action.payload && action.payload.message }
        })
        
        builder.addCase(getCurrentUser.pending, (state, action) => {
            return { status: 'progress' }
        })

        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            return { status: 'success', ...action.payload }
        })

        builder.addCase(getCurrentUser.rejected, (state, action) => {
            return { status: 'failed' }
        })
    }
})

export type { UserState, UserData }

export { signInUser, signOutUser, signUpUser, getCurrentUser }

export default userSlice