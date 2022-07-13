import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IUsersControls } from "../types/chatTypes";

function UserControls(props: IUsersControls): JSX.Element {
    const username = props.username
    const userID = props.userID
    const navigate = useNavigate()

    const [profileVisible, setProfileVisible] = useState<boolean>(false)

    function onLogOut() {
        localStorage.clear()
        navigate("/login", { replace: true })
    }

    const profileJSX = () =>
        profileVisible
            ? <div className="userControls-profile-window">
                <div className="userControls-profile-window-content">
                    <div className="userControls-profile-window-close" onClick={ () => setProfileVisible(!profileVisible) }>
                        Close
                    </div>
                    <div className="userControls-profile-window-username">
                        <p>Username</p>
                        <p>{ username }</p>
                    </div>
                    <div className="userControls-profile-window-userID">
                        <p>User ID</p>
                        <p>{ userID }</p>
                    </div>
                </div>
            </div>
            : <></>

    return (
        <div className="userControls">
            { profileJSX() }
            <div className="userControls-profile" onClick={ () => setProfileVisible(!profileVisible) }>Profile</div>
            <div className="userControls-logout" onClick={ () => onLogOut() }>Log Out</div>
        </div>
    )
}

export default UserControls