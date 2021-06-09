import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    filename: "",
    content: null
};


export const profilePhotoSlice = createSlice({
    name: 'profilePhoto',
    initialState,
    reducers: {
        set: (state, action) => {
            state.filename = action.payload.filename;
            state.content = action.payload.content;
        },
        reset: (state) => {
            state.filename = "";
            state.content = null;
        }
    }
});


export const { set, reset } = profilePhotoSlice.actions;
export default profilePhotoSlice.reducer;
