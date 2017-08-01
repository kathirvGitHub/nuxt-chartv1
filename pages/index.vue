<template>
  <div>
    <highcharts :options="options" ref="highcharts"></highcharts>
    <button @click="updateChart">Start Updating Chart</button>
    <h2>Logged In User : {{ getUserInfo }}</h2> <button @click="printName">Print my user info</button>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import { mapGetters } from 'vuex'
import socket from '~/plugins/socket.io.js'
import Vue from 'vue'
import VueHighcharts from 'vue-highcharts'
Vue.use(VueHighcharts)

var chartOptions = {
  chart: {
    type: 'bar'
  },
  title: {
    text: 'Item availability 1'
  },
  subtitle: {
    text: 'Source: JDE EnterpriseOne, Forza DV910'
  },
  xAxis: {
    categories: ['Items'],
    title: {
      text: ['Items']
    }
  },
  yAxis: {
    title: {
      text: 'Availability',
      align: 'high'
    },
    labels: {
      overflow: 'justify'
    }
  },
  tooltip: {
    valueSuffix: ' primary UOM'
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true
      }
    }
  },
  credits: {
    enabled: false
  },
  series: [{
    name: 'Availability',
    data: [1, 3, -1]
  }]
}

export default {
  middleware: 'userInfo',
  components: {
    Logo
  },
  data () {
    return {
      options: chartOptions
    }
  },
  beforeMount () {
    socket.on('updateAvailabilityData', (itemAvailabilityData) => {
      var chart = this.$refs.highcharts.chart
      chart.series[0].setData(itemAvailabilityData.itemAvailableNos)
      chart.xAxis[0].setCategories(itemAvailabilityData.itemNames)
    })
  },
  computed: mapGetters(['getUserInfo']),
  methods: {
    updateChart () {
      // var chart = this.$refs.highcharts.chart
      // var newdata = [Math.floor(Math.random() * (200)) - 100, Math.floor(Math.random() * (200)) - 100, Math.floor(Math.random() * (200)) - 100]
      // var newdata = [this.getRandomInt(-100, 100), this.getRandomInt(-100, 100), this.getRandomInt(-100, 100)]
      // console.log(chart.series[0])
      // chart.series[0].setData(newdata)
      // chart.xAxis[0].setTitle({
      //   text: 'New Title'
      // })
      // console.log('getAvailabilityData called to server')
      // socket.emit('getAvailabilityData', this.getUserInfo)
      this.timerFunction(this.getUserInfo)
    },
    getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
    },
    timerFunction (siteUser) {
      setInterval(function () {
        console.log('getAvailabilityData called to server')
        socket.emit('getAvailabilityData', siteUser)
      }, 3000)
    },
    printName () {
      console.log('Inside printname method', this.getUserInfo)
    }
  },
  head () {
    return {
      title: 'JDE Chart v1'
    }
  }
}
</script>

<style>
.container
{
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title
{
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle
{
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links
{
  padding-top: 15px;
}
</style>
