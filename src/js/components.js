



import EventBus from './eventBus.js';
import myMixin from './mixins.js';


Vue.component('wallet', {
    mixins: [myMixin],
    data: function () {

        return {
            myWallet: [],
            myHoldingsTotalInUSD: 0,
            myHoldingsTotalInBTC: 0,
            bitcoinPrice: 0,
            thisWallet: null,

            // thisChart: null,
        }

    },
    props: [
        'holding',
        'allCoins',
        'title'
        // 'thisChart'
    ],
    // `<div class="outline pa1 ma1" v-on:click="buildWallet">
    // <div>{{ holding }}</div>
    template:
        `<div class="walletBox pa1 ma1 tc">
            <slot></slot>
            <div class="">$\{{ myHoldingsTotalInUSD | formatUSD }} USD</div>
            <div class="">{{ myHoldingsTotalInBTC }} BTC</div>

            <chart></chart>

            <div class="flex flex-row flex-wrap justify-center pt2 ">
                <coin v-for="coin in thisWallet" :key="coin.name" :coin="coin">
                </coin>
            </div>
        </div>`,
    created () {
        // console.log('<wallet> component created');
        EventBus.$on('on-data-has-loaded', this.buildWallet );
    },
    methods:{
        buildWallet(){
            console.log('wallet.buildWallet() !!!');

            // console.log('this.holding', this.holding);

            // this.thisWallet = this.$parent.sampleFunction(this.holding);
            this.thisWallet = this.mixinBuildWallet(this.holding, this.allCoins);
            // console.log(this.thisWallet);

            this.totalUSD(this.thisWallet);
            this.totalBTC(this.thisWallet);
            // this.thisChart = this.buildChart(this.$el, this.thisWallet);
            EventBus.$emit(`wallet-built-${this._uid}`, this.thisWallet);

        }
    }
})


// {{coin.symbol}} : {{coin.holding_value | formatUSD}}

Vue.component('coin', {
    mixins: [myMixin],
    props: ['coin', 'thisChart'],
    template:
        `<div class="coinBox pa1 ma1 tc"  @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">

            <div class="">{{ coin.holding }}</div>
            <div class="fw7">{{ coin.symbol }}</div>
            <div class="f7">{{ coin.name }}</div>
            <div class="f7 dark-pink">{{ coin.price_usd }}</div>
            <div class="">{{ coin.holding_value | formatUSD }}</div>
            <div class="f7 mt2" v-bind:class="{ 'dark-red': coin.percent_change_1h<0, 'dark-green': coin.percent_change_1h>0 }" > {{ coin.percent_change_1h }}% </div>
            <div class="f7" v-bind:class="{ 'dark-red': coin.percent_change_24h<0, 'dark-green': coin.percent_change_24h>0 }" > {{ coin.percent_change_24h }}% </div>
            <div class="f7" v-bind:class="{ 'dark-red': coin.percent_change_7d<0, 'dark-green': coin.percent_change_7d>0 }" > {{ coin.percent_change_7d }}% </div>

        </div>`,
    methods:{
        onMouseEnter:function(e){
            // console.log('onMouseEnter() ', e);
            console.log(this.$parent);
            // NEED TO ACCESS CHART FROM HERE
            // console.log(this.thisChart);
            // this.thisChart.focus("Litecoin");

            EventBus.$emit(`coin-mouseover-${this.$parent._uid}`, this.coin.name );
            // EventBus.$emit(`coin-rollover-`);

        },
        onMouseLeave:function(e){
            // console.log('onMouseLeave() ', e);
            EventBus.$emit(`coin-mouseleave-${this.$parent._uid}`, this.coin.name );
        }
    }
})




Vue.component('chart', {
    data: function () {

        return {

            thisChart: null,
        }

    },
    mixins: [myMixin],
    template:
        `<div ref="chart" class="chart" style="width:100px; height:100px; margin:auto; position:relative;">
            HELLO THIS WILL BE THE CHART.
        </div>`,


    mounted: function(){
        console.log("chart mounting");
        this.setupEvents();
    },



    methods: {
        setupEvents: function(){
            // EventBus.$on(`coin-rollover-`, focusThis);
            EventBus.$on(`coin-mouseover-${this.$parent._uid}`, (c) => {
                console.log("this in focus", this);
                this.thisChart.focus(c);

            });

            EventBus.$on(`coin-mouseleave-${this.$parent._uid}`, (c) => {
                console.log("this OUT focus", this);
                // this.thisChart.revert(c);
                this.thisChart.defocus(c);
                this.thisChart.focus();
            });

            EventBus.$on(`wallet-built-${this.$parent._uid}`, this.buildChart);

        },
        buildChart: function(thisWallet){

            var chartDiv = this.$refs.chart;

            console.log('refs', this.$refs);

            var chartData = [];

            chartData = chartData.concat( thisWallet.filter(coin => coin.holding > 0 ).map( coin => [coin.name, coin.holding_value] ) );

            var chartTitle = "";

            this.thisChart = bb.generate({
                // bindto: "#chart",
                bindto: chartDiv,
                donut: {
                    // title: chartTitle,
                    labels:false,
                    expand:true,
                    label: {
                        show:false
                        // ratio: 0.01,
                    }
                },
                // legend:{
                    // show:false,
                    // position:"bottom",
                // },
                data: {
                    type: "donut",
                    labels: false,
                    columns: chartData,
                    colors: {
                        "Bitcoin" : "#f9a021",
                        "Litecoin" : "#b6b6b6",
                        "Ethereum" : "#999999",
                        "OmiseGO" : "#3979ff",
                        "EOS" : "#9aa3ee",
                        "Populous" : '#cfb949',
                        "ReddCoin" : "#f01416",
                        "Veritaseum" : "#ff991d",
                        "Pillar" : "#00beff",
                        "Dent" : "#af0000",
                        "Cardano" : "#33c8c9"
                    },
                    onclick: function (d, i) {
                        console.log("onclick", d, i);
                        // console.log(chart.selected());
                    },
                    onover: function (d, i) {
                        // console.log("onover", d, i);
                    },
                    onout: function (d, i) {
                        // console.log("onout", d, i);
                    }

                },


            });


            // this.thisChart.focus("Litecoin");

            this.thisChart.legend.hide();




            console.log('!~!~!~!~!~!~!~!~!~chart  ', this.thisChart);

            // return this.thisChart;




        }
    }

})





export default ' ';
