<template>
  <div>
    <b-table
      v-if="swipedata.length"
      :data="swipedata"
      :row-class="row => row.errorMsg && 'has-text-white has-background-danger'">
      <template slot-scope="props">
        <b-table-column field="checked" label="">
          <b-checkbox :value="props.row.checked" size="is-small" type="is-dark" @input="checkBoxEvent(props.index, $event)"/>
        </b-table-column>
        <b-table-column field="count" label="No">
          {{
            props.index + 1
          }}
        </b-table-column>
        <b-table-column field="punchdatetime" label="Time">
          {{
            toFixed2(props.row.dateObject.toLocaleTimeString())
          }}
        </b-table-column>
        <b-table-column field="inoutindicator" label="In/Out">
          {{
            inOutIndicator(props.row.inoutindicator)
          }}
        </b-table-column>
        <b-table-column field="doorname" label="Door">
          {{
            props.row.doorname
          }}
        </b-table-column>
        <b-table-column v-if="swipeErrorCount" field="errorMsg" label="Message">
          {{
            props.row.errorMsg
          }}
        </b-table-column>
      </template>
    </b-table>
    <div v-else class="content has-text-grey has-text-centered" style="padding: 20px;">
      <p>
        <b-icon icon="alert" size="is-large" />
      </p>
      <p>
        No swipe data found
      </p>
    </div>
  </div>
</template>

<script>
import timeutilsMixin from "Mixins/timeutils";

const OUT_IN = ["Out", "In"];

export default {
  mixins: [timeutilsMixin],

  computed: {
    swipedata() {
      return this.$store.state.swipes;
    },
    swipeErrorCount() {
      return this.$store.getters.swipeErrorCount;
    }
  },

  methods: {
    checkBoxEvent(swipeIndex, event) {
      const newSwipeData = this.swipedata.map(swipe => swipe);
      newSwipeData[swipeIndex].checked = event;
      this.$store.commit("swipes", newSwipeData);
    }
  }
};
</script>