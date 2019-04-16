

// var apiURL = 'https://api.github.com/repositories/11730342/commits?per_page=5&sha=';
// var apiURL = 'https://api.coinmarketcap.com/v1/ticker/';

import EventBus from './eventBus.js';
import myMixin from './mixins.js';

import "./component-jsonwallet.js";
import './component-wallet.js';
import './component-coinbox.js';
import './component-coin.js';
import './component-chart.js';




var w = new Vue({
    el: '#masterWallet',
    delimiters: ['${', '}'],
    mixins: [myMixin],

    data: function () {
        return {
            wallet:'wallet',
            apies : [
                    "https://api.coinmarketcap.com/v1/ticker/",
                    "https://api.coinmarketcap.com/v1/ticker/dent/",
                    "https://api.coinmarketcap.com/v1/ticker/pillar/",
                    "https://api.coinmarketcap.com/v1/ticker/veritaseum/",
                    // "https://api.coinmarketcap.com/v1/ticker/theta-token/",
            ],
            globalMarket : "https://api.coinmarketcap.com/v1/global/",

            globalMarketCap: 0,
            bitcoinDominance: 0,
            total24HrVolume: 0,

            allCoins: [],

            // myHoldings: {  "PPT": 100, "VERI": 1 },

            // myTotalHoldingsInUSD: 0,
            // myTotalHoldingsInBTC: 0,
            bitcoinPrice: 0,

            thisWallet: null,
            masterWallet: null,

            fetchTick: 0,
            // descrete:true
        }
    },



    created: function() {
        console.log('primaryComponent created() ~~~~~~~~~');
    },



    mounted: function(){
        // console.log('mounted()');

        this.fetchData();
        this.fetchGlobalData();

        // setInterval(function () {
        //     this.fetchData();
        // }.bind(this), 30000);

    },



    methods: {


        fetchData: function(){

            var self = this;

            let status = (r) => {
                if (r.ok) {
                    return r;
                } else {
                    throw new Error(r.statusText);
                }
            }

            let _json = (r) => r.json();

            let promises = self.apies.map(url => {
                return fetch(url).then(_json)
            });

            Promise.all(promises).then(d => {

                self.allCoins = d.reduce((acc, cur) => {
                    return acc.concat(cur);
                }, [] );

                // self.myWallet = self.buildMyWallet(self.allCoins);
                // self.totalUSD();
                // self.totalBTC();
                // self.buildChart2();

                // document.title = this.formatAsUSD(this.myHoldingsTotalInUSD);


                self.masterWallet = self.mixinBuildWallet(this.totalHoldings, self.allCoins);

                // console.log('data is available', self.masterWallet);
                console.log('data is available', self.masterWallet);



                Vue.nextTick(function () {
                    EventBus.$emit('on-data-has-loaded');
                    // console.log('master-wallet- EMIT');
                    // EventBus.$emit('master-wallet-built', self.masterWallet);
                })

            }).catch(e => {
                console.log('oops, something has gone wrong.', e);
            });

        },









        fetchGlobalData: function(){
            var self = this;

            fetch(self.globalMarket)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJSON) {
                    self.bitcoinDominance = myJSON.bitcoin_percentage_of_market_cap;
                    self.total24HrVolume = self.wordifyNumber(myJSON.total_24h_volume_usd);
                    self.globalMarketCap = self.wordifyNumber(myJSON.total_market_cap_usd);
                });

            self.fetchTick++;

        }







    }

})
