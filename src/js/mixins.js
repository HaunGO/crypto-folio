var myMixin = {

    data: function () {
        return {
          myWallet: [],
          bitcoinPrice: 0,
          totalHoldings: {},
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
            let num = (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            // if the amount is less than $0.10, add an extra decimal point.
            if (num < 0.10){
                num = (n*1).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); 
            }
            return num;
        }
    },

    methods: {
        mixinBuildWallet: function(_myCoins, _allCoins) {
            // console.log('_myCoins ', _myCoins);
            return _allCoins.filter(coin => {
                // console.log('!@!@!@!@!! ', Object.keys(_myCoins).indexOf(coin.symbol));
                return Object.keys(_myCoins).indexOf(coin.symbol) >= 0;
            }).map(c => {
                return Object.assign({}, c, {
                    holding: _myCoins[c.symbol],
                    holding_value: c.quote.USD.price * (_myCoins[c.symbol])
                });
            }).sort((a, b) => {
                return a.holding_value - b.holding_value;
            }).reverse();
        },

        // RETURNS ONLY THE COIN OBJECT YOU WANT:
        filterCoin: function(x){
            var arr = this.$store.getters.allCoins.slice();            
            return arr.filter(function(coin) {
                if(coin.symbol === x){
                    return coin.symbol.indexOf(x) > -1;
                }
            })
        }, 
 
        formatAsUSD: function(n){
            let num = (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            // if the amount is less than $0.10, add an extra decimal point.
            if (num < 0.10) {
                num = (n*1).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            }
            return num;
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
            var N = _thisWallet_.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)
            this.myHoldingsTotalInUSD = N;
        },

        totalBTC: function(_thisWallet_){
            this.bitcoinPrice = this.filterCoin("BTC")[0].quote.USD.price;
            let n = Number(this.myHoldingsTotalInUSD) / Number(this.bitcoinPrice) ;
            this.myHoldingsTotalInBTC = n.toFixed(6);
        }
    }
}

export default myMixin;