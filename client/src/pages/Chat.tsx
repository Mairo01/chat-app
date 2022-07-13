import { io } from "socket.io-client";
import Messages from "../components/Messages";
import UsersBoard from "../components/UsersBoard";
import UserControls from "../components/UserControls";

function Chat(): JSX.Element {
    const userID: string = localStorage.getItem("userID") as string
    const username: string = localStorage.getItem("username") as string
    const URL: string = process.env.REACT_APP_PROXY as string
    const socket = io(URL, {})

    return (
        <div className="chat">
            <UserControls userID={ userID } username={ username }/>
            <UsersBoard socket={ socket } url={ URL } userID={ userID } username={ username }/>
            <Messages socket={ socket } url={ URL } userID={ userID } username={ username }/>
        </div>
    )
}

export default Chat