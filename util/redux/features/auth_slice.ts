import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../next_models/user';

const initialState: User = {
    authClient: null,
    identity: null,
    contract: null
};

export const auth = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logout: () => initialState,
        login: (state, action: PayloadAction<User>) => {
            const { authClient, identity, contract } = action.payload;
            state.authClient = authClient;
            state.identity = identity;
            state.contract = contract;
        },
    },
});

export const { login, logout } = auth.actions;
const authReducer = auth.reducer;
export default authReducer;


