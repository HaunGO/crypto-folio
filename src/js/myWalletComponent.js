




Vue.component('my-component', {
    data: function() {
        return {
            message: 'Hello from Vue data!'
        }
    },
    // props: ['message'],
    // template: '<div> ${ message } </div>'
    template: '<div> {{ message }} </div>'
})

// Define a new component called button-counter
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})





new Vue({
    el: '#app',
})




new Vue({
    el: '#components-demo'
})








export default '';
