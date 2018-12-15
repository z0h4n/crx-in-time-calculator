<template>
  <div class="app-root has-background-light">
    <Navbar :appVisible="appVisible"/>
    <div v-show="appVisible">
      <div class="grid-container-main">
        <div class="grid-container-left">
          <DatePicker/>
          <TimeDisplay/>
        </div>
        <div class="grid-container-right">
          <b-tabs v-model="activeTab">
            <b-tab-item label="Swipes" icon="calendar-today">
              <Swipes/>
            </b-tab-item>
            <b-tab-item label="Sessions" icon="alarm-plus">
              <Sessions/>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
    <div
      class="has-background-dark has-text-light has-text-centered app-toggle"
      @click="appVisible = !appVisible"
    >
      <b-icon :icon="appVisible ? 'chevron-up' : 'chevron-down'"/>
    </div>
    <b-loading :active="isLoading" :is-full-page="false"/>
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
      activeTab: 0,
      appVisible: true
    };
  },

  mounted() {
    this.$store.dispatch("update", { date: new Date(), init: true });
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
    }
  },

  methods: {
    onTick() {
      this.$store.commit("totalTimeAfterLastIn");
    }
  },

  watch: {
    swipes() {
      if (this.lastInSwipe) {
        ticker.subscribe(this.onTick);
      } else {
        ticker.unsubscribe(this.onTick);
      }
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
  height: 200px;
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
</style>