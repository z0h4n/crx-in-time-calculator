(function () {
  $('<script/>').html(`
    (function() {
      const origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function () {
        if (arguments[1].indexOf('/v2/attendance/info/loadDaywiseAttendanceData') !== -1) {
          this.addEventListener('load', function () {
            const event = new CustomEvent('attendanceData', { detail: { response: JSON.parse(this.responseText) } });
            document.dispatchEvent(event);
          });
        }
        origOpen.apply(this, arguments);
      };
    }());
  `).appendTo(document.head);
}());