import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Chat from "./pages/Chat";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={ <App/> }>
                <Route path="/chat" element={ <Chat/> }/>
                <Route path="/register" element={ <Register/> }/>
                <Route path="/login" element={ <Login/> }/>
                <Route path="*" element={ <NotFound/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)
