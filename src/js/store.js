import Vue from "vue/dist/vue.esm.js";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    allCoins: []
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    addAllCoins(state, coin) {
      state.allCoins = coin;
    }
  },
  getters: {
    allCoins: state => {
      return state.allCoins;
    }
  }
});

export default store;