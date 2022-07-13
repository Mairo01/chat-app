import RoomModel from "./roomModel";
import { randomUUID } from "crypto";
import { ICreateRoom, IUserRooms } from "./roomTypes";
import ChatMessageModel from "../chat/chatMessageModel";

async function createRoom(req, res): Promise<void> {
    const { userID, targetUserID }: ICreateRoom = req.body
    const usersHaveRoom = () => RoomModel.exists({ users: { $all: [userID, targetUserID] } })

    if (!userID || !targetUserID) throw ("userID or targetUserID is missing")
    if (await usersHaveRoom()) throw ("Room already exists")

    const roomID = randomUUID()
    const room = new RoomModel({
        room: roomID,
        users: [userID, targetUserID]
    })

    await room.save()

    res.status(201).json({ roomID })
}

async function userRooms(req, res): Promise<void> {
    const { userID }: IUserRooms = req.body

    if (!userID) throw ("userID is missing")

    const rooms = await RoomModel.find({ users: userID })
        .select({ _id: false, room: true, users: true })
        .populate('users', 'username')

    const roomsWithMessage = await Promise.all(rooms.map(async room => {
        const lastMessage = await ChatMessageModel
            .findOne({ room: room.room })
            .sort({ createdAt: 'descending' })
            .select({ _id: false, message: true, createdAt: true })

        return {
            room: room.room,
            users: room.users,
            lastMessage: lastMessage?.message,
            lastMessageSent: lastMessage?.createdAt
        }
    }))

    res.status(200).json({ rooms: roomsWithMessage })
}

export default {
    userRooms,
    createRoom
}