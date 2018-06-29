
// THIS IS NOT HOOKED UP YET.

import EventBus from './eventBus.js';
import myMixin from './mixins.js';


Vue.component('prices', {
    mixins: [myMixin],
    data: function () {
        return {
            // thisWallet: null,
        }
    },
    props: ['', ''],
    template:
        `<div>
            <div class="">$\{{ myHoldingsTotalInUSD | formatUSD }} USD</div>
            <div class="">{{ myHoldingsTotalInBTC }} BTC</div>            
        </div>`,

    mounted: function () {
        // console.log("chart mounting");
        this.setupEvents();
    },

    methods: {
        setupEvents: function () {

            EventBus.$on(`wallet-built-${this.$parent._uid}`, (w) => {
                // console.log('w = ', w );                
                // this.thisWallet = w;
            });

        },

    }
})








export default ' ';
