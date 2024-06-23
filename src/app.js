import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { productsRouter } from './routes/products.router.js'
import { cartsRouter } from './routes/carts.router.js'
import { viewsRouter} from './routes/views.router.js'

const PORT = 8080
const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

// express-handlebars
app.engine("handlebars",engine())
app.set("view engine","handlebars")
app.set("views","./src/views")

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

const httpServer = app.listen(PORT,() => console.log(`Server listening in port ${PORT}`))

import ProductManager from './controllers/ProductManager.js'
const productManager = new ProductManager('./src/models/products.json')

const io = new Server(httpServer)

io.on("connection", async (socket) => {

    console.log('One client connected')

    socket.emit("products", await productManager.getProducts())

    socket.on("dropProduct", async (id) => {           
        try {
            // drop client indicated product
            await productManager.deleteProduct(id)
            // return all new product lists 
            socket.emit("products", await productManager.getProducts())
        } catch (error) {
            console.error("Drop Product Error:", error);
            // possible client error send
        }
    })

    socket.on("addProduct", async (product) => {
        try {
            await productManager.addProduct(product)  
            // return all new product lists 
            socket.emit("products", await productManager.getProducts())
        } catch (error) {
            console.error("Add Product Error:", error);
            // possible client error send           
        }
    })
        
})

