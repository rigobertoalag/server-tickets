import express from 'express'
import morgan from 'morgan'
import { Server as socketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { PORT } from './config.js'

const app = express()

const server = http.createServer(app)
const io = new socketServer(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

app.use(cors())
app.use(morgan('dev'))

io.on('connection', (socket) => {
    console.log('user connected ' + socket.id)

    socket.on('message', (message) => {
        socket.broadcast.emit('message', {
            body: message,
            from: socket.id
        })
    })

    socket.on('message_removed', (message) => {
        console.log('desde message_removed', message)
        socket.broadcast.emit('message_removed', message)
        // socket.broadcast.emit('message', {
        //     body: message,
        //     from: socket.id
        // })
    })
})

server.listen(PORT)

console.log(`Server running on port ${PORT}`)