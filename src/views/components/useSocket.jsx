// src/components/useSocket.js

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export const useSocket = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeHospitals, setActiveHospitals] = useState([]);
  const [adminStatus, setAdminStatus] = useState(false);

  useEffect(() => {
    socket.on('activeUser', (users) => setActiveUsers(users));
    socket.on('activeHospital', (hospitals) => setActiveHospitals(hospitals));
    socket.on('activeAdmin', (data) => setAdminStatus(data.status));

    return () => {
      socket.off('activeUser');
      socket.off('activeHospital');
      socket.off('activeAdmin');
    };
  }, []);

  return { socket, activeUsers, activeHospitals, adminStatus };
};
