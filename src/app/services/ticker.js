let subscribers = [];

function subscribe(callback) {
  _check(callback);
  unsubscribe(callback);
  subscribers.push(callback);
}

function unsubscribe(callback) {
  _check(callback);
  subscribers = subscribers.filter(cb => cb !== callback);
}

function _check(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Parameter 1 must be of type : function');
  }
}

(function interval() {
  subscribers.forEach(cb => cb());
  setTimeout(interval, 1000);
}());

export default { subscribe, unsubscribe };