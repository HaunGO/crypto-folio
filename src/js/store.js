import Vue from "vue/dist/vue.esm.js";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    allCoins: [],
    //?
    allMyCoins: [],
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    addAllCoins(state, coin) {
      state.allCoins = coin;
    },
    //?
    addAllMyCoins(state, coin) {
      state.allMyCoins = coin;
    }
  },
  getters: {
    allCoins: state => {
      return state.allCoins;
    },
    //?
    allMyCoins: state => {
      return state.allMyCoins;
    }
  }
});

export default store;