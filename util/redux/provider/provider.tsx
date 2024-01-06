'use client'
import { persistor, store} from '../store/store';
import { Provider } from 'react-redux';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
//import { PersistGate } from 'redux-persist/integration/react';
//<PersistGate persistor={persistor} loading={null}>
//</PersistGate>
//SELESAI
export default function ReduxProvider({children}: { children:React.ReactNode}){
    return <Provider store={store} > <PersistGate loading={null} persistor={persistor}> {children}</PersistGate>
        </Provider>;
}