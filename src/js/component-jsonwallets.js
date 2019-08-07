import Vue from "vue/dist/vue.esm.js";
import EventBus from "./eventBus.js";
import myMixin from "./mixins.js";
import store from "./store.js";


Vue.component("jsonwallets", {
    mixins: [myMixin],

    data: function() {
        return {
            myHoldingsTotalInUSD: 0,
            myHoldingsTotalInBTC: 0,
            thisWallet: null,
            walletJson: null,

            globalMarketCap: 0,
            bitcoinDominance: 0,
            total24HrVolume: 0
        };
    },

    props: ["holding", "jsonholding", "title"],

    template: `
              <div>
                <div v-for="wallets in walletJson" class="flex flex-row flex-wrap justify-center">
                  <div v-for="(value, key)  in wallets" >
                    <wallet :holding="value">
                      <h3>{{key}}</h3>
                      <chart></chart>
                      <totals></totals>
		                  <coinbox></coinbox>
                    </wallet>       
                  </div>
                </div>
              </div>
            `,

    created() {
        console.log("<jsonwallet> component created");
        // EventBus.$on("on-data-has-loaded", this.buildWallet);
        // console.log('holding ', this.holding);
        // console.log(this);
        // console.log(this.$el);
        // console.log(this.$refs.jsonwallet.dataset.jsonholding);
        // console.log(this.$el.dataset.jsonholding);
    },

    mounted() {
        // console.log("~~mounted()", this.$el.dataset.jsonholding);
        this.loadJSON(this.$el.dataset.jsonholding);
    },

    methods: {
        buildWallet() {
            // this.allCoins =
            console.log("oh.. hello component for my jsonwallet !");
        },
        loadJSON(json) {
            let self = this;
            // console.log(json);
            fetch(json)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    console.log("!1", myJson);
                    self.walletJson = myJson;
                    // self.walletJson = JSON.stringify(myJson);
                    // console.log(self.walletJson);
                    console.log("!2", JSON.stringify(myJson));
                })
                .catch(function() {
                    console.log("there must have been an error");
                });
        }
    }
});

export default "";
