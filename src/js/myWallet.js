

// var apiURL = 'https://api.github.com/repositories/11730342/commits?per_page=5&sha=';
// var apiURL = 'https://api.coinmarketcap.com/v1/ticker/';
 
 
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


console.log('!@!@!@!@!@!@!@!@!@!@!@!@!');



const CoinMarketCap = require('coinmarketcap-api')

// const apiKey = '22143f4a-7418-45df-8a03-ae32f6dc8748'
// const client = new CoinMarketCap(apiKey)



// 22143f4a-7418-45df-8a03-ae32f6dc8748
// https://undefined/v1/cryptocurrency/listings/latest
// https://pro-api.coinmarketcap.com

// uri: 'https://undefined/v1/cryptocurrency/listings/latest',
//DEPRICATED: 
// // const rp = require('request-promise');
// const requestOptions = {
//     method: 'GET',
//     uri: 'https://pro-api.coinmarketcap.com',
//     qs: {
//         'start': '1',
//         'limit': '5000',
//         'convert': 'USD'
//     },
//     headers: {
//         'X-CMC_PRO_API_KEY': '22143f4a-7418-45df-8a03-ae32f6dc8748'
//     },
//     json: true,
//     gzip: true
// };

// rp(requestOptions).then(response => {
//     console.log('API call response:', response);
// }).catch((err) => {
//     console.log('API call error:', err.message);
// });




// client.getTickers().then(console.log).catch(console.error)
// client.getGlobal().then(console.log).catch(console.error)

// client.getQuotes({ symbol: ['BTC', 'ETH', 'DGB'] }).then(console.log).catch(console.error)


// fetch("https://pro-api.coinmarketcap.com", requestOptions)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (myJSON) { 
//         console.log(myJSON);
//     });
 
   
var masterWallet = new Vue({
    el: '#masterWallet',
    delimiters: ['${', '}'],
    mixins: [myMixin],
    store: store,
    data: function () {
        return {
          wallet: "wallet",
          apies: [
            // "https://api.coinmarketcap.com/v1/ticker/",
            // "https://api.coinmarketcap.com/v1/ticker/dent/",
            // "https://api.coinmarketcap.com/v1/ticker/pillar/",
            // "https://api.coinmarketcap.com/v1/ticker/veritaseum/",
            // "https://api.coinmarketcap.com/v1/ticker/substratum/",
            // "https://api.coinmarketcap.com/v1/ticker/theta-token/",
          ],

        //   globalMarket: "https://api.coinmarketcap.com/v1/global/",
          globalMarket: "pro-api.coinmarketcap.com",
          globalMarketCap: 0,
          bitcoinDominance: 0,
          total24HrVolume: 0,
            //   allCoin: [],
          allCoins: [],
          bitcoinPrice: 0,
          thisWallet: null,
          masterWallet: null,
          fetchTick: 0,
            //   myHoldingsTotalInUSD: 0,
            //   myHoldingsTotalInBTC: 0,

            //   descrete:true

            cmcApiKey: '22143f4a-7418-45df-8a03-ae32f6dc8748',
            // coinMarketCap = new CoinMarketCap(cmcApiKey)
            CMC: null,

        };
    },

 

    created: function() {
        console.log('primaryComponent created() ~~~~~~~~~');
        this.CMC = new CoinMarketCap(this.cmcApiKey);
    },



    mounted: function(){
        // this.fetchGlobalData();
        // this.fetchData();
        this.fetchData2();
    },



    methods: {

        fetchData2: function(){
            var self = this;

            self.bitcoinDominance = 99;
            self.total24HrVolume = 12;
            self.globalMarketCap = 14;

            this.CMC.getGlobal()
                .then(function (response) {
                    console.log('getGlobal() ',response);
                    self.bitcoinDominance = response.data.btc_dominance;
                    self.globalMarketCap = self.wordifyNumber(response.data.quote.USD.total_market_cap);
                    self.total24HrVolume = self.wordifyNumber(response.data.quote.USD.total_volume_24h);
                })
                .catch(console.error)


            // this.CMC.getTickers({ limit: 3 }).then(console.log).catch(console.error)
            // this.CMC.getTickers({ convert: 'EUR' }).then(console.log).catch(console.error)
            // this.CMC.getTickers({ start: 0, limit: 5 }).then(console.log).catch(console.error)
            // this.CMC.getTickers({ sort: 'name' }).then(console.log).catch(console.error)            
            this.CMC.getTickers()
                .then(function (response) {
                    self.allCoins = response.data;
                    console.log('allCoins ', self.allCoins);

                    store.commit('addAllCoins', self.allCoins);
                    self.masterWallet = self.mixinBuildWallet(self.totalHoldings, self.allCoins);
                    // console.log('data is available', self.masterWallet);

                    Vue.nextTick(function () {
                        EventBus.$emit(
                            "on-data-has-loaded"
                        );
                    })





                })
                .catch(console.error)

        },

        // fetchData: function(){

        //     var self = this;

        //     let status = (r) => {
        //         if (r.ok) {
        //             return r;
        //         } else {
        //             throw new Error(r.statusText);
        //         }
        //     }

        //     let _json = (r) => r.json();

        //     let promises = self.apies.map(url => {
        //         return fetch(url).then(_json)
        //     });

        //     Promise.all(promises).then(d => {

        //         self.allCoins = d.reduce((acc, cur) => {
        //             return acc.concat(cur);
        //         }, [] );

        //         store.commit('addAllCoins', self.allCoins);

        //         self.masterWallet = self.mixinBuildWallet(self.totalHoldings, self.allCoins);

        //         console.log('data is available', self.masterWallet);
                
        //         Vue.nextTick(function () {
        //             EventBus.$emit(
        //                 "on-data-has-loaded"
        //             );
        //         })

        //     }).catch(e => {
        //         console.log('oops, something has gone wrong.', e);
        //     });

        //     // console.log('? ', self.allCoins);

        // },









        // fetchGlobalData: function(){
        //     var self = this;

        //     // fetch(self.globalMarket)
        //         // .then(function(response) {
        //             // return response.json();
        //         // })
        //         // .then(function(myJSON) {
        //             // self.bitcoinDominance = myJSON.bitcoin_percentage_of_market_cap;
        //             // self.total24HrVolume = self.wordifyNumber(myJSON.total_24h_volume_usd);
        //             // self.globalMarketCap = self.wordifyNumber(myJSON.total_market_cap_usd);


        //             self.bitcoinDominance = 99;
        //             self.total24HrVolume = 12;
        //             self.globalMarketCap = 14;

        //             this.CMC.getGlobal()
        //                 .then(function(response) {
        //                     console.log(response);
        //                     self.bitcoinDominance = response.data.btc_dominance;
        //                     self.globalMarketCap = self.wordifyNumber(response.data.quote.USD.total_market_cap);
        //                     self.total24HrVolume = self.wordifyNumber(response.data.quote.USD.total_volume_24h);
        //                 })
        //                 .catch(console.error)
                    
        //         // });

        //     // self.fetchTick++;

        // }







    }

})
