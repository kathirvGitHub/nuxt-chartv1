const app = require('express')()
const { Nuxt, Builder } = require('nuxt')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const axios = require('axios')
// const host = process.env.NOW_URL || '127.0.0.1' // new code in RC3
const host = '0.0.0.0'
const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

const { isRealString } = require('./utils/validation')
const { getJDEAvailability } = require('./JDE/jde')
const { User } = require('./models/user')
var { mongoose } = require('./db/mongoose')

// Import and set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const nuxt = new Nuxt(config)

// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Start express server
server.listen(port, host)
console.log('Server listening on ' + host + ':' + port)

var jdeUser = null

User.find().then((users) => {
    jdeUser = users[0];
}, (e) => {
    console.log(e);
})

// Socket.io
io.on('connection', (socket) => {
  console.log('New user connected')
  console.log('JDE user info to be user', jdeUser)
  socket.on('getAvailabilityData', function (userInfo) {
    console.log('getAvailabilityData called by client', userInfo)
    // var itemAvailabilityData = {
    //   itemNames: ['Item Z', 'Item Y', 'Item X', 'Item W', 'Item V'],
    //   itemAvailableNos: [getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100)]
    // };
    // socket.emit('updateAvailabilityData', itemAvailabilityData);
    getJDEAvailability(socket, jdeUser, userInfo)
  });
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
