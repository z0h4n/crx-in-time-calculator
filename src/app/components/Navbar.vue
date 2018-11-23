<template>
  <div class="has-background-dark">
    <a class="button is-small is-dark" href="https://github.com/z0h4n/crx-in-time-calculator" target="_blank">Github</a>
    <a v-if="isMITR" class="button is-small is-dark" v-on:click.stop="openLegacyVersion">MITR-ITC</a>
  </div>
</template>

<script>
const OUT_IN = ["Out", "In"];

export default {
  data() {
    return {
      legacyWindow: null
    };
  },

  computed: {
    isMITR() {
      return window.location.hostname === "mitr.greythr.com";
    },
    swipeString() {
      return this.$store.state.swipes
        .map((swipe, i) => {
          return `${i + 1}\t${swipe.dateObject.toString()}\t${
            OUT_IN[swipe.inoutindicator]
          }\t${swipe.doorname}`;
        })
        .join("\n");
    }
  },

  mounted() {
    window.addEventListener("message", this.onWindowMessage);
  },

  methods: {
    openLegacyVersion() {
      this.legacyWindow = window.open("https://z0h4n.github.io/mitr-itc/");
    },

    onWindowMessage(event = {}) {
      if (
        event.data &&
        event.data.component === "SwipeInput" &&
        event.data.type === "componentDidMount"
      ) {
        if (this.legacyWindow) {
          this.legacyWindow.postMessage(
            { type: "attendanceData", value: this.swipeString },
            "*"
          );
        }
      }
    }
  }
};
</script>