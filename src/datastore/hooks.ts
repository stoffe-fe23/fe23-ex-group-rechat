/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Redux Hooks boilerplate.  
*/
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';

// Enable using AsyncThunks as dispatch actions
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();