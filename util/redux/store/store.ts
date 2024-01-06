import {configureStore, combineReducers, } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth_slice';
import { persistReducer, persistStore } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
  key: 'root',
  storage:storageSession,
  // Konfigurasi lainnya jika diperlukan
};



const rootReducer = combineReducers({
    auth: authReducer,
 
  });

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

//const persistedReducer = persistReducer(persistConfig, rootReducer);

//SELESAI
export const store = configureStore({
    reducer: persistedReducer,
})

//const persistor = persistStore(store)
//export  {persistor};
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store);

//export type RootState = ReturnType<typeof store.getState>;
//export type AppDispatch = ReturnType<typeof store.dispatch>;