<template>
  <div>
    <div class="has-text-centered">
      <button class="button is-dark is-small" @click="isDatePickerActive = true">
        <span>
          {{
            date.toDateString()
          }}
        </span>
        <b-tag v-if="swipeErrorCount" class="errors" type="is-danger">{{swipeErrorCount}} swipe errors</b-tag>
      </button>
    </div>

    <b-modal :active.sync="isDatePickerActive" has-modal-card ref=modalWindow>
      <b-field class="is-inline-block">
        <b-datepicker class="date-picker" v-model="date" :min-date="mindate" :max-date="maxdate" size="is-small" inline />
      </b-field>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDatePickerActive: false,
      maxdate: new Date()
    };
  },

  computed: {
    date: {
      get() {
        return this.$store.state.currentDate;
      },
      set(newdate) {
        this.$refs.modalWindow.close();
        this.$store.dispatch("update", { date: newdate });
      }
    },
    mindate() {
      return this.$store.state.joinDate;
    },
    swipeErrorCount() {
      return this.$store.getters.swipeErrorCount;
    }
  }
};
</script>

<style scoped>
.errors {
  margin-left: 10px;
}
</style>