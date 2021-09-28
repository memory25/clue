import React, { useState, useEffect } from 'react';
import fb from './fbFunc';


const userName = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ];

export default function Room(props) {
  const { roomList, roomInfo, self, setSelf, setGo, leaveRoom } = props;
  const [ isLock, setIsLock ] = useState(false);

  const handleRoomOnClick = (e) => {
    setIsLock(true);

    leaveRoom();

    const num = Number(e.target.dataset.roomid);

    const targetRoomInfo = roomInfo[num];

    const targetUserSet = new Set(targetRoomInfo.users);
    const selfName = userName.filter((n) => !targetUserSet.has(n))[0];

    fb.append(selfName, `/clue/${num}/users`)
      .then(() => {
        setSelf({
          'room': num,
          'name': selfName,
        });
        setGo('gameroom');
      });
  };

  useEffect(() => {
    if (isLock) {
      setTimeout(() => {
        setIsLock(false);
      }, 500);
    }
  }, [ isLock ]);

  return (
    <div className='roomWrapper'>
      {roomList.map((n) => (
        <div
          key={n}
          data-roomid={n}
          className='roombar'
          onClick={self.room !== n && !isLock ? handleRoomOnClick : null}
          tabIndex='-1'
          role='button'
          style={{
            'background': roomInfo[n]
              ? `linear-gradient(to right, red, red ${roomInfo[n].users.length * 5}%, transparent ${roomInfo[n].users.length * 10}%)`
              : 'transparent',
            'opacity': self.room === n ? 0.6 : 1,
          }}
        >
          {n}
        </div>
      ))}
    </div>
  );
}
