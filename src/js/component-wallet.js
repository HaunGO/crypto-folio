



import EventBus from './eventBus.js';
import myMixin from './mixins.js';


Vue.component('wallet', {
    mixins: [myMixin],
    data: function () {

        return {
            // myWallet: [],
            myHoldingsTotalInUSD: 0,
            myHoldingsTotalInBTC: 0,
            // bitcoinPrice: 0,
            thisWallet: null,
            // allWallets: null,
        }

    },
    props: [
        'holding',
        'allCoins',
        'title',
        // 'totalHoldings',
        // 'thisChart'
    ],
    // `<div class="outline pa1 ma1" v-on:click="buildWallet">
    // <div>{{ holding }}</div>
    template:
        `<div class="walletBox ma1 tc">
            <slot></slot>
            <div class="">$\{{ myHoldingsTotalInUSD | formatUSD }} USD</div>
            <div class="">{{ myHoldingsTotalInBTC }} BTC</div>

            <coinbox :this-wallet="thisWallet"></coinbox>


        </div>`,
    created () {
        // console.log('<wallet> component created');
        EventBus.$on('on-data-has-loaded', this.buildWallet );
        console.log('holding ', this.holding);







        // USING THE SPREAD OPERATOR (...) TO COMBINE OBJECTS, BUT IT DOES NOT TOTAL VALUES OF REPEATED KEYS.
        // this.$root.totalHoldings = {...this.$root.totalHoldings, ...this.holding};
        // SO THIS CUSTOM mergeHoldings() FUNCTION DOES THIS.
        this.$root.totalHoldings = this.mergeHoldings(this.$root.totalHoldings, this.holding);

        // console.log('~~~ ', this.$root.totalHoldings);


        // let aaa = Object.assign({}, this.totalHoldings, this.holding );
        // this.totalHoldings = aaa;
        // console.log('totalHoldings' , this.totalHoldings);
        // this.totalHoldings = extend(this.holding);
        // console.log('totalHoldings', this.totalHoldings);
    },
    methods:{
        buildWallet(){
            // console.log('wallet.buildWallet() !!!', this.holding);
            // console.log('wallet.buildWallet() !!!', this.totalHoldings);

            var useThis;
            // if(this.holding == undefined || null){
                // useThis = this.totalHoldings;
            // }else{
                useThis = this.holding;
            // }

            this.thisWallet = this.mixinBuildWallet(useThis, this.allCoins);

            this.totalUSD(this.thisWallet);
            this.totalBTC(this.thisWallet);

            EventBus.$emit(`wallet-built-${this._uid}`, this.thisWallet);

            // this.masterHoldings = this.holding;
        },
        /*
            USES _LODASH.JS TO MERGE OBJECTS AND COMBINE VALUES FOR ANY DUPLICATE KEY:VALUE PAIRS.
         */
        mergeHoldings(o1, o2) {
            var a = Object.keys(o1);
            var b = Object.keys(o2);
            var c = a.concat(b);
            // THIS _LODASH METHOD IS WHERE THE MAGIC HAPPENS:
            // https://lodash.com/docs/4.17.10#uniq
            var uniques = _.uniq(c);

            return uniques.reduce((h,k) => {
                // equals this or 0 (instead of null or undefined)
                var a = o1[k] || 0;
                var b = o2[k] || 0;
                h[k] = a + b;
                return h;
            }, {})
        }
    }
})




export default ' ';
