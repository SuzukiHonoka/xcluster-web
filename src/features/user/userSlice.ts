import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   users: []
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        deleteUser: () => {
            // todo: delete request
        },
        modifyUser: () => {
            // todo: modify request
        }
    }
})

export const { deleteUser, modifyUser } = userSlice.actions 

export default userSlice.reducer