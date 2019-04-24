
import EventBus from './eventBus.js';
import myMixin from './mixins.js';


Vue.component('coin', {
    mixins: [myMixin],
    props: ['coin', 'thisChart'],
    template:
        `<div>
            <div class="coinBox pa1 ma1 tc"  ref="coin-{{coin.symbol}}" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">

                <div class="fw7">{{ coin.symbol }}</div>
                <div class="">{{ coin.holding }}</div>
                <div class="">$\{{ coin.holding_value | formatUSD }}</div>
    <hr>
                <div class="f5 mt2" >$\{{ coin.price_usd }} </div>
                <div class="f7 tl" v-bind:class="{ 'dark-red': coin.percent_change_1h<0, 'dark-green': coin.percent_change_1h>0 }" >1h {{ coin.percent_change_1h }}% </div>
                <div class="f7 tl" v-bind:class="{ 'dark-red': coin.percent_change_24h<0, 'dark-green': coin.percent_change_24h>0 }" >1d {{ coin.percent_change_24h }}% </div>
                <div class="f7 tl" v-bind:class="{ 'dark-red': coin.percent_change_7d<0, 'dark-green': coin.percent_change_7d>0 }" >1w {{ coin.percent_change_7d }}% </div>

            </div>
        </div>`,
    methods:{
        onMouseEnter:function(e){
            // console.log('onMouseEnter() ', e);
            // console.log(this.$parent);

            EventBus.$emit(`coin-mouseover-${this.$parent._uid}`, this.coin.name );
            // EventBus.$emit(`coin-rollover-`);
        },
        onMouseLeave:function(e){
            // console.log('onMouseLeave() ', e);
            EventBus.$emit(`coin-mouseleave-${this.$parent._uid}`, this.coin.name );
        }
    }
})


export default '';
