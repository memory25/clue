import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, onDisconnect } from 'firebase/database';

import { fbConfig } from './appConst';
import fb from './fbFunc';

import GameRoom from './gameroom';
import Roombar from './roombar';


window.version = 'ver: 0929 0221';

export default function App(props) {
  const [ roomList, setRoomList ] = useState([]);
  const [ roomInfo, setRoomInfo ] = useState({});
  const roomInfoRef = useRef(null);
  roomInfoRef.current = roomInfo;
  const [ self, setSelf ] = useState({
    'room': -1,
    'name': '',
  });
  const selfRef = useRef(null);
  selfRef.current = self;

  const [ go, setGo ] = useState('picker');

  const leaveRoom = useCallback((isUnmount = false) => {
    const { room, name } = selfRef.current;

    if (room !== -1) {
      const _usersMap = roomInfoRef.current[room].usersMap;
      fb.del(`/clue/${room}/users/${_usersMap[name]}`)
        .then(() => {
          if (!isUnmount) {
            setSelf({
              'room': -1,
              'name': '',
            });
          }
        });
    }
  }, []);

  useEffect(() => {
    const { room, name } = selfRef.current;
    let cancelCb = () => null;
    if (room !== -1) {
      const _usersMap = roomInfoRef.current[room].usersMap;
      cancelCb = fb.disconnect(null, `/clue/${room}/users/${_usersMap[name]}`);
    }

    return () => cancelCb();
  }, [ self.room ]);

  useEffect(() => {
    initializeApp(fbConfig);

    const db = getDatabase();
    const dbRef = ref(db);
    window.db = db;
    window.dbRef = dbRef;


    fb.read('/clue/room').then((_room) => {
      setRoomList(_room);

      _room.forEach((n) => {
        onValue(ref(db, `/clue/${n}/users`), (snapshot) => {
          const idFormat = fb.idFormatter(snapshot);

          setRoomInfo((pre) => ({
            ...pre,
            [n]: idFormat,
          }));
        });
      });
    });

    window.addEventListener('beforeunload', () => leaveRoom(true));
  }, []);

  const isGameRoomHidden = go !== 'gameroom';
  const isRoombarHidden = go !== 'picker';

  return window.db ? (
    <>
      <div style={{ 'position': 'absolute', 'zIndex': 9999, 'display': 'flex' }}>
        <div onClick={() => setGo('picker')}> 選房 </div>
        {self.room !== -1 && <div className='ml-3' onClick={() => setGo('gameroom')}> 遊戲房 </div>}
        {go !== 'picker' && (
          <div
            className='ml-3'
            onClick={() => {
              leaveRoom();
              setGo('picker');
            }}
          >
            離開
          </div>
        )}
      </div>
      {self.room !== -1 && <GameRoom key={self.room} selfRef={selfRef} roomInfo={roomInfo} isGameRoomHidden={isGameRoomHidden} />}
      {!isRoombarHidden && <Roombar roomList={roomList} roomInfo={roomInfo} self={self} setSelf={setSelf} setGo={setGo} leaveRoom={leaveRoom} />}
    </>
  ) : null;
}
