import Vue from "vue/dist/vue.esm.js";
// import Vuex from "vuex";
// import Rx from "rxjs/Rx";
import _ from "lodash";
 
import EventBus from './eventBus.js';
import myMixin from './mixins.js';
import store from "./store.js";

import './component-jsonwallets.js';
import './component-wallet.js';
import './component-coinbox.js';
import './component-coin.js';
import './component-chart.js';
import './component-totals.js';

// https://www.npmjs.com/package/coinmarketcap-api
const CoinMarketCap = require('coinmarketcap-api')
// const apiKey = '22143f4a-7418-45df-8a03-ae32f6dc8748'
// const client = new CoinMarketCap(apiKey)

   
var masterWallet = new Vue({
    el: '#masterWallet',
    delimiters: ['${', '}'],
    mixins: [myMixin],
    store: store,
    data: function () {
        return {
            wallet: "wallet",
            globalMarketCap: 0,
            bitcoinDominance: 0,
            total24HrVolume: 0,

            allCoins: [],
            bitcoinPrice: 0,
            thisWallet: null,
            masterWallet: null,
            fetchTick: 0,
            //   descrete:true

            cmcApiKey: '22143f4a-7418-45df-8a03-ae32f6dc8748',
            CMC: null,
        };
    },

    created: function() {
        console.log('primaryComponent created() ~~~~~~~~~');
        // https://www.npmjs.com/package/coinmarketcap-api
        this.CMC = new CoinMarketCap(this.cmcApiKey);
    },

    mounted: function(){
        this.fetchData2();
    },

    methods: {
        fetchData2: function(){
            var self = this;
            self.bitcoinDominance = 0;
            self.total24HrVolume = 0;
            self.globalMarketCap = 0;
            // https://www.npmjs.com/package/coinmarketcap-api
            this.CMC.getGlobal()
                .then(function (response) {
                    console.log('getGlobal() ',response);
                    self.bitcoinDominance = response.data.btc_dominance;
                    self.globalMarketCap = self.wordifyNumber(response.data.quote.USD.total_market_cap);
                    self.total24HrVolume = self.wordifyNumber(response.data.quote.USD.total_volume_24h);
                })
                .catch(console.error)

            // https://www.npmjs.com/package/coinmarketcap-api
            this.CMC.getTickers({ limit: 5000 })
                .then(function (response) {
                    self.allCoins = response.data;
                    console.log('allCoins ', self.allCoins);

                    store.commit('addAllCoins', self.allCoins);
                    self.masterWallet = self.mixinBuildWalletV2(self.totalHoldings, self.allCoins);

                    Vue.nextTick(function () {
                        EventBus.$emit(
                            "on-data-has-loaded"
                        );
                    })
                })
                .catch(console.error)
        },
    }
})
