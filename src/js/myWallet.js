

// var apiURL = 'https://api.github.com/repositories/11730342/commits?per_page=5&sha=';
var apiURL = 'https://api.coinmarketcap.com/v1/ticker/';




/*
const vues = document.querySelectorAll(".wallet");
const eachVue = Array.prototype.forEach;
eachVue.call(vues, (el, index) => {
    new Vue({
 */




new Vue({

    el: '#wallet',
    // el,
    delimiters: ['${', '}'],

    data: {
        apies : [
                "https://api.coinmarketcap.com/v1/ticker/",
                "https://api.coinmarketcap.com/v1/ticker/dent/",
                "https://api.coinmarketcap.com/v1/ticker/pillar/"
        ],
        allCoins: [],
        myHoldings: {
            // "BCH": 1,
            // "BTC": 2,
            // "LTC": 1,
            // "ETH": 1,
            // "PPT": 20,
            // "ADA": 500,
            // "OMG": 30,
            // "EOS": 130,
            // "RDD": 1800,
            // "SALT": 0,
            // "VERI": 2,
            // "PLR": 350
        },
        myWallet: [],
        myHoldingsTotalInUSD: 0,
        myHoldingsTotalInBTC: 0,
        fetchTick: 0,
        bitcoinPrice: 0,

        // favorites:[
        //      {name:'Litecoin',  symbol: 'LTC', icon:'link/to/graphic', color:'red'}
        //     ,{name:'Ethereum',  symbol: 'ETH', icon:'link/to/graphic', color:'green'}
        //     ,{name:'EOS.io',    symbol: 'EOS', icon:'link/to/graphic', color:'blue'}
        // ]

    },





    mounted: function() {

        var x = this.$el.getAttribute('data-holdings');
        this.myHoldings = JSON.parse(x);

        console.log(this.myHoldings);

        this.fetchData();

        setInterval(function () {
            this.fetchData();
        }.bind(this), 60*1000);

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

            let status = (r) => {
                if (r.ok) {
                    // return Promise.resolve(r)
                    return r;
                } else {
                    // return Promise.reject(new Error(r.statusText))
                    throw new Error(r.statusText);
                }
            }

            let json = (r) => r.json();

            let promises = self.apies.map(url => {

                return fetch(url)
                    .then(status)
                    .then(json)
                    // .then(d => Promise.resolve(d))
                    // .catch(e => Promise.reject(new Error(e)));
            });







            Promise.all(promises).then(d => {
                console.log('nice! now do something.', d);

                self.allCoins = d.reduce((acc, cur) => {
                    return acc.concat(cur);
                }, [] );

                // for (var i = 0, x = d.length; i < x; i++) {
                //     console.log(d[i]);
                //     self.allCoins.push(d[i]);
                // }
                console.log('self.allCoins', self.allCoins);

                self.myWallet = self.buildMyWallet(self.allCoins);
                self.totalUSD();
                self.totalBTC();
                self.buildChart2();

            }).catch(e => {
                console.log('oops, something has gone wrong.', e);
            });






/*
            $.get(self.apies[0], function(response) {
                console.log(response);
                self.myWallet = self.buildMyWallet(response);
                self.totalUSD();
                self.totalBTC();
                // self.buildChart1();
                self.buildChart2();
            });
 */





            self.fetchTick++;

        },



        totalUSD: function(){

            var N = this.myWallet.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)

            // this.myHoldingsTotalInUSD = (N*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            this.myHoldingsTotalInUSD = N;

            // console.log(this.myHoldingsTotalInUSD);
        },



        totalBTC: function(){
            // console.log('totalBTC()');
            this.bitcoinPrice = this.filterCoin("BTC")[0].price_usd;

            let n = Number(this.myHoldingsTotalInUSD) / Number(this.bitcoinPrice) ;
            // let n = this.myHoldingsTotalInUSD / this.bitcoinPrice ;

            // this.myHoldingsTotalInBTC = n;
            this.myHoldingsTotalInBTC = n.toFixed(6);

            // console.log( this.myHoldingsTotalInUSD, this.bitcoinPrice );

            // console.log( this.myHoldingsTotalInUSD );
            // console.log( this.myHoldingsTotalInBTC );
            // console.log( this.filterCoin("BTC"));
            // console.log( this.filterCoin("BTC")[0].price_usd );

        },





        buildMyWallet: function(coins) {
            // window.console.log('buildmyWallet()', this.myHoldings);
            // this.allCoins = coins;

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





        filterCoin: function(x){
            var arr = this.allCoins.slice();
              return arr.filter(function(coin) {

                  // return coin.id.indexOf(x) > -1;
                  if(coin.symbol === x){

                      return coin.symbol.indexOf(x) > -1;
                  }

              })
        },







        buildChart2: function(){

            var chartData = [];

            chartData = chartData.concat( this.myWallet.filter(coin => coin.holding > 0 ).map( coin => [coin.name, coin.holding_value] ) );

            // console.log('chartData', chartData);


            var chart = bb.generate({
                bindto: "#chart",
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


})



/*
});
 */
