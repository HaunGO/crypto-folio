import Vue from "vue/dist/vue.esm.js";
import EventBus from './eventBus.js';
import myMixin from './mixins.js';

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
                <div class="flex flex-row flex-wrap justify-center pt2 ba">
                    <coin v-for="coin in thisWallet" :key="coin.name" :coin="coin">
                    </coin>
                </div>
            </div>`,

    created: function () { 
        this.setupEvents();
    },

    methods:{
        setupEvents: function () {
            // console.log('coin > setupEvents()');
            EventBus.$on(`wallet-prebuilt-${this.$parent._uid}`, (w) => {
                // console.log('wallet prebuilt event ');
                this.thisWallet = w;
            });
            EventBus.$on(`wallet-built-${this.$parent._uid}`, (w) => {
                this.thisWallet = w;
            });
        },
    }
})


export default '';
  