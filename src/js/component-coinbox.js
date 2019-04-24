
import EventBus from './eventBus.js';
import myMixin from './mixins.js';

// {{coin.symbol}} : {{coin.holding_value | formatUSD}}
// <div class="f7">{{ coin.name }}</div>

Vue.component('coinbox', {
    mixins: [myMixin],
    data: function () {
        return {
            thisWallet: null,
        }
    },
    props: ['coin'],
    template:
    `<div class="coinbox">
        <div class="flex flex-row flex-wrap justify-center pt2 ">
            <coin v-for="coin in thisWallet" :key="coin.name" :coin="coin">
            </coin>
        </div>
    </div>`,

    mounted: function () {
        // console.log("chart mounting");
        this.setupEvents();
    },

    methods:{
        setupEvents: function () {

            EventBus.$on(`wallet-built-${this.$parent._uid}`, (w) => {
                // console.log('w = ', w );                
                this.thisWallet = w;
            });

        },

    }
})


export default '';
