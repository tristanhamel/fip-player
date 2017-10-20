import Vue from 'vue';

import app from './components/app';
// import store from './store/store';

import './styles/global.scss';


const vm = new Vue({
  el: '#app',
  components: {
    app
  }
});
