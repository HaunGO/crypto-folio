


import EventBus from './eventBus.js';
import myMixin from './mixins.js';





Vue.component('chart', {
    data: function () {
        return {
            thisChart: null,
        }
    },
    mixins: [myMixin],
    template: `<div ref='chart' class="chart tc "> [chart] </div>`,

    mounted: function(){
        // console.log("chart mounting");
        this.setupEvents();
    },



    methods: {

        setupEvents: function(){
            // EventBus.$on(`coin-rollover-`, focusThis);
            EventBus.$on(`coin-mouseover-${this.$parent._uid}`, (c) => {
                // console.log("this in focus", this);
                this.thisChart.focus(c);

            });

            EventBus.$on(`coin-mouseleave-${this.$parent._uid}`, (c) => {
                // console.log("this OUT focus", this);
                this.thisChart.defocus(c);
                this.thisChart.revert();
                // this.thisChart.focus();
            });

            // EventBus.$on(`wallet-built-${this.$parent._uid}`, this.buildChart);
            EventBus.$on(`wallet-built-${this.$parent._uid}`, this.buildChart );

        },





        buildChart: function(_thisWallet_){
            console.log('~!~!~!~!~!~!~!~!~ !~ ! ~! ~! ~! ', _thisWallet_);
            var chartDiv = this.$refs.chart;

            // console.log('refs', this.$refs);

            var chartData = [];

            chartData = chartData.concat( _thisWallet_.filter(coin => coin.holding > 0 ).map( coin => [coin.name, coin.holding_value] ) );

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
                        // console.log("onclick", d, i);
                        // console.log(chart.selected());
                    },
                    onover: function (d, i) {
                        // console.log("onover", d, i);

                        // EventBus.$on(`chart-mouseover-${this.$parent._uid}`, (c) => {
                        //     // console.log("this OUT focus", this);
                        //     this.thisChart.defocus(c);
                        //     this.thisChart.revert();
                        //     // this.thisChart.focus();
                        // });

                    },
                    onout: function (d, i) {
                        // console.log("onout", d, i);
                    }

                },


            });


            // this.thisChart.focus("Litecoin");

            this.thisChart.legend.hide();




            // console.log('!~!~!~!~!~!~!~!~!~chart  ', this.thisChart);

            // return this.thisChart;




        }
    }

})


export default ' ';
