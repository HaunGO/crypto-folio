

var myMixin = {

    data: function () {
        return {
          myWallet: [],
          bitcoinPrice: 0,
          totalHoldings: {},
        //   allCoins: [],
        };
    },

    computed: {
        calculateHoldings: function(){
            return this.myWallet.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)
        }
    },

    filters:{
        formatUSD: function(n){
            return (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    },

    methods: {
        mixinBuildWallet: function(_myCoins, _allCoins) {
            // console.log('mixinBuildWallet()()()()');
            // console.log('mixinBuildWallet', _myCoins, _allCoins);
            // console.log('mixinBuildWallet', _allCoins);
            // console.log('mixinBuildWallet() ', _myCoins);
           
            return _allCoins.filter(coin => {
                return Object.keys(_myCoins).indexOf(coin.symbol) >= 0;
            }).map(c => {
                return Object.assign({}, c, {
                    holding: _myCoins[c.symbol],
                    holding_value: c.price_usd * (_myCoins[c.symbol])
                });
            }).sort((a, b) => {
                return a.holding_value - b.holding_value;
            }).reverse();
        },

        // RETURNS ONLY THE COIN OBJECT YOU WANT:
        filterCoin: function(x){
            // console.log('filterCoin() ', x);
            var arr = this.allCoins.slice();
            return arr.filter(function(coin) {
                if(coin.symbol === x){
                    return coin.symbol.indexOf(x) > -1;
                }
            })
        },
        
        formatAsUSD: function(n){
            // console.log('formatAsUSD() ', n);
            return (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },

        // THIS CREATES THE APPROPRIATE CLASSNAME FOR THE ICON
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
        },

        wordifyNumber: function(n){
            // console.log( self.wordifyNumber(419281384539234123) );
            // console.log( self.wordifyNumber(419281384539234) );
            // console.log( self.wordifyNumber(419281384539) );
            // console.log( self.wordifyNumber(419281384) );
            // console.log( self.wordifyNumber(419281) );
            // console.log( self.wordifyNumber(419) );
            // console.log( self.wordifyNumber(41) );
            // console.log( self.wordifyNumber(4) );

            let incrementName = '';
            let num;

            if (Math.abs(Number(n)) >= 1.0e+15) {
                num = Math.abs(Number(n)) / 1.0e+15
                incrementName = "Quadrillion";

            } else if (Math.abs(Number(n)) >= 1.0e+12) {
                num = Math.abs(Number(n)) / 1.0e+12
                incrementName = "Trillion";

            } else if (Math.abs(Number(n)) >= 1.0e+9) {
                num = Math.abs(Number(n)) / 1.0e+9
                incrementName = "Billion";

            } else if (Math.abs(Number(n)) >= 1.0e+6) {
                num = Math.abs(Number(n)) / 1.0e+6
                incrementName = "Million";

            } else if (Math.abs(Number(n)) >= 1.0e+3) {
                num = Math.abs(Number(n)) / 1.0e+3
                incrementName = "Thousand";

            } else {
                num = n;
                incrementName = "";
            }

            return Math.round(parseFloat(num) * 10) / 10 + ' ' + incrementName;
        },

        totalUSD: function(_thisWallet_){
            // console.log('totalUSD()');
            var N = _thisWallet_.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)

            this.myHoldingsTotalInUSD = N;
        },

        totalBTC: function(_thisWallet_){
            // console.log('totalBTC() 1');
            // console.log("this.bitcoinPrice ", this.bitcoinPrice);
            // console.log( "this.filterCoin(BTC)[0].price_usd ", this.bitcoinPrice );
            
            this.bitcoinPrice = this.filterCoin("BTC")[0].price_usd;
            // console.log('totalBTC() 2');
            let n = Number(this.myHoldingsTotalInUSD) / Number(this.bitcoinPrice) ;
            // console.log('totalBTC() 3');
            this.myHoldingsTotalInBTC = n.toFixed(6);
            // console.log('totalBTC() 4');
            // console.log( "this ", this.myHoldingsTotalInBTC );
        }
    }
}



export default myMixin;
