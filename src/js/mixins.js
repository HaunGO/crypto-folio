





var myMixin = {
    // created: function() {
        // console.log('myMixin created() ~~~~~~~~~');
    // },
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
            console.log('mixinBuildWallet', _myCoins, _allCoins);
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
    }
}



export default myMixin;
