// Single source of truth for the application

import Vue from 'vue';
import Vuex from 'vuex';
import lodashGet from 'lodash.get';
import { getAttendaceForDate, extendSwipes, processSwipes, onTick } from 'Services/attendanceHelper';

Vue.use(Vuex);

const userData = Object.assign(
  {
    sessions: [],
    appVisible: true
  },
  JSON.parse(localStorage.getItem('itc_data') || '{}')
);

const saveUserData = () => {
  localStorage.setItem('itc_data', JSON.stringify(userData));
};

const store = new Vuex.Store({
  state: Object.assign(
    {
      inited: false,
      isLoading: false,
      swipes: [],
      sessions: [],
      appVisible: true,
      joinDate: null,
      lastInSwipe: null,
      totalTimeTillLastOut: 0,
      totalTimeAfterLastIn: 0,
      currentDate: new Date()
    },
    userData
  ),

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
        userData.sessions = sessions;
        saveUserData();
      }
    },

    totalTimeAfterLastIn: (state) => {
      const { totalTimeTillLastOut, lastInSwipe } = state;
      state.totalTimeAfterLastIn = onTick(totalTimeTillLastOut, lastInSwipe);
    },

    appVisible: (state, newFlag) => {
      if (typeof newFlag === 'boolean') {
        state.appVisible = newFlag;
        userData.appVisible = newFlag;
        saveUserData();
      }
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
      if (!state.sessions.includes(session)) {
        commit('sessions', [session, ...state.sessions]);
      }
    },

    deleteSession({ state, commit }, index) {
      commit('sessions', state.sessions.filter((s, i) => i !== index));
    },

    setVisibility({ state, commit }, flag) {
      commit('appVisible', flag);
    }
  }
});

export default store;