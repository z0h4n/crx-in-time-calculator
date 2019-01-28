<template>
  <div class="seperator-container" :style="{visibility: this.hide ? 'hidden' : 'visible'}">
    <div class="seperator-dot"/>
    <div class="gap"/>
    <div class="seperator-dot"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blinkInterval: null,
      hide: false
    };
  },

  computed: {
    swipes() {
      return this.$store.state.swipes;
    },
    isLastSwipeIn() {
      return (
        this.swipes.length &&
        this.swipes[this.swipes.length - 1].inoutindicator === 1
      );
    }
  },

  watch: {
    isLastSwipeIn(isIn) {
      if (isIn) {
        this.blinkInterval = setInterval(() => {
          this.hide = !this.hide;
        }, 500);
      } else {
        clearInterval(this.blinkInterval);
        this.hide = false;
      }
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