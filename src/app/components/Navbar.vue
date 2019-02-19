<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center;"
    class="has-background-dark"
  >
    <div style="display: flex;">
      <div class="itc-brand" :style="{ backgroundImage: `url(${brandImage})` }" :title="version"/>
      <div :style="{display: 'flex', visibility: appVisible ? 'hidden' : 'visible'}">
        <DatePicker/>
        <div class="mini-time-display has-text-light">{{timeDisplay}}</div>
      </div>
    </div>
    <div style="display: flex;">
      <a
        class="button is-small is-dark"
        href="https://github.com/z0h4n/crx-in-time-calculator"
        target="_blank"
      >Github</a>
      <a v-if="isMITR" class="button is-small is-dark" v-on:click.stop="openLegacyVersion">MITR-ITC</a>
      <a class="button is-small is-dark" @click="$root.appVisible = !$root.appVisible">
        <b-icon :icon="appVisible ? 'chevron-up' : 'chevron-down'"/>
      </a>
    </div>
  </div>
</template>

<script>
import DatePicker from "Components/DatePicker.vue";
import TimeDisplay from "Components/TimeDisplay.vue";
import timeutilsMixin from "Mixins/timeutils";

const OUT_IN = ["Out", "In"];

export default {
  components: { DatePicker, TimeDisplay },

  mixins: [timeutilsMixin],

  data() {
    return {
      version: `In-Time Calculator v${chrome.runtime.getManifest().version}`,
      legacyWindow: null
    };
  },

  computed: {
    timeDisplay() {
      return this.msecsToHHMMSS(this.$store.state.totalTimeAfterLastIn);
    },
    brandImage() {
      return chrome.runtime.getURL("24.png");
    },
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
    },
    appVisible() {
      return this.$root.appVisible;
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
    },

    handleAppVisibility() {
      this.$root.appVisible = !this.$root.appVisible;
    }
  }
};
</script>

<style scoped>
.itc-brand {
  width: 24px;
  margin: 0px 10px;
  background-repeat: no-repeat;
  background-position: center;
}

.mini-time-display {
  display: flex;
  align-items: center;
}
</style>