import Vue from "vue/dist/vue.esm.js";
import EventBus from './eventBus.js';
import myMixin from './mixins.js';

Vue.component('wallet', {
    mixins: [myMixin],
    data: function () {
        return {
            myHoldingsTotalInUSD: 0,
            myHoldingsTotalInBTC: 0,
            thisWallet: null,
            totalHoldings: null,
            isMasterWallet: false,
        }
    },
    props: [ 'holding', 'title', 'master'],
    template:
            `<div class="walletBox ma1 tc" >
                <slot></slot>
            </div>`,
  
    mounted(){
        if (this.master){
            this.isMasterWallet = true;
            this.$root.masterWallet = this;
        }else{
            this.prebuildWallet(this.holding);
        }
        // EVENT LISTENER IN myCryptoFolio.js
        EventBus.$on('on-data-has-loaded', this.buildWallet);
    },
    created(){
        // console.log('created ----- totalHoldings ', this.$root.totalHoldings);
    },
    updated() {
        // console.log('!@#!@#!@# updated ', this.$root.totalHoldings);
        if ((this.isMasterWallet) && (this.$root.totalHoldings != null)) {
            this.prebuildWallet(this.$root.totalHoldings);
        }
    },

    methods:{

        prebuildWallet(thisHolding){
            // console.log('totalHoldings ', this.$root.totalHoldings);
            // console.log('prebuildWallet() this.thisWallet', this.thisWallet);
            if (thisHolding != null){
                this.$root.totalHoldings = this.mergeHoldings(this.$root.totalHoldings, thisHolding);
                this.thisWallet = this.mixinPrebuildWallet(thisHolding);
                // EVENT LISTENER IN component-chart.js
                EventBus.$emit(`wallet-prebuilt-${this._uid}`, this.thisWallet);
            }
        },



         
        

        buildWallet(){
            // console.log('buildWallet()', this.isMasterWallet);
            var thisWalletHolding;
            
            if(this.isMasterWallet){
                thisWalletHolding = this.$root.totalHoldings;
            }else{
                thisWalletHolding = this.holding;
            }
            
            this.thisWallet = this.mixinBuildWalletV2( thisWalletHolding, this.$store.getters.allCoins );
            this.totalUSD(this.thisWallet);
            this.totalBTC(this.thisWallet);

            EventBus.$emit(`wallet-built-${this._uid}`, this.thisWallet);

        },


        /*  USING THE SPREAD OPERATOR (...) DOES NOT TOTAL VALUES OF REPEATED KEYS.
            SO THIS CUSTOM mergeHoldings() FUNCTION DOES THIS.
            USES _LODASH.JS TO MERGE OBJECTS AND COMBINE VALUES FOR ANY DUPLICATE KEY:VALUE PAIRS.  */
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