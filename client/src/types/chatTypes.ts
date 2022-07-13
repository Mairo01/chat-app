interface IGetMessage {
    message: string
    sender: {
        _id: string
        username: string
    }
    roomID: string
}

interface ISendMessage {
    message: string
    sender: string
    roomID: string
}

interface IMessagesProps {
    username: string
    userID: string
    socket: any
    url: string
}

interface IRoom {
    room: string
    users: {
        _id: string
        username: string
    }[]
    lastMessage: string
    lastMessageSent: string
}

interface IUsersBoard {
    username: string
    socket: any
    userID: string
    url: string
}

interface IUsersControls {
    username: string
    userID: string
}

interface ISearchUsers {
    username: string
    _id: string
}

export type {
    IGetMessage,
    ISendMessage,
    IMessagesProps,
    IRoom,
    IUsersControls,
    IUsersBoard,
    ISearchUsers
}