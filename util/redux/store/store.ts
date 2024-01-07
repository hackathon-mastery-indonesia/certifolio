import {configureStore, combineReducers, } from '@reduxjs/toolkit';
import authReducer from '../features/auth_slice';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const persistConfig = {
  key: 'blockchain',
  storage,
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
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true
    })
})

//const persistor = persistStore(store)
//export  {persistor};
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store);

//export type RootState = ReturnType<typeof store.getState>;
//export type AppDispatch = ReturnType<typeof store.dispatch>;