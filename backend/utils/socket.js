import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5174",
                "https://job-portal-f-az3p.onrender.com",
                process.env.FRONTEND_URL || "*",
            ],
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.on("connection", (socket) => {
        // Authenticate/identify user from auth payload or handshake query
        const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;

        if (userId) {
            const userRoom = `user_${userId}`;
            socket.join(userRoom);
        }

        // Allow explicit room joining
        socket.on("join_user_room", (id) => {
            if (id) {
                const room = `user_${id}`;
                socket.join(room);
            }
        });

        // Allow explicit room leaving
        socket.on("leave_user_room", (id) => {
            if (id) {
                const room = `user_${id}`;
                socket.leave(room);
            }
        });

        socket.on("disconnect", (reason) => {
            // Disconnected gracefully
        });
    });

    return io;
};

export const getIO = () => {
    return io;
};

/**
 * Emit an event to a specific user's private room
 * @param {string|ObjectId} userId
 * @param {string} event
 * @param {object} data
 */
export const emitToUser = (userId, event, data) => {
    if (!io) return;
    const room = `user_${userId.toString()}`;
    io.to(room).emit(event, data);
};

/**
 * Emit an event to all connected clients
 * @param {string} event
 * @param {object} data
 */
export const emitToAll = (event, data) => {
    if (!io) return;
    io.emit(event, data);
};
