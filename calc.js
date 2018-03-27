(function () {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const $total_time = $('#itc_wrapper').find('.total_time');
  let swipeData = [];
  let lastswipe = null;
  let totaltime1 = 0;
  let totaltime2 = 0;

  const Ticker = {
    _interval: null,
    _delay: 1000,
    _callbacks: [],

    start: function () {
      if (this._interval !== null) {
        this.stop(this._interval);
      }
      this._interval = setInterval(this._tick.bind(this), this._delay);
    },

    stop: function () {
      clearInterval(this._interval);
      this._interval = null;
    },

    _tick: function () {
      this._callbacks.forEach(function (callback) {
        callback();
      });
    },

    subscribe: function (callback) {
      if (typeof callback === 'function') {
        this._callbacks.push(callback);
      }
    },

    unsubscribe: function (callback) {
      const index = this._callbacks.indexOf(callback);
      if (index !== -1) {
        this._callbacks.splice(index);
      }
    }
  };

  const TimeUtil = {
    hrsToMsecs: function (hrs) {
      return hrs * 60 * 60 * 1000;
    },

    minsToMsecs: function (mins) {
      return mins * 60 * 1000;
    },

    zeroFill: function (val) {
      val += '';
      return val.length < 2 ? '0' + val : val;
    },

    msecsToTimeString: function (msecs) {
      const hours = msecs / this.hrsToMsecs(1);
      const minutes = (hours - parseInt(hours, 10)) * 60;
      const seconds = (minutes - parseInt(minutes, 10)) * 60;
      return [hours, minutes, seconds].map(t => this.zeroFill(parseInt(t, 10))).join(':');
    }
  };

  document.addEventListener('attendanceData', function (e) {
    const date = new Date(e.detail.response.attendanceData[0].attendancedate);
    $('#itc_wrapper').find('.swipe_data .date').text(date.toDateString());

    swipeData = e.detail.response.swipeData;
    swipeData.forEach(function (swipe) {
      swipe.dateobject = new Date(swipe.punchdatetime);
      swipe.checked = true;
      swipe.datestring = date.toDateString();
    });

    swipeDataReceived();
  });

  function swipeDataReceived() {
    populateTable();
    calculate1();
  }

  function populateTable() {
    const $table = $('#itc_wrapper').find('.swipe_data table');
    $table.find('tr').remove();

    swipeData.forEach(function (swipe, i) {
      const $tr = $('<tr/>');
      const $chkbox = $('<input/>').prop({ type: 'checkbox', checked: true }).data('index', i);

      $($tr).append(cellData(i + 1));
      $($tr).append(cellData($chkbox));
      $($tr).append(cellData(swipe.inoutindicator === 1 ? 'In' : 'Out'));
      $($tr).append(cellData(swipe.doorname));
      $($tr).append(cellData(swipe.dateobject.toString()));

      if (swipe.dirtyflag) {
        $($tr).addClass('dirty');
      }

      $($table).append($tr);

      $($chkbox).off().on('change', checkboxClick);
    });
  }

  function cellData(html) {
    const $td = $('<td/>');
    return $td.append(html);
  }

  function checkboxClick() {
    swipeData[$(this).data('index')].checked = this.checked;
    calculate1();
  }

  function calculate1() {
    totaltime1 = 0;
    totaltime2 = 0;
    lastswipe = null;

    for (let i = 0, imax = swipeData.length; i < imax; i += 1) {
      const swipe = swipeData[i];

      if (swipe.checked && swipe.inoutindicator === 0) {
        for (let j = i - 1; j >= 0; j -= 1) {
          const swipe2 = swipeData[j];
          if (swipe2 && swipe2.checked && swipe2.inoutindicator === 1) {
            totaltime1 += swipe.dateobject.getTime() - swipe2.dateobject.getTime();
            break;
          }
        }
      }
    }

    totaltime2 = totaltime1;

    for (let i = swipeData.length - 1; i >= 0; i -= 1) {
      const swipe = swipeData[i];
      const datestring = (new Date()).toDateString();
      if (swipe.checked) {
        if (swipe.inoutindicator === 1) {
          lastswipe = Object.assign({}, swipe);
          totaltime2 = totaltime1 + (Date.now() - swipe.dateobject.getTime())
        }
        break;
      }
    }

    calculate2();
  }

  function calculate2() {
    if (lastswipe) {
      totaltime2 = totaltime1 + (Date.now() - lastswipe.dateobject.getTime());
    }
    updateDisplay();
  }

  function updateDisplay() {
    $($total_time).text(TimeUtil.msecsToTimeString(totaltime2));
  }

  function initXHR() {
    const initxhr = new XMLHttpRequest();
    const datetoday = new Date();
    const geturl = `https://mitr.greythr.com/v2/attendance/info/loadDaywiseAttendanceData?attDate=${datetoday.getDate()}+${months[datetoday.getMonth()]}+${datetoday.getFullYear()}&startDate=01+${months[datetoday.getMonth()]}+${datetoday.getFullYear()}&_=${Date.now()}`;

    initxhr.open('GET', geturl);
    initxhr.setRequestHeader('Accept', 'application/json');
    initxhr.setRequestHeader('Accept', 'text/javascript');

    initxhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const event = new CustomEvent('attendanceData', { detail: { response: JSON.parse(this.responseText) } });
        document.dispatchEvent(event);
      }
    }

    initxhr.send();
  }

  function checkNewVersion() {
    const current_manifest = chrome.runtime.getManifest();
    const updatexhr = new XMLHttpRequest();

    updatexhr.open('GET', 'https://raw.githubusercontent.com/z0h4n/crx-in-time-calculator/master/manifest.json');

    updatexhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const latest_manifest = JSON.parse(this.responseText);
        if (current_manifest.version !== latest_manifest.version) {
          $('#itc_wrapper').find('.update').show();
        }
      }
    }

    updatexhr.send();
  }

  initXHR();
  checkNewVersion();

  Ticker.subscribe(calculate2);
  Ticker.start();
}());