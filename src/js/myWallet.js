

// var apiURL = 'https://api.github.com/repositories/11730342/commits?per_page=5&sha=';
var apiURL = 'https://api.coinmarketcap.com/v1/ticker/';



new Vue({

    el: '#wallet',
    delimiters: ['${', '}'],

    data: {
        apies : [
                "https://api.coinmarketcap.com/v1/ticker/",
        ],
        allCoins: [],
        myHoldings: {
            // "BCH": 1,
            // "BTC": 2,
            "LTC": 50,
            "ETH": 1,
            "PPT": 20,
            "ADA": 500,
            "OMG": 30,
            "EOS": 130,
            "RDD": 1800,
            "SALT": 0,
            "VERI": 2,
            "PLR": 350
        },
        myWallet: [],
        myHoldingsTotalInUSD: 0,
        myHoldingsTotalInBTC: 0,
        fetchTick:0,
        bitcoinPrice:0,

        favorites:[
             {name:'Litecoin',  symbol: 'LTC', icon:'link/to/graphic', color:'red'}
            ,{name:'Ethereum',  symbol: 'ETH', icon:'link/to/graphic', color:'green'}
            ,{name:'EOS.io',    symbol: 'EOS', icon:'link/to/graphic', color:'blue'}
        ]

    },





    mounted: function() {

        this.fetchData();

        //
        setInterval(function () {
            this.fetchData();
        }.bind(this), 100000);

    },






    computed: {
        calculateHoldings: function(){
            return this.myWallet.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)
        }
    },





    filters:{
        formatUSD: function(n) {
            return (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    },




    methods: {
        formatAsUSD: function(n) {
            return (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },

        coinClass: function(c){
            let icon;
            switch(c) {
                case "EOS":
                case "ADA":
                case "RDD":
                case "OMG":
                case "SALT":
                    icon = c;
                    break;
                default:
                    icon = c+'-alt';
            }
            return icon;
        }

        ,fetchData: function() {
            var self = this;

            $.get(self.apies[0], function(response) {
                // console.log(response);
                self.myWallet = self.buildMyWallet(response);
                self.totalUSD();
                self.totalBTC();
                // self.buildChart1();
                self.buildChart2();
            });

            self.fetchTick++;

        },


        totalUSD: function(){

            let n = 0;
            console.log('1', this.myWallet);
            this.myWallet.reduce( (total, c) => {
                // console.log(c.holding_value);
                n += c.holding_value;
                // return total = c.holding_value
            })

            // console.log('$ ', n);

            // this.myHoldingsTotalInUSD = (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            this.myHoldingsTotalInUSD = n;

            // console.log('$ ', this.myHoldingsTotalInUSD);
        },

        totalBTC: function(){
// this.bitcoinPrice = this.filterCoin("BTC")[0].price_usd;

            let n = Number(this.myHoldingsTotalInUSD) / Number(this.bitcoinPrice) ;

            this.myHoldingsTotalInBTC = n.toFixed(6);


            // console.log( this.myHoldingsTotalInUSD );
            // console.log( this.myHoldingsTotalInBTC );
            // console.log( this.filterCoin("BTC"));
            // console.log( this.filterCoin("BTC")[0].price_usd );
        },


        buildMyWallet: function(coins) {
            // window.console.log('buildmyWallet()', this.myHoldings);
            this.allCoins = coins;

            return coins.filter( coin => {
                // return Object.keys(this.myHoldings).indexOf(coin.id) >= 0;
                return Object.keys(this.myHoldings).indexOf(coin.symbol) >= 0;
            }).map( c => {
                return Object.assign({}, c, {
                    // holding: this.myHoldings[c.id],
                    // holding_value:  c.price_usd * this.myHoldings[c.id]
                    holding: this.myHoldings[c.symbol]
                    ,holding_value:  c.price_usd * this.myHoldings[c.symbol]

                });
            });
        },





        // filterCoin: function(x){
        //     var arr = this.allCoins.slice();
        //       return arr.filter(function(coin) {
        //
        //           // return coin.id.indexOf(x) > -1;
        //           if(coin.symbol === x){
        //
        //               return coin.symbol.indexOf(x) > -1;
        //           }
        //
        //       })
        // },







        buildChart2: function(){

            var chartData = [];

            chartData = chartData.concat( this.myWallet.filter(coin => coin.holding > 0 ).map( coin => [coin.name, coin.holding_value] ) );

            console.log('chartData', chartData);



            var chart = bb.generate({
                bindto: "#chart2",
                donut: {
                    title: "$ " + String(this.formatAsUSD(this.myHoldingsTotalInUSD))
                },
                legend:{
                    show:true
                },
                data: {
                    type: "donut",
                    // columns: [
                    //     ["data1", 30, 200, 100, 170, 150, 250],
                    //     ["data2", 130, 100, 140, 35, 110, 50]
                    // ]
                    columns: chartData,
                    colors: {
                        "Bitcoin": "gold",
                        "Litecoin": "silver",
                        "Ethereum": "gray",
                        "OmiseGO": "lightblue",
                        "EOS": "purple"
                    }

                }
            });
        },













/*
    GOOGLE CHART
 */
        buildChart1: function(){

            console.log('buildChart()');

            google.charts.load("current", {packages:["corechart"]});
            google.charts.setOnLoadCallback(drawChart);

            var myData = [
                ['Coin', 'Percentage']
            ];


            // console.log(this.myWallet);

            myData = myData.concat( this.myWallet.map( coin => [coin.name, coin.holding_value] ) );



            console.log(myData);



            function drawChart() {

                var data = google.visualization.arrayToDataTable(myData);

                var options = {
                    // title: 'Crypto Play Wallet',
                    pieHole: 0.3
                    // ,is3D: true
                    // colors: ['red', 'blue', 'green', 'gold']
                    // ,legend: 'none'
                    ,legend: {
                        alignment:'center'
                        , position:'right'
                        // , maxLines:3
                    }
                    // ,pieStartAngle: 0
                    // ,slices: {  1: {offset: 0.2},
                    //             2: {offset: 0.3},
                    //             4: {offset: 0.4},
                    //             5: {offset: 0.5},
                    //         }
                    ,sliceVisibilityThreshold: .01
                };

                var chart = new google.visualization.PieChart(document.getElementById('chart1'));

                chart.draw(data, options);

            }


        }




    }


});
