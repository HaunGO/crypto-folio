import Vue from "vue/dist/vue.esm.js";
// import Vuex from "vuex";
// import Rx from "rxjs/Rx";
import _ from "lodash";
 
import EventBus from './eventBus.js';
import myMixin from './mixins.js';
import store from "./store.js";

import './component-jsonwallets.js';
import './component-wallet.js';
import './component-masterWallet.js';
import './component-coinbox.js';
import './component-coin.js';
import './component-chart.js';
import './component-totals.js';


// https://www.npmjs.com/package/coinmarketcap-api
const CoinMarketCap = require('coinmarketcap-api');

var folio = new Vue({
    el: '#myCryptoFolio',
    delimiters: ['${', '}'],
    mixins: [myMixin],
    store: store,
    data: function () {
        return {
            globalMarketCap: 0,
            bitcoinDominance: 0,
            total24HrVolume: 0,

            allCoins: [],
            //?
            allMyCoins: [],
            bitcoinPrice: 0,
            fetchTick: 0,

            cmcApiKey: '22143f4a-7418-45df-8a03-ae32f6dc8748',
            CMC: null,
        };
    },

    created: function() {
        console.log('primaryComponent created() ~~~~~~~~~');
        // https://www.npmjs.com/package/coinmarketcap-api
        this.CMC = new CoinMarketCap(this.cmcApiKey,{
            'headers': {
                'X-CMC_PRO_API_KEY': this.cmcApiKey,
                'Access-Control-Allow-Origin': '*'
            }
        });        
        // this.CMC.getMetadata({ id: '1' }).then(
        //     function(re){
        //         console.log('~~~~~~~~~~~~~~~~ ~ ', re);
        //         console.log('~~~~~~~~~~~~~~~~ ~ ', re.data[1].logo);
        //     }
        // ).catch(console.error);
    },

    mounted: function(){
        console.log('main folio mounted');
                
        this.fetchData2();

    },

    updated: function(){
        console.log('main folio updated'); 
        // console.log('main folio updated', this.$root.totalHoldings); 
        // console.log('main folio updated', this.$root.masterWallet); 
    },



    methods: {

        addLogos: function(){
            var self = this;
            console.log('addLogos() ', self.$root.totalHoldings);
            let list = [];

            for (const coin in self.$root.totalHoldings) {
                // console.log(coin);
                list.push(coin);
                // this.$root.CMC.getMetadata({ symbol: 'BTC' }).then(
                //     function(re) {
                //         console.log('?? ~ re ~ ', re.data[1].logo);
                //     }).catch(console.error);
            }


            console.log('list ---- ', list);


            
            self.CMC.getMetadata({symbol: list}).then(
                function(response) {
                    console.log('?? ~ response ~ ', response.data );
                    let obj = response.data;
                    self.$root.allMyCoinsMeta = response.data;

                    for (const each in obj) {
                        console.log(obj[each].logo);
                        let logoUrl = obj[each].logo;
                        let thisCoin = self.filterCoin(obj[each].symbol);
                        // Object.assign(thisCoin[0], {
                        //     'logo': logoUrl,
                        // });
                        // console.log('thisCoin with LOGO? ', thisCoin);
                    }
                    
                    
                    EventBus.$emit("on-data-has-loaded");


                }).catch(console.error);
        },


         
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
            // CMC api call credits are a valuabe.   example( {limit:100} = 1      {limit:1000} = 5   
            this.CMC.getTickers({ limit: 100 })
                .then(function (response) {
                    self.allCoins = response.data;
                    // console.log('allCoins ', self.allCoins);

                }).then(function(response) {
                    store.commit('addAllCoins', self.allCoins);


                }).then(function(response) {
                    Vue.nextTick(function () {
                        self.addLogos();
                        // EventBus.$emit("on-data-has-loaded");
                    })
                    // console.log('?!?!? ', store.allMyCoins);
                    // self.allMyCoins = self.store.allMyCoins;
                })
                .catch(console.error)
                    
        },
    }
})
