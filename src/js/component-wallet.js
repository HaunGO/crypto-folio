import Vue from "vue/dist/vue.esm.js";
import EventBus from './eventBus.js';
import myMixin from './mixins.js';
// import store from "./store.js";


Vue.component('wallet', {
    mixins: [myMixin],
    data: function () {
        return {
            myHoldingsTotalInUSD: 0,
            myHoldingsTotalInBTC: 0,
            thisWallet: null,
        }
    },
    // props: [ 'holding', 'allCoins', 'title' ],
    props: [ 'holding', 'title' ],
    template:
            `<div class="walletBox ma1 tc">
                <slot></slot>
            </div>`,
            // <div class="">{{ myHoldingsTotalInBTC }} BTC</div>            
            // <div class="">$\{{ myHoldingsTotalInUSD | formatUSD }}</div>
  
    created () {
        // console.log('<wallet> component created');
        EventBus.$on('on-data-has-loaded', this.buildWallet );
        // console.log('holding ', this.holding);
 
        // USING THE SPREAD OPERATOR (...) DOES NOT TOTAL VALUES OF REPEATED KEYS.
        // this.$root.totalHoldings = {...this.$root.totalHoldings, ...this.holding};
        // SO THIS CUSTOM mergeHoldings() FUNCTION DOES THIS.
        this.$root.totalHoldings = this.mergeHoldings(this.$root.totalHoldings, this.holding);
    },
    methods:{
        buildWallet(){
            // console.log('wallet.buildWallet() !!!', this.holding);
            
            var useThis = this.holding;

            this.thisWallet = this.mixinBuildWallet(
                useThis,
                this.$store.getters.allCoins
            );

            this.totalUSD(this.thisWallet);
            this.totalBTC(this.thisWallet);

            EventBus.$emit(`wallet-built-${this._uid}`, this.thisWallet);

            //  console.log( store.state.allCoins );
            // console.log("!@!@!@!@!@! ", this.$store.getters.allCoins);


        },


        /* USES _LODASH.JS TO MERGE OBJECTS AND COMBINE VALUES FOR ANY DUPLICATE KEY:VALUE PAIRS.  */
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

export default '';