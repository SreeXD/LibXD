import { configureStore, combineReducers } from '@reduxjs/toolkit'

import userSlice from './features/userSlice'

const store = configureStore({
    reducer: combineReducers({
        user: userSlice.reducer
    }),

    devTools: true
})

export type RootType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store