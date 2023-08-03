export interface User {
  id: string;
  username?: string;
  userId: string;
  connectionStatus: 'online' | 'offline';
}

const activeUsers = new Map<string, User>();

// Adding a user
export function addUser(user: User) {
  activeUsers.set(user.id, user);
}

// Removing a user
export function removeUser(userId: string) {
  activeUsers.delete(userId);
}

// Getting all online users
export function getOnlineUsers(): User[] {
  return Array.from(activeUsers.values()).filter((user) => user.connectionStatus === 'online');
}
