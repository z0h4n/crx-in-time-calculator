export default {
  methods: {
    hrsToMsecs(hrs) {
      return hrs * 60 * 60 * 1000;
    },

    minsToMsecs(mins) {
      return mins * 60 * 1000;
    },

    secsToMsecs(secs) {
      return secs * 1000;
    },

    msecsToHHMMSS(millisecs) {
      const hrs = millisecs / this.hrsToMsecs(1);
      const mins = (hrs - parseInt(hrs, 10)) * 60;
      const secs = (mins - parseInt(mins, 10)) * 60;
      const hhmmss = [hrs, mins, secs].map(v => parseInt(v, 10)).join(':');
      return this.toFixed2(hhmmss);
    },

    toFixed2(string) {
      return string.split(':').map(s => s.length < 2 ? '0' + s : s).join(':');
    },

    inOutIndicator(index) {
      return ['Out', 'In'][index];
    }
  }
};