import io from 'socket.io-client'
const socket = io(process.env.HOST_URL)
console.log('Inside socket io js', process.env.HOST_URL)
// console.log('Inside socket io js', process.env.NOW_URL)
export default socket
