// Single source of truth for the application

import Vue from 'vue';
import Vuex from 'vuex';
import lodashGet from 'lodash.get';
import { getAttendaceForDate, extendSwipes, processSwipes, onTick } from 'Services/attendanceHelper';

const SESSION_STORAGE_KEY = `chrome_extension_itc_${chrome.runtime.id}_sessions`;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    inited: false,
    isLoading: false,
    swipes: [],
    sessions: JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '[]'),
    joinDate: null,
    lastInSwipe: null,
    totalTimeTillLastOut: 0,
    totalTimeAfterLastIn: 0,
    currentDate: new Date()
  },

  getters: {
    swipeErrorCount: state => {
      return state.swipes.filter(swipe => swipe.errorMsg).length;
    }
  },

  mutations: {
    inited: (state) => {
      state.inited = true;
    },

    currentDate: (state, currentDate) => {
      if (currentDate instanceof Date) {
        state.currentDate = currentDate;
      }
    },

    joinDate: (state, joinDate) => {
      if (joinDate instanceof Date) {
        state.joinDate = joinDate;
      }
    },

    swipes: (state, swipes) => {
      if (Array.isArray(swipes)) {
        const { lastInSwipe, totalTimeTillLastOut } = processSwipes(swipes);
        state.swipes = swipes;
        state.lastInSwipe = lastInSwipe;
        state.totalTimeTillLastOut = totalTimeTillLastOut;
        state.totalTimeAfterLastIn = onTick(totalTimeTillLastOut, lastInSwipe);
      }
    },

    isLoading: (state, flag) => {
      if (typeof flag === 'boolean') {
        state.isLoading = flag;
      }
    },

    sessions: (state, sessions) => {
      if (Array.isArray(sessions)) {
        state.sessions = sessions;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
      }
    },

    totalTimeAfterLastIn: (state) => {
      const { totalTimeTillLastOut, lastInSwipe } = state;
      state.totalTimeAfterLastIn = onTick(totalTimeTillLastOut, lastInSwipe);
    }
  },

  actions: {
    async update({ state, commit }, { date, init }) {
      commit('isLoading', true);

      const response = await getAttendaceForDate(date);
      const extendedSwipes = extendSwipes(response.swipeData);

      commit('currentDate', date);
      commit('swipes', extendedSwipes);

      if (init && !state.inited) {
        const joinDate = new Date(lodashGet(response, 'employeeSchemeHistory[0].fromdate', null));
        commit('joinDate', joinDate);
        commit('inited');
      }

      commit('isLoading', false);
    },

    addSession({ state, commit }, session) {
      commit('sessions', [session, ...state.sessions]);
    },

    deleteSession({ state, commit }, index) {
      commit('sessions', state.sessions.filter((s, i) => i !== index));
    }
  }
});

export default store;