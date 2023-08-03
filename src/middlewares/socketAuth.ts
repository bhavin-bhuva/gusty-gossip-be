import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export function socketJwt(socket: Socket, next) {
  const token: string = socket.handshake.query.token as string;
  if (!token) {
    return next(new Error('Authentication error: Token not provided.'));
  }

  jwt.verify(token, process.env.JWT!, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token.'));
    }

    // Attach the decoded token payload to the socket object for further use
    socket['decoded'] = decoded;
    next();
  });
}
