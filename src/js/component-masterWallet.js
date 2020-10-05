import Vue from "vue/dist/vue.esm.js";
import EventBus from './eventBus.js';
import myMixin from './mixins.js';

Vue.component('masterwallet', {
    mixins: [myMixin],
    data: function () {
        return {
            myHoldingsTotalInUSD: 0,
            myHoldingsTotalInBTC: 0,
            thisWallet: null,
            isMasterWallet: true,
            // totalHoldings: this.$root.totalholdings,
            totalHoldings: null,
        }
    },
    props: [ 'holding', 'title'],
    template:
            `<div class="walletBox ma1 tc" >
                <slot></slot>
            </div>`,
  
    mounted(){
        console.log('mounted !!!!!!!!!!!!!!!!!! holding ', this.holding);
        // if(this.holding == undefined){
        //     this.isMasterWallet = true;
        //     this.holding = this.$root.totalHoldings;
        // }
        // if (this.holding === "totalHoldings"){
        //     this.$root.masterWallet = this;
        //     console.log('!@#!@#!@# ', this.$root.masterWallet);
        // }

        // console.log('!@#!@#!@# ', this.totalHoldings);

        this.prebuildWallet(this.totalHoldings);
        EventBus.$on('on-data-has-loaded', this.buildWallet);
        // USING THE SPREAD OPERATOR (...) DOES NOT TOTAL VALUES OF REPEATED KEYS.
        // this.$root.totalHoldings = {...this.$root.totalHoldings, ...this.holding};
        // SO THIS CUSTOM mergeHoldings() FUNCTION DOES THIS.
        // this.$root.totalHoldings = this.mergeHoldings(this.$root.totalHoldings, this.holding);
    },
    updated(){
        // console.log('!@#!@#!@# updated ', this.$root.totalHoldings);
        if (this.$root.totalHoldings != null){
            this.prebuildWallet(this.$root.totalHoldings);  
        }
    },
    created(){
        // this.$root.totalHoldings = this.mergeHoldings(this.$root.totalHoldings, this.holding);
        // console.log('created ----- totalHoldings ', this.$root.totalHoldings);
    },

    methods:{

        prebuildWallet(thisHolding){
                //     thisHolding = this.$root.totalHoldings;    
                // }
                // this.$root.totalHoldings = this.mergeHoldings(this.$root.totalHoldings, thisHolding);
                this.thisWallet = this.mixinPrebuildWallet(thisHolding);
                // EventBus.$emit(`wallet-prebuilt-${this._uid}`, this.thisWallet);
                // Vue.nextTick(function () {
                    // EventBus.$emit("on-data-has-loaded");
                    EventBus.$emit(`wallet-prebuilt-${this._uid}`, this.thisWallet);
                // })

                // console.log('totalHoldings ', this.$root.totalHoldings);
                // console.log('prebuildWallet() this.thisWallet', this.thisWallet);
        },


        buildWallet(){            
            var thisWalletHolding = this.holding;
            this.thisWallet = this.mixinBuildWalletV2(
                thisWalletHolding,
                this.$store.getters.allCoins
            );
            this.totalUSD(this.thisWallet);
            this.totalBTC(this.thisWallet);
            EventBus.$emit(`wallet-built-${this._uid}`, this.thisWallet);
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