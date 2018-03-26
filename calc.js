(function () {
  let swipeData = [];
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
      return hrs * 1000 * 60 * 60;
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
    });
  }

  function calculate1() {
    totaltime1 = 0;
    totaltime2 = 0;

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
      if (swipe.checked && swipe.inoutindicator === 1 && swipe.datestring === datestring) {
        totaltime2 = totaltime1 + (Date.now() - swipe.dateobject.getTime())
        break;
      }
    }

    console.log(totaltime1, TimeUtil.msecsToTimeString(totaltime1));
    console.log(totaltime2, TimeUtil.msecsToTimeString(totaltime2));
  }

  function cellData(html) {
    const $td = $('<td/>');
    return $td.append(html);
  }

  Ticker.start();
}());