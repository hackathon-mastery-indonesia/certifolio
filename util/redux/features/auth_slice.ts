import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../next_models/user';

const initialState: User = {
    authClient: null,
    identity: null,
    actor: null,
    contract: null,
    isVerified: false,
    username: null,
};

export const auth = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logout: () => initialState,
        login: (state, action: PayloadAction<User>) => {
            const { authClient, identity, actor, username, contract, } = action.payload;
            state.authClient = authClient;
            state.identity = identity;
            state.contract = contract;
            state.actor = actor;
            state.username = username;
        },
    },
});

export const { login, logout } = auth.actions;
const authReducer = auth.reducer;
export default authReducer;


