/* eslint-disable no-console */
import { Server as SocketIOServer, Socket } from 'socket.io';
import { User, addUser, removeUser, getOnlineUsers } from '../common/online-users';

export const SocketServer = (io: SocketIOServer) => {
  // connections
  io.on('connection', (socket: Socket) => {
    const user: User = {
      id: socket.id,
      userId: socket['decoded']._id, // You should set this to the user's actual session ID
      connectionStatus: 'online',
    };

    // register new online users
    addUser(user);
    io.emit('onlineUsers', getOnlineUsers());

    // Handling messages from clients
    socket.on('message', (data: any) => {
      console.log('Received message:', data);
      // Broadcast the message to all connected clients except the sender
      socket.broadcast.emit('message', data);
    });

    // Handling disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      user.connectionStatus = 'offline';
      removeUser(user.id);
      io.emit('onlineUsers', getOnlineUsers());
    });
  });

  io.on('message', (data: any) => {
    console.log('Received message:', data);
    // Broadcast the message to all connected clients except the sender
    io.emit('message', data);
  });
};
