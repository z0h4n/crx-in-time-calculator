import urlGenerator from 'Services/urlGenerator';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ERROR_MESSAGES = {
  systemGenerated: 'System generated',
  improperSequence: 'Bad Sequence'
};

function getAttendaceForDate(date = new Date()) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    const targetURL = urlGenerator(date.getDate(), MONTHS[date.getMonth()], date.getFullYear());
    xhr.open('GET', targetURL);

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Accept', 'text/javascript');

    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const { responseText } = this;
        resolve(responseText.trim() !== '' ? JSON.parse(responseText) : {});
      }
    };

    xhr.onerror = () => {
      resolve({});
    }

    xhr.ontimeout = () => {
      resolve({});
    }

    xhr.send();
  });
}

function extendSwipes(swipes = []) {
  return swipes.map((swipe, i) => {
    swipe.checked = true;
    swipe.dateObject = new Date(swipe.punchdatetime);
    swipe.errorMsg = swipe.dirtyflag
      ? ERROR_MESSAGES.systemGenerated
      : i !== 0 && swipe.inoutindicator === swipes[i - 1].inoutindicator
        ? ERROR_MESSAGES.improperSequence
        : '';
    return swipe;
  });
}

function processSwipes(swipes = []) {
  let totalTimeTillLastOut = 0;
  let lastInSwipe = null;
  const swipeCount = swipes.length;

  for (let i = 1; i < swipeCount; i += 1) {
    const swipe = swipes[i];
    if (swipe.checked && swipe.inoutindicator === 0) {
      for (let j = i - 1; j >= 0; j -= 1) {
        const swipe2 = swipes[j];
        if (swipe2 && swipe2.checked) {
          if (swipe2.inoutindicator === 1) {
            totalTimeTillLastOut += swipe.dateObject.getTime() - swipe2.dateObject.getTime();
          }
          break;
        }
      }
    }
  }

  for (let i = swipeCount - 1; i >= 0; i -= 1) {
    const swipe = swipes[i];
    if (swipe.checked) {
      if (swipe.inoutindicator === 1) {
        lastInSwipe = Object.assign({}, swipe);
      }
      break;
    }
  }

  return { totalTimeTillLastOut, lastInSwipe };
}

function onTick(totalTimeTillLastOut = 0, lastInSwipe = null) {
  if (lastInSwipe) {
    return totalTimeTillLastOut + (Date.now() - lastInSwipe.dateObject.getTime());
  }
  return totalTimeTillLastOut;
}

export { getAttendaceForDate, extendSwipes, processSwipes, onTick }