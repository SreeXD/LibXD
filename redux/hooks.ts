import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { RootType, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector