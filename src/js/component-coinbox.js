




import EventBus from './eventBus.js';
import myMixin from './mixins.js';



// {{coin.symbol}} : {{coin.holding_value | formatUSD}}
// <div class="f7">{{ coin.name }}</div>

Vue.component('coinbox', {
    mixins: [myMixin],
    props: ['coin', 'thisWallet'],
    template:
    `<div>
        [coinbox]
        <div class="flex flex-row flex-wrap justify-center pt2 ">
            <coin v-for="coin in thisWallet" :key="coin.name" :coin="coin">
            </coin>
        </div>
    </div>`,
    methods:{
    }
})








export default ' ';
