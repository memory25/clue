import React, { useMemo, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import {  judgeIdentity } from './gameUtils';
import fb from './fbFunc';

const actionStatus2Job = {
  '2': 'blue2',
  '5': 'red2',
};
const actionStatus2Text = {
  '0': '藍隊長想提示中',
  '1': '紅隊長確認中',
  '2': '藍隊猜測中',
  '3': '紅隊長想提示中',
  '4': '藍隊長確認中',
  '5': '紅隊猜測中',
};

export default function Game(props) {
  const { selfJob, selfRef, first, mistmap } = props;
  const { room } = selfRef.current;

  const [ skyEyes, setSkyEyes ] = useState(() => selfJob === 'blue1' || selfJob === 'red1');
  window.skyEyes = setSkyEyes;

  const {
    imgList,
    blueList,
    redList,
    dieList,
    peopleList,
  } = mistmap;

  const [ openList, setOpenList ] = useState([]);
  const [ selfOpen, setSelfOpen ] = useState(-1);
  const [ actionStatus, setActionStatus ] = useState(first === 'blue' ? 0 : 3);
  const [ msg, setMsg ] = useState('');
  const [ msgB, setMsgB ] = useState([]);
  const [ msgR, setMsgR ] = useState([]);
  const [ selectCount, setSelectCount ] = useState(0);

  const [ showConfirm, setShowConfirm ] = useState(false);

  const [ wordIpt, setWord ] = useState('');
  const [ numIpt, setNum ] = useState(1);


  const blueSet = useMemo(() => new Set(blueList), [ blueList ]);
  const redSet = useMemo(() => new Set(redList), [ redList ]);
  const dieSet = useMemo(() => new Set(dieList), [ dieList ]);
  const peopleSet = useMemo(() => new Set(peopleList), [ peopleList ]);
  const openSet = useMemo(() => new Set(openList), [ openList ]);

  const blueOpenSet = useMemo(() => {
    const _set = new Set();
    const _openSet = new Set(openList);
    blueList.forEach((id) => {
      if (_openSet.has(id)) {
        _set.add(id);
      }
    });

    return _set;
  }, [ openList ]);
  const redOpenSet = useMemo(() => {
    const _set = new Set();
    const _openSet = new Set(openList);
    redList.forEach((id) => {
      if (_openSet.has(id)) {
        _set.add(id);
      }
    });

    return _set;
  }, [ openList ]);


  const handleConfirmPassOnClick = () => {
    fb.write(actionStatus + 1, `/clue/${room}/actionStatus`)
      .then(() => {
        setShowConfirm(false);
      });
  };
  const handleConfirmRejectOnClick = () => {
    fb.write(actionStatus - 1, `/clue/${room}/actionStatus`)
      .then(() => {
        setShowConfirm(false);
      });
  };

  const handleCardOnClick = (id) => () => {
    if (!openSet.has(id)) {
      openSet.add(id);
      setSelfOpen(id);
      fb.write([ ...openSet ], `/clue/${room}/open`)
        .then(() => {
          setSelectCount((pre) => pre + 1);
        });
    }
  };

  const handlePrompClick = () => {
    const _actionStatus = actionStatus === 5 ? 0 : actionStatus + 1;

    let _numIpt = numIpt;
    if (numIpt < 1) {
      _numIpt = 1;
    }
    if (numIpt > blueList.length) {
      _numIpt = blueList.length;
    }

    fb.write(_actionStatus, `/clue/${room}/actionStatus`);
    fb.write(`${wordIpt}, ${_numIpt}`, `/clue/${room}/msg`);
  };


  useEffect(() => {
    if (actionStatus === 1 && selfJob === 'red1') {
      setShowConfirm(true);
    }
    if (actionStatus === 2) {
      setMsgB((pre) => [ ...pre, msg ]);
    }
    if (actionStatus === 4 && selfJob === 'blue1') {
      setShowConfirm(true);
    }
    if (actionStatus === 5) {
      setMsgR((pre) => [ ...pre, msg ]);
    }
    setSelfOpen(-1);
    setSelectCount(0);
  }, [ actionStatus ]);

  useEffect(() => {
    const unbindOpen = onValue(ref(window.db, `/clue/${room}/open`), (snapshot) => {
      const v = snapshot.val() || [];

      setOpenList(v);
    });
    const unbindActionStatus = onValue(ref(window.db, `/clue/${room}/actionStatus`), (snapshot) => {
      const v = snapshot.val() || 0;

      setActionStatus(v);
    });
    const unbindMsg = onValue(ref(window.db, `/clue/${room}/msg`), (snapshot) => {
      const v = snapshot.val() || '';

      setMsg(v);
    });

    return () => {
      unbindOpen();
      unbindActionStatus();
      unbindMsg();
    };
  }, [ room ]);

  const msgSplit = msg.split(',');
  const maxSelectNum = Number(msgSplit[msgSplit.length - 1]) + 1;
  const isYourRound = actionStatus2Job[actionStatus] === selfJob;
  const isGuessStop = peopleSet.has(selfOpen) || (selfJob === 'blue2' ? redSet.has(selfOpen) : blueSet.has(selfOpen));
  const isDie = openList.some((id) => dieSet.has(id));
  const isGameOver = isDie || (blueOpenSet.size === blueSet.size) || (redOpenSet.size === redSet.size);
  const canSelect = isYourRound && (maxSelectNum > selectCount) && !isGuessStop && !isGameOver;


  const showPromp = (actionStatus === 0 && selfJob === 'blue1') || (actionStatus === 3 && selfJob === 'red1');

  return (
    <div className='game'>
      {showConfirm && (
      <div className='confirmWrapper'>
        <div className='confirm'>
          <span>{msg}</span>
          <button onClick={handleConfirmPassOnClick}>Pass v</button>
          <button onClick={handleConfirmRejectOnClick}>Reject x</button>
        </div>
      </div>
      )}
      {showPromp && (
      <div className='prompt'>
        <input value={wordIpt} onChange={(e) => setWord(e.target.value)} placeholder='Word' type='text' style={{ 'width': 60 }} />
        <input value={numIpt} onChange={(e) => setNum(e.target.value)} placeholder='Num' type='number' style={{ 'width': 45 }} />
        <button onClick={handlePrompClick} disabled={wordIpt === '' || Number(numIpt) === 0}>送出</button>
      </div>
      )}
      <div className='log'>
        <div className='logB'>
          <span style={{ 'background': 'rgb(136, 141, 251)', 'color': '#fff' }}>
            {blueOpenSet.size}
            /
            {blueSet.size}
          </span>
          {msgB.map((m, i) => <span key={i}>{m}</span>)}
        </div>
        <div className='logStatus'>
          {isYourRound && !isGameOver
            ? (
              <div className='selecting'>
                {canSelect && (
                  <span>
                    換你猜了
                    (
                    {selectCount}
                    /
                    {maxSelectNum}
                    )
                  </span>
                )}
                <button onClick={() => {
                  const _actionStatus = actionStatus === 5 ? 0 : actionStatus + 1;
                  fb.write(_actionStatus, `/clue/${room}/actionStatus`);
                }}
                >
                  結束回合
                </button>
              </div>
            ) : !showPromp && actionStatus2Text[actionStatus]}
          {isGameOver && <div>Game Over</div>}
        </div>
        <div className='logR'>
          <span style={{ 'background': 'rgb(248, 124, 128)', 'color': '#fff' }}>
            {redOpenSet.size}
            /
            {redSet.size}
          </span>
          {msgR.map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>
      <div className='cardWrapper'>
        {imgList.map((id) => (
          <div
            key={id}
            onClick={canSelect ? handleCardOnClick(id) : null}
            style={{ 'cursor': canSelect ? 'pointer' : 'not-allowed', 'opacity': openSet.has(id) ? 0.2 : 1 }}
            className={`card${judgeIdentity({
              id,
              blueSet,
              redSet,
              dieSet,
              peopleSet,
              openList,
              skyEyes,
            })} ${id}`}
          >
            <span className='serNum'>{id}</span>
            <img src={require(`./imgs/${id}.png`)} alt='' />
          </div>
        ))}
      </div>
    </div>
  );
}


/*
{ list.map((_, i) => (
  <div
    key={i}
    style={{
      'width': 50,
      'height': 50,
    // 'backgroundImage': `url(${require('./imgs/champion50.png')})`,
      'backgroundPosition': `0 ${i * -50}px`,
    }}
  >
    {1}
  </div>
)); }
*/
// <img src={require('./imgs/champion50.png')} alt='Background' />
