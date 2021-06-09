import { createSlice } from '@reduxjs/toolkit';
import { loadSession } from "../sessionStorage";


const presistedSession = loadSession();
const initialState = (presistedSession !== undefined) ? presistedSession: {
    authToken: "",
    username: "",
    firstName: "",
    lastName: "",
    isPhysician: false,
    profilePhotoId: null
}


export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        set: (state, action) => {
            let isPhysician = state.isPhysician;
            if (action.payload.isPhysician !== undefined) {
                isPhysician = action.payload.isPhysician;
            }

            return {
                ...state,
                ...action.payload,
                isPhysician: Boolean(JSON.parse(isPhysician)) ? true: false
            }
        },
        reset: (state) => {
            state.authToken = "";
            state.username = "";
            state.firstName = "";
            state.lastName = "";
            state.isPhysician = false;
            state.profilePhotoId = null;
        }
    }
});


export const { set, reset } = sessionSlice.actions;
export default sessionSlice.reducer;
