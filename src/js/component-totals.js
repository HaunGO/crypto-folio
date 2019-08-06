

import EventBus from './eventBus.js';
import myMixin from './mixins.js';


Vue.component("totals", {
  mixins: [myMixin],
  props: ["holding", "allCoins"],
  data: function() {
    return {
      thisWallet: null,
      myHoldingsTotalInUSD: 0,
      myHoldingsTotalInBTC: 0,
    };
  },

  template: `<div class="totals tc ">
                    [ ---------
                    <div class="">{{ myHoldingsTotalInBTC }} BTC</div>            
					<div class="">$\{{ myHoldingsTotalInUSD | formatUSD }}</div>
					--------- ]
			</div>`,

  mounted: function() {
    this.setupEvents();
    // this.totalBTC(this.thisWallet);
  },

  methods: {
    setupEvents: function() {
    //   console.log("totals - methods - setupEvents");
      	EventBus.$on(`wallet-built-${this.$parent._uid}`, w => {
        // console.log("totals - methods - setupEvents ---- wallet-built !!!");
        	this.buildTotals(w);
      	});
    },

    buildTotals: function(_thisW_) {
    	//   console.log("totals buildTotals(); ", _thisW_);
		//   console.log("this", this);
		//   this.thisWallet = this.mixinBuildWallet( this.holding, this.allCoins );
		this.totalUSD(_thisW_); 
		// this.totalBTC(_thisW_);
		// 	 this.thisWallet = w;
		//   this.myHoldingsTotalInUSD = this.totalUSD(this.thisWallet);
		//   this.myHoldingsTotalInBTC = 2;
    }
  }
});


export default ''; 