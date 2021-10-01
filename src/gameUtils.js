
const totalImages = 483;

function randomSort(array) {
  const promoteArr = [ ...array ].sort(() => Math.random() - 0.5);
  const removeDupli = [ ...new Set(promoteArr) ];

  return removeDupli;
}

export function generateMistmap({
  first = 'blue',
  generateTotal = 30,
  dieNum = 1,
  firstNum = 11,
}) {
  const blueNum = first === 'blue' ? firstNum : firstNum - 1;
  const redNum = first === 'red' ? firstNum : firstNum - 1;
  const peopleNum = generateTotal - blueNum - redNum - dieNum;

  const _imgSet = new Set();

  while (_imgSet.size < generateTotal) {
    _imgSet.add(Math.floor(Math.random() * totalImages) + 1);
  }

  const imgList = [ ..._imgSet ];

  const randomImgList = randomSort([ ...imgList ]);
  const blueList = randomImgList.splice(0, blueNum);
  const redList = randomImgList.splice(0, redNum);
  const dieList = randomImgList.splice(0, dieNum);
  const peopleList = randomImgList;

  return {
    imgList,
    blueList,
    redList,
    dieList,
    peopleList,
  };
}


export function judgeIdentity({
  id,
  blueSet,
  redSet,
  dieSet,
  peopleSet,
  openList,
  skyEyes,
}) {
  const isOpen = new Set(openList).has(id) || skyEyes;
  if (!isOpen) {
    return '';
  }
  if (blueSet.has(id)) {
    return ' blueCard';
  }
  if (redSet.has(id)) {
    return ' redCard';
  }
  if (dieSet.has(id)) {
    return ' dieCard';
  }
  if (peopleSet.has(id)) {
    return ' peopleCard';
  }

  return '';
}
