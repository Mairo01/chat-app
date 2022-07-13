import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { IGetMessage, IMessagesProps } from "../types/chatTypes";
import { sendMessageRequest, messagesRequest } from '../services/chatServices'

function Messages(props: IMessagesProps): JSX.Element {
    const senderName = props.username
    const senderID = props.userID
    const socket = props.socket

    const [roomID, setRoomID] = useState<string>("")
    const [messageInput, setMessageInput] = useState<string>("")
    const [messageHistory, setMessageHistory] = useState<IGetMessage[]>([])
    const [messagesJSX, setMessagesJSX] = useState<JSX.Element[] | JSX.Element>()

    const lastMessageRef = useRef<HTMLDivElement>(null)
    const scrollToLastMessage = (): void => lastMessageRef.current?.scrollIntoView()

    const errorMessage = (message: string) =>
        ({
            sender: { username: "Server", _id: "server" },
            message: message,
            roomID: roomID
        })


    const onMessageSubmit = (e: SyntheticEvent): void => {
        e.preventDefault()

        if (messageInput === "") return
        setMessageInput(messageInput.trim())

        sendMessageRequest({
            message: messageInput,
            sender: senderID,
            roomID: roomID
        })
            .then(() => {
                socket.emit("private message", {
                    message: messageInput,
                    sender: senderName,
                    roomID: roomID
                })
            })
            .catch(() => {
                setMessageHistory([ ...messageHistory, errorMessage("Error sending the message") ])
            })

        setMessageInput("")
    }

    const messagesJSXCreator = (): JSX.Element[] | JSX.Element =>
        messageHistory?.map((message: IGetMessage, id: number) =>
               <div className="messages-msgs-msg" key={ id }>
                    <div className="messages-msgs-msg-details">
                        <div className="messages-msgs-msg-details-name">{ message.sender.username }</div>
                        <div className="messages-msgs-msg-details-time"></div>
                    </div>
                    <div className="messages-msgs-msg-text">
                        { message.message }
                    </div>
               </div>
        )

    function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        e.key === "Enter" && !e.shiftKey && onMessageSubmit(e)
        e.key === "Enter" && e.shiftKey && setMessageInput(
            (messageInput + "\n").replace(/(\r?\n|\r)(?!.*\1)/g, "")
        )
    }

    function socketOnJoinedRoom(): void {
        socket.on("joinedRoom", (roomID: string): void => {
            setRoomID(roomID)

            messagesRequest(roomID as string)
                .then(response => response.data)
                .then(messages => setMessageHistory(messages))
                .catch(() => {
                    setMessageHistory([ ...messageHistory, errorMessage("Error retrieving messages") ])
                })
        })
    }

    function socketOnPrivateMessage(): void {
        socket.on("private message", (message: IGetMessage): void => {
            setMessageHistory([ ...messageHistory, message ])
        })
    }

    useEffect((): void => {
        socketOnJoinedRoom()
    }, [])

    useEffect((): void => {
        socketOnPrivateMessage()
        setMessagesJSX(messagesJSXCreator())
    }, [messageHistory])

    useEffect((): void => {
        scrollToLastMessage()
    }, [messagesJSX])

    return (
        <div className="messages">
            <div className="messages-bar">
                <div className="messages-bar-menu" onClick={ () => {} }> </div>
                <div className="messages-bar-roommate">{ localStorage.getItem("roommate")}</div>
            </div>

            <div className="messages-msgs">
                { messagesJSX }
                <div className="messages-msgs-msg-last" ref={ lastMessageRef }/>
            </div>

            <form className="messages-form" onSubmit={ onMessageSubmit }>
                <textarea rows={ 3 } cols={ 1 } className="messages-form-inputMsg"
                          onKeyPress={ handleEnter }
                          onChange={ e => setMessageInput(e.target.value) }
                          value={ messageInput }
                />
            </form>

        </div>
    )
}

export default Messages