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
    $('#itc_wrapper').find('.swipe_data .date').html(date.toDateString());

    swipeData = e.detail.response.swipeData;
    swipeData.forEach(function (swipe) {
      swipe.dateobject = new Date(swipe.punchdatetime);
      swipe.checked = true;
      swipe.datestring = date.toDateString();
    });

    swipeDataReceived();
    wrapperFocus();
  });

  function swipeDataReceived() {
    populateTable();
    calculate1();
  }

  function populateTable() {
    const $table = $('#itc_wrapper').find('.swipe_data table');
    let errors = 0;

    $table.find('tr').remove();

    swipeData.forEach(function (swipe, i) {
      const $tr = $('<tr/>');
      const $chkbox = $('<input/>').prop({ type: 'checkbox', checked: true }).data('index', i);
      const swipe_time = swipe.dateobject.toLocaleTimeString().split(':');
      swipe_time[0] = TimeUtil.zeroFill(swipe_time[0]);

      $($tr).append(cellData(i + 1));
      $($tr).append(cellData($chkbox));
      $($tr).append(cellData(swipe.inoutindicator === 1 ? 'In' : 'Out'));
      $($tr).append(cellData(swipe.doorname));
      $($tr).append(cellData(swipe_time.join(':')));

      if (swipe.dirtyflag) {
        errors += 1;
        $($tr).append(cellData('System Generated'));
        $($tr).addClass('dirty');
      } else if (i !== 0 && swipe.inoutindicator === swipeData[i - 1].inoutindicator) {
        errors += 1;
        $($tr).append(cellData('Improper Sequence'));
        $($tr).addClass('dirty');
      } else {
        $($tr).append(cellData(''));
      }

      $($table).append($tr);

      $($chkbox).off().on('change', checkboxClick);
    });

    if (errors) {
      const $err_span = $('<span/>').addClass('error_count').text(`${errors} error${errors > 1 ? 's' : ''}`);
      $('#itc_wrapper').find('.swipe_data .date').append($err_span);
    }
  }

  function cellData(html) {
    return $('<td/>').append(html).css('padding', '5px 10px 5px 10px');
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
          if (swipe2 && swipe2.checked) {
            if (swipe2.inoutindicator === 1) {
              totaltime1 += swipe.dateobject.getTime() - swipe2.dateobject.getTime();
            }
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

  function wrapperFocus() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('#itc_wrapper').find('.wrapper-focus').stop().css('opacity', 1).animate({ 'opacity': 0 }, 1000);
  }

  chrome.runtime.onMessage.addListener(function (message) {
    switch (message.action) {
      case 'focus':
        wrapperFocus();
        break;

      default:
        console.error(`Unhandled message action : ${message.action}`)
    }
  });

  initXHR();

  Ticker.subscribe(calculate2);
  Ticker.start();
}());