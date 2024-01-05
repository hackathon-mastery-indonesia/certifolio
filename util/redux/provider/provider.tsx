'use client'
import { store} from '../store/store';
import { Provider } from 'react-redux';
import React from 'react';
//import { PersistGate } from 'redux-persist/integration/react';
//<PersistGate persistor={persistor} loading={null}>
//</PersistGate>
//SELESAI
export default function ReduxProvider({children}: { children:React.ReactNode}){
    return <Provider store={store} >
        {children}</Provider>;
}