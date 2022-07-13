import React, { SyntheticEvent, useEffect, useState } from "react";
import { userRoomsRequest, newRoomRequest, searchUsersRequest } from '../services/chatServices'
import { IRoom, ISearchUsers, IUsersBoard } from "../types/chatTypes";

function UsersBoard(props: IUsersBoard): JSX.Element {
    const userID = props.userID
    const socket = props.socket

    const [rooms, setRooms] = useState<IRoom[] | []>([])
    const [roomsJSX, setRoomsJSX] = useState<JSX.Element[] | JSX.Element>()

    const [searchUsers, setSearchUsers] = useState<ISearchUsers[] | []>([])
    const [searchJSX, setSearchJSX] = useState<JSX.Element[] | JSX.Element>()

    const roomsJSXCreator = (): JSX.Element[] | JSX.Element =>
        rooms?.map((room: IRoom, id: number) => {
            const roommate = room.users.filter(user => user._id !== userID)[0].username
                return (
                    <div className="userBoard-users-user" onClick={ () => joinRoom(room.room, roommate) } key={ id }>
                    <img className="userBoard-users-user-image" alt=""/>
                    <div className="userBoard-users-user-name">
                        { roommate }
                    </div>
                </div>
                )
            }
        )

    const searchJSXCreator = (): JSX.Element[] =>
        searchUsers?.map((user: ISearchUsers, id: number) =>
            <div className="userBoard-search-results-user" onClick={ () => { createRoom(user); setSearchUsers([]) } } key={ id }>
                <img className="userBoard-search-results-user-image" alt=""/>
                <div className="userBoard-search-results-user-name">
                    { user.username }
                </div>
            </div>
        )

    const onUserSearch = (e: SyntheticEvent) => {
        e.preventDefault()

        const input = e.target as typeof e.target & { value: string }
        const username = input.value

        username === ""
            ? setSearchUsers([])
            : searchUsersRequest(username)
                .then(response => response.data)
                .then(users => {
                    const newUsers = users.filter((newUser: ISearchUsers) => {
                        let match = false

                        rooms.forEach(room => {
                            room.users.forEach(user => {
                                if (user._id === newUser._id) match = true
                            })
                        })

                        return !match
                    })

                    setSearchUsers(newUsers)
                })
                .catch(() => setSearchUsers([]))
    }

    function socketOnConnect(): void {
        socket.on("connect", () => {
            userRooms()
        })
    }

    function userRooms() {
        userRoomsRequest(userID)
            .then(response => response.data)
            .then(rooms => {
                const roomsByLastActivity = rooms.rooms.sort((a: IRoom, b: IRoom) => (new Date(a.lastMessageSent) < new Date(b.lastMessageSent)) ? 1 : -1)
                setRooms(roomsByLastActivity)
            })
    }

    function createRoom(targetUser: ISearchUsers): void {
        const targetUserID = targetUser._id
        const targetUsername = targetUser.username

        newRoomRequest(userID, targetUserID)
            .then(response => response.data)
            .then(room => {
                joinRoom(room.roomID, targetUsername)
                userRooms()
            })
            .catch(error => {
                if (error.response.data.message === "Room already exists") {
                    const room = rooms.filter((room: IRoom) => room.users[0]._id === targetUserID || room.users[1]._id === targetUserID)

                    joinRoom(room[0].room, targetUsername)
                }
            })
    }

    function joinRoom(room: string, roommate: string): void {
        localStorage.setItem("roommate", roommate)
        socket.emit('joinRoom', room)
    }

    useEffect((): void => {
        socketOnConnect()
    }, [])

    useEffect((): void => {
        setRoomsJSX(roomsJSXCreator())
    }, [rooms])

    useEffect((): void => {
        setSearchJSX(searchJSXCreator())
    }, [searchUsers])

    return (
        <div className="userBoard">
            <div className="userBoard-search">
                <div className="userBoard-search-form">
                    <input className="userBoard-search-form-input" type="text" placeholder="Username"
                           onChange={ onUserSearch }/>
                </div>
                <div className="userBoard-search-results">
                    { searchJSX }
                </div>
            </div>
            <div className="userBoard-users">
                { roomsJSX }
            </div>
        </div>
    )
}

export default UsersBoard