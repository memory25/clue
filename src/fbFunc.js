import { ref, push, set, get, child, remove, onDisconnect } from 'firebase/database';


function del(key) {
  return remove(ref(window.db, key));
}

function append(data, key) {
  return push(ref(window.db, key), data);
}

function write(data, key) {
  return set(ref(window.db, key), data);
}

function read(key) {
  return get(child(window.dbRef, key)).then((snapshot) => {
    if (snapshot.exists()) {
      // console.log(snapshot.val());
    }
    else {
      // console.log('No data available');
    }

    return snapshot.val();
  }).catch((error) => {
    // console.error(error);
  });
}


function idFormatter(snapshot) {
  const users = snapshot.val() || {};
  const keys = Object.keys(users);
  const values = Object.values(users);
  const usersMap = {
    ...users,
  };
  values.forEach((v, i) => {
    usersMap[v] = keys[i];
  });

  return {
    'users': values,
    'usersKeys': keys,
    usersMap,
  };
}

function disconnect(data, key) {
  const _disconnectRef = onDisconnect(ref(window.db, key));
  _disconnectRef.set(data);

  return _disconnectRef.cancel.bind(_disconnectRef);
}


const fb = {
  write,
  read,
  append,
  del,
  idFormatter,
  disconnect,
};

export default fb;


const clue = {
  'room': [ 1 ],
  '1': {
    'users': {
      'id1': 'B',
      'id2': 'A',
      'id3': 'C',
    },

    'blue1': '/users/',
    'blue2': '/users/',
    'red1': '/users/',
    'red2': '/users/',

    'ing': 0, // 0 | 1
    'actionStatus': 0,
    'msg': '',

    'mistmap': {
      'all': [ 1, 3, 4, 6, 7, 9 ],
      'die': [ 4 ],
      'blue': [ 6, 7 ],
      'red': [ 3, 9 ],
      'people': [ 1 ],
    },
    'open': [ 1, 2, 3, 4 ],
  },
};

/*
status
0 - blue captain input
1 - red captain confirm
2 - blue member select

3 - red captain input
4 - blue captain confirm
5 - red member select
*/
