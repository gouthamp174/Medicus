import { configureStore } from '@reduxjs/toolkit';

import { saveSession } from "./sessionStorage.js";
import sessionSlice from './slices/sessionSlice';
import profilePhotoSlice from './slices/profilePhotoSlice';


export const store = configureStore({
    reducer: {
        session: sessionSlice,
        profilePhoto: profilePhotoSlice
    },
});

export const unsubscribe = store.subscribe(() => {
    const currentSession = store.getState().session;
    saveSession(currentSession);
});
