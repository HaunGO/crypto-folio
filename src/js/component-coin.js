import Vue from "vue/dist/vue.esm.js";
import EventBus from './eventBus.js';
import myMixin from './mixins.js';

Vue.component('coin', {
    mixins: [myMixin],
    props: ['coin', 'thisChart'],
    template:
        `<div class="flex ba">
            <div class="pa1 ma1 tc"  ref="coin-{{coin.symbol}}" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
                <div v-if="coin.hasData" class="f6 fw1">{{ coin.logo }}</div>
                <div class="fw7">{{ coin.symbol }}</div>
                <div class="">{{ coin.holding | formatWithCommas }}</div>
                <div v-if="coin.hasData">
                        <div class="">$\{{ coin.holding_value | formatUSD }}</div>
                        <hr>
                        <div class="f5 mt2" >$\{{ coin.quote.USD.price | formatUSD }} </div>
                        <div class="f7 tl" v-bind:class="{ 'dark-red': coin.quote.USD.percent_change_1h<0, 'dark-green': coin.quote.USD.percent_change_1h>0 }" >H: {{ coin.quote.USD.percent_change_1h | formatUSD}}% </div>
                        <div class="f7 tl" v-bind:class="{ 'dark-red': coin.quote.USD.percent_change_24h<0, 'dark-green': coin.quote.USD.percent_change_24h>0 }" >D: {{ coin.quote.USD.percent_change_24h | formatUSD}}% </div>
                        <div class="f7 tl" v-bind:class="{ 'dark-red': coin.quote.USD.percent_change_7d<0, 'dark-green': coin.quote.USD.percent_change_7d>0 }" >W: {{ coin.quote.USD.percent_change_7d | formatUSD}}% </div>
                </div>
                <div v-else>
                    <hr>
                    <small>no<br>data</small>
                </div>
            </div>
        </div>`,
    methods:{
        onMouseEnter:function(e){
            EventBus.$emit(`coin-mouseover-${this.$parent._uid}`, this.coin.name );
        },
        onMouseLeave:function(e){
            EventBus.$emit(`coin-mouseleave-${this.$parent._uid}`, this.coin.name );
        }
    }
})
export default ''; 