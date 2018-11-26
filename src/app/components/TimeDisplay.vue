<template>
  <div class="time-display is-table has-margin-auto is-full-height">
    <div class="is-table-row">
      <template v-for="(value, i) in totalTimeAfterLastIn">
        <div :key="i" :class="['is-table-cell', 'is-vertically-centered']">
          <seven-segment v-if="value !== ':'" :class="i !== 0 ? 'padding-left-10' : ''" :key="i" :value="value" :on-color="onColor" :segment-width="40" :segment-height="10" :rounded="false"/>
          <TimeDisplaySeperator v-else class="padding-left-10" :key="i"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import timeutilsMixin from "Mixins/timeutils";
import TimeDisplaySeperator from "Components/TimeDisplaySeperator.vue";

export default {
  components: { TimeDisplaySeperator },

  mixins: [timeutilsMixin],

  data() {
    return {
      onColor: "hsl(0, 0%, 21%)"
    };
  },

  computed: {
    totalTimeAfterLastIn() {
      return this.msecsToHHMMSS(this.$store.state.totalTimeAfterLastIn);
    }
  }
};
</script>

<style scoped>
@media only screen and (max-width: 1000px) {
  .time-display {
    margin-top: 10px;
  }
}

.padding-left-10 {
  padding-left: 10px;
}
</style>