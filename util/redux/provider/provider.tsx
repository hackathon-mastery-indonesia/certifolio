'use client'
import {persistor, store} from '../store/store';
import { Provider } from 'react-redux';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
//SELESAI
export default function ReduxProvider({children}: { children:React.ReactNode}){
    return <Provider store={store} >
        <PersistGate persistor={persistor} loading={null}>{children}</PersistGate></Provider>;
}