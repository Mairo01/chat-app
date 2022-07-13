function socketIo(io) {
    io.on("connection", socket => {
        socket.on('joinRoom', (roomID: string) => {
            socket.rooms.forEach((roomID: string) =>
                socket.leave(roomID))

            socket.join(roomID)
            socket.emit("joinedRoom", roomID)
        })

        socket.on("private message", ({ message, sender, roomID }) => {
            io.to(roomID).emit("private message", {
                message,
                sender: { username: sender },
                roomID,
            })
        })
        console.log(`Connection established with ${ io.engine.clientsCount } clients`)
    })

    io.engine.on("connection_error", e => {
        console.log(e.message)
    })
}

export default socketIo
