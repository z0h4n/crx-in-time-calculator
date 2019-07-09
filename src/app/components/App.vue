<template>
  <div ref="app" class="app-root has-background-light">
    <Navbar />
    <div v-show="appVisible">
      <div class="grid-container-main">
        <div class="grid-container-left">
          <TimeDisplay />
        </div>
        <div class="grid-container-right">
          <b-tabs v-model="activeTab" size="is-small">
            <b-tab-item>
              <template slot="header">
                <span class="is-size-6">Swipes</span>
                <b-tag
                  v-if="swipeErrorCount"
                  class="errors"
                  type="is-danger"
                >{{`${swipeErrorCount} Error${swipeErrorCount > 1 ? 's': ''}`}}</b-tag>
              </template>
              <Swipes />
            </b-tab-item>
            <b-tab-item>
              <template slot="header">
                <span class="is-size-6">Sessions</span>
              </template>
              <Sessions />
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
      <div class="footer has-background-dark is-paddingless"></div>
    </div>
    <b-loading :active="isLoading" :is-full-page="false" />
  </div>
</template>

<script>
import Swipes from "Components/Swipes.vue";
import TimeDisplay from "Components/TimeDisplay.vue";
import DatePicker from "Components/DatePicker.vue";
import Sessions from "Components/Sessions.vue";
import Navbar from "Components/Navbar.vue";
import ticker from "Services/ticker";

export default {
  components: {
    Navbar,
    Sessions,
    Swipes,
    TimeDisplay,
    DatePicker,
    Notification
  },

  data() {
    return {
      activeTab: 0
    };
  },

  mounted() {
    this.$store.dispatch("update", { date: new Date(), init: true });

    window.addEventListener("resize", this.onResize);
    this.$nextTick(this.onResize);
  },

  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
    swipes() {
      return this.$store.state.swipes;
    },
    lastInSwipe() {
      return this.$store.state.lastInSwipe;
    },
    appVisible() {
      return this.$store.state.appVisible;
    },
    swipeErrorCount() {
      return this.$store.getters.swipeErrorCount;
    }
  },

  methods: {
    onTick() {
      this.$store.commit("totalTimeAfterLastIn");
    },

    onResize() {
      this.$root.greythrTopNav.style.top = `${this.$refs.app.offsetHeight}px`;
      this.$root.greythrContainer.style.marginTop = `${this.$refs.app.offsetHeight}px`;
    }
  },

  watch: {
    swipes() {
      if (this.lastInSwipe) {
        ticker.subscribe(this.onTick);
      } else {
        ticker.unsubscribe(this.onTick);
      }
    },

    appVisible() {
      this.$nextTick(this.onResize);
    }
  }
};
</script>

<style scoped>
@media only screen and (max-width: 1000px) {
  .app-root >>> .grid-container-main {
    grid-template-columns: 100%;
    height: auto;
  }

  .app-root >>> .grid-container-right {
    height: 200px;
  }
}

.app-root {
  position: relative;
}

.grid-container-main {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 10px;
  padding: 10px;
  height: 160px;
}

.grid-container-left {
  display: grid;
  grid-template-columns: auto;
  grid-gap: 10px;
}

.grid-container-right {
  overflow: auto;
}

.app-toggle {
  padding-top: 3px;
  cursor: pointer;
}

.footer {
  height: 10px;
}

.errors {
  height: 1.5em;
  padding-left: 0.5em;
  padding-right: 0.5em;
}
</style>