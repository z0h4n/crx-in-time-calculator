<template>
  <div class="seperator-container" :style="style">
    <div class="seperator-dot" />
    <div class="gap" />
    <div class="seperator-dot" />
  </div>
</template>

<script>
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    }
  },

  computed: {
    lastInSwipe() {
      return this.$store.state.lastInSwipe;
    },
    style() {
      return {
        visibility: !this.lastInSwipe
          ? "visible"
          : this.show
          ? "visible"
          : "hidden"
      };
    }
  }
};
</script>

<style scoped>
.seperator-container {
  width: 10px;
}

.seperator-dot {
  width: 100%;
  height: 10px;
  border-radius: 50%;
  background-color: hsl(0, 0%, 21%);
}

.gap {
  width: 100%;
  height: 30px;
}
</style>