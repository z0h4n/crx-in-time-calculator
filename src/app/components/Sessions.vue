<template>
  <div class="grid-container">
    <div>
      <b-field class="is-inline-block">
        <b-timepicker v-model="sessionTime" inline>
          <button class="button is-dark is-small" :disabled="sessionTimeInMsecs === 0" @click="addSessionTime">
            Add
          </button>
        </b-timepicker>
      </b-field>
    </div>
    <div>
      <b-table v-if="sessions.length" :data="sessions" :row-class="row => !remainingTimeMsecs(row) && 'has-background-success has-text-light'">
        <template slot-scope="props">
          <b-table-column field="time" label="Session" class="vertical-align-middle">
            {{
              msecsToHHMMSS(props.row)
            }}
          </b-table-column>

          <b-table-column label="Remaining" class="vertical-align-middle">
            {{
              msecsToHHMMSS(remainingTimeMsecs(props.row))
            }}
          </b-table-column>

          <b-table-column label="Completes On" class="vertical-align-middle">
            {{
              toFixed2(new Date(remainingTimeMsecs(props.row + Date.now())).toLocaleTimeString())
            }}
          </b-table-column>

          <b-table-column label="" class="has-text-right vertical-align-middle">
            <a :class="['is-small', 'is-dark', !remainingTimeMsecs(props.row) ? 'has-text-light' : '']" @click="deleteSession(props.index)">
              <b-icon icon="delete-forever"/>
            </a>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import timeutilsMixin from "Mixins/timeutils";

export default {
  data() {
    return {
      sessionTime: new Date(0, 0)
    };
  },

  mixins: [timeutilsMixin],

  computed: {
    sessions() {
      return this.$store.state.sessions;
    },

    inTime() {
      return this.$store.state.totalTimeAfterLastIn;
    },

    sessionTimeInMsecs() {
      return (
        this.hrsToMsecs(this.sessionTime.getHours()) +
        this.minsToMsecs(this.sessionTime.getMinutes())
      );
    }
  },

  methods: {
    remainingTimeMsecs(msecs) {
      return msecs >= this.inTime ? msecs - this.inTime : 0;
    },

    addSessionTime() {
      this.$store.dispatch("addSession", this.sessionTimeInMsecs);
      this.sessionTime = new Date(0, 0);
    },

    deleteSession(index) {
      this.$store.dispatch("deleteSession", index);
    }
  }
};
</script>

<style scoped>
.button {
  margin-top: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 10px;
}

.vertical-align-middle {
  vertical-align: middle;
}
</style>