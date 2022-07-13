import React, { useEffect } from 'react';
import './App.sass';
import { Outlet, useNavigate } from "react-router-dom";

function App(): JSX.Element {
    const navigate = useNavigate()
    const userID = localStorage.getItem("userID")

    useEffect((): void => {
        userID === null && window.location.pathname !== "/register"
            ? navigate("/login", { replace: true })
            : navigate("/chat", { replace: true })
    }, [userID])

    const header = (): JSX.Element =>
        window.location.pathname === "/chat"
            ? <></>
            : <h1 className="App-header">Chat App</h1>

    return (
        <div className="App">
            { header() }
            <div className="App-content">
                <Outlet/>
            </div>
        </div>
    )
}

export default App;
