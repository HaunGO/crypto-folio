



import EventBus from './eventBus.js';
import myMixin from './mixins.js';


Vue.component('wallet', {
    mixins: [myMixin],
    props: [
        'holding',
        'allCoins',
        'thisWallet',
    ],
    template:
        `<div class="outline pa1 ma1" v-on:click="buildWallet">
            <slot></slot>
            <div>{{ holding }}</div>
            <coin v-for="coin in thisWallet" :coin="coin">
            </coin>
        </div>`,
    created () {
        console.log('<wallet> component created');
        EventBus.$on('on-data-has-loaded', this.buildWallet );
    },
    methods:{
        buildWallet(){
            console.log('wallet.buildWallet() !!!');
            // this.thisWallet = this.$parent.sampleFunction(this.holding);
            this.thisWallet = this.mixinBuildWallet(this.holding, this.allCoins);
            // console.log(this.thisWallet);

        }
    }
})



Vue.component('coin', {
    mixins: [myMixin],
    props: ['coin'],
    template:
        `<div>
            {{coin.symbol}} : {{coin.holding_value | formatUSD}}
        </div>`,
})




export default ' ';
