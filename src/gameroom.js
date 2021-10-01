import React, { useEffect, useState, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { generateMistmap } from './gameUtils';
import fb from './fbFunc';

import Game from './game';

export default function GameRoom(props) {
  const { isGameRoomHidden, selfRef, roomInfo } = props;
  const { room, name } = selfRef.current;

  const targetRoomInfo = roomInfo[room];

  const host = targetRoomInfo?.users?.[0] || '';
  const isHost = name === host;

  const [ selfJob, setSelfJob ] = useState('');

  const selfInfoRef = useRef();
  selfInfoRef.current = {
    'job': selfJob,
    room,
  };


  const [ cardNumIpt, setCardNum ] = useState(30);
  const [ bombNumIpt, setBombNum ] = useState(1);
  const [ blueFirstChk, setBlueFirst ] = useState(true);
  const [ ing, setIng ] = useState(false);

  const [ mistmap, setMistmap ] = useState({
    'imgList': [],
    'blueList': [],
    'redList': [],
    'dieList': [],
    'peopleList': [],
  });

  const [ b1, setB1 ] = useState({});
  const [ b2, setB2 ] = useState({});
  const [ r1, setR1 ] = useState({});
  const [ r2, setR2 ] = useState({});

  const grpStateTable = {
    'blue1': b1,
    'blue2': b2,
    'red1': r1,
    'red2': r2,
  };
  const grpStateTableRef = useRef();
  grpStateTableRef.current = grpStateTable;

  const join = (e) => {
    const { grp } = e.target.dataset;

    setSelfJob((pre) => {
      if (pre !== grp) {
        if (pre !== '') {
          const preMap = grpStateTableRef.current[pre].usersMap;
          fb.del(`/clue/${room}/${pre}/${preMap[name]}`);
        }
        fb.append(name, `/clue/${room}/${grp}`);
      }

      return grp;
    });
  };

  const start = () => {
    fb.write(blueFirstChk ? 0 : 3, `/clue/${room}/actionStatus`)
      .then(() => {
        const _mistmap = generateMistmap({
          'generateTotal': cardNumIpt,
          'dieNum': bombNumIpt,
          'first': blueFirstChk ? 'blue' : 'red',
          'firstNum': Math.floor(cardNumIpt / 3) + 1,
        });
        fb.write([], `/clue/${room}/open`);

        return fb.write({
          'all': JSON.stringify(_mistmap.imgList),
          'die': JSON.stringify(_mistmap.dieList),
          'blue': JSON.stringify(_mistmap.blueList),
          'red': JSON.stringify(_mistmap.redList),
          'people': JSON.stringify(_mistmap.peopleList),
        }, `/clue/${room}/mistmap`);
      })
      .then(() => {
        fb.write(1, `/clue/${room}/ing`);
      });
  };
  const reconfig = () => {
    fb.write(0, `/clue/${room}/ing`)
      .then(() => {
        setIng(false);
      });
  };

  useEffect(() => {
    let cancelCb = () => null;

    if (room !== -1 && selfJob !== '') {
      const _targetMap = grpStateTableRef.current[selfJob].usersMap;

      cancelCb = fb.disconnect(null, `/clue/${room}/${selfJob}/${_targetMap[name]}`);
    }

    return () => cancelCb();
  }, [ room, selfJob ]);

  useEffect(() => {
    const beforeunloadEvent = () => {
      const _job = selfInfoRef.current.job;

      if (room !== -1 && _job !== '') {
        const _targetMap = grpStateTableRef.current[_job].usersMap;

        fb.del(`/clue/${room}/${_job}/${_targetMap[name]}`);
      }
    };
    window.addEventListener('beforeunload', beforeunloadEvent);

    let unbindB1 = () => null;
    let unbindB2 = () => null;
    let unbindR1 = () => null;
    let unbindR2 = () => null;
    let unbindIng = () => null;
    let unbindMistmap = () => null;
    if (room !== -1) {
      unbindB1 = onValue(ref(window.db, `/clue/${room}/blue1`), (snapshot) => {
        const v = fb.idFormatter(snapshot);
        if (v.users.length === 0) {
          fb.write(0, `/clue/${room}/ing`);
        }
        setB1(v);
      });
      unbindB2 = onValue(ref(window.db, `/clue/${room}/blue2`), (snapshot) => {
        const v = fb.idFormatter(snapshot);
        if (v.users.length === 0) {
          fb.write(0, `/clue/${room}/ing`);
        }
        setB2(v);
      });
      unbindR1 = onValue(ref(window.db, `/clue/${room}/red1`), (snapshot) => {
        const v = fb.idFormatter(snapshot);
        if (v.users.length === 0) {
          fb.write(0, `/clue/${room}/ing`);
        }
        setR1(v);
      });
      unbindR2 = onValue(ref(window.db, `/clue/${room}/red2`), (snapshot) => {
        const v = fb.idFormatter(snapshot);
        if (v.users.length === 0) {
          fb.write(0, `/clue/${room}/ing`);
        }
        setR2(v);
      });
      unbindIng = onValue(ref(window.db, `/clue/${room}/ing`), (snapshot) => {
        const v = Boolean(snapshot.val() || 0);
        setIng(v);
      });
      unbindMistmap = onValue(ref(window.db, `/clue/${room}/mistmap`), (snapshot) => {
        const v = snapshot.val();
        const _mistmap = {
          'imgList': JSON.parse(v?.all || '[]'),
          'blueList': JSON.parse(v?.blue || '[]'),
          'redList': JSON.parse(v?.red || '[]'),
          'dieList': JSON.parse(v?.die || '[]'),
          'peopleList': JSON.parse(v?.people || '[]'),
        };
        setMistmap(_mistmap);
      });
    }

    return () => {
      beforeunloadEvent();
      window.removeEventListener('beforeunload', beforeunloadEvent);
      unbindB1();
      unbindB2();
      unbindR1();
      unbindR2();
      unbindIng();
      unbindMistmap();
    };
  }, []);

  if (room === -1 || isGameRoomHidden) {
    return null;
  }

  const isB1Full = (false && b1?.users?.length >= 2) || ing;
  const isB2Full = (false && b2?.users?.length >= 2) || ing;
  const isR1Full = (false && r1?.users?.length >= 2) || ing;
  const isR2Full = (false && r2?.users?.length >= 2) || ing;

  const isPeopleReady = b1?.users?.length >= 1
  && b2?.users?.length >= 1
  && r1?.users?.length >= 1
  && r2?.users?.length >= 1
  && (bombNumIpt <= 4);

  const isLock = ing || !isHost;

  return (
    <div className='gameroom'>
      <div className='roomInfo'>
        <div className='team'>
          <div className='teamB'>
            <div onClick={isB1Full ? null : join} data-grp='blue1'>
              <span className='label'>提示</span>
              {b1?.users?.map?.((n) => <span className={n === name ? 'isSelf' : ''} key={n}>{n}</span>)}
            </div>
            <div onClick={isB2Full ? null : join} data-grp='blue2'>
              <span className='label'>猜測</span>
              {b2?.users?.map?.((n) => <span className={n === name ? 'isSelf' : ''} key={n}>{n}</span>)}
            </div>
          </div>

          <div className='configuration'>
            <div>
              <div>
                <span>Room:</span>
                <span>{room}</span>
              </div>
              <div>
                <span>Host:</span>
                <span>
                  {host}
                  {isHost && '(You)'}
                </span>
              </div>
            </div>

            {isHost && (
            <div>
              <div>
                <span>總卡片數量</span>
                <span>
                  <input disabled={isLock} type='text' value={cardNumIpt} onChange={(e) => setCardNum(e.target.value)} />
                </span>
              </div>
              <div>
                <span>炸彈數量</span>
                <span>
                  <input disabled={isLock} type='text' value={bombNumIpt} onChange={(e) => setBombNum(e.target.value)} />
                </span>
              </div>
              <div>
                <span>藍先</span>
                <span>
                  <input disabled={isLock} type='checkbox' checked={blueFirstChk} onChange={(e) => setBlueFirst(e.target.checked)} />
                </span>
              </div>
            </div>
            )}

            {isHost && (
            <div>
              {isPeopleReady && !isLock && (
                <div>
                  <button disabled={cardNumIpt > 100} onClick={start}>開始</button>
                </div>
              )}
              {ing && (
                <div>
                  <button onClick={reconfig}>重來</button>
                </div>
              )}
            </div>
            )}
          </div>

          <div className='teamR'>
            <div onClick={isR1Full ? null : join} data-grp='red1'>
              {r1?.users?.map?.((n) => <span className={n === name ? 'isSelf' : ''} key={n}>{n}</span>)}
              <span className='label'>提示</span>
            </div>
            <div onClick={isR2Full ? null : join} data-grp='red2'>
              {r2?.users?.map?.((n) => <span className={n === name ? 'isSelf' : ''} key={n}>{n}</span>)}
              <span className='label'>猜測</span>
            </div>
          </div>
        </div>
      </div>

      {ing && <Game {...props} selfJob={selfJob} first={blueFirstChk ? 'blue' : 'red'} mistmap={mistmap} />}
    </div>
  );
}
