import { Router } from 'express';
import  ProductManager  from '../controllers/ProductManager.js'

export const productsRouter = Router()

const productsJsonFile = './src/models/products.json'
const prodManager = new ProductManager(productsJsonFile)

productsRouter.get('/', async (req,res) => {
    try {
        const {limit} = req.query
        const products = await prodManager.getProducts()

        if (limit){
            const limitedProducts = products.slice(0,limit)
            res.json(limitedProducts)
        } else {
            res.json(products)
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - reading products" })
    }
})  

productsRouter.get('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id)
        const product = await prodManager.getProductById(id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - reading one product" })
    }
})

productsRouter.post('/', async (req,res) => {
    try {
        // all fields : title,description,code,price,status,stock,category,thumbnails in json ProductObject
        // Updates only the fields that it receives in the json through the body, the rest remains the same
        const response = await prodManager.addProduct(req.body)
        res.status(200).json({message: "Product added successfully"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - added product" })
    }
})

productsRouter.put('/:id', async (req,res) => {
    const id = parseInt(req.params.id)
    try {
        const response = await prodManager.updateProduct(id,req.body)
        res.status(201).json({message: "Product updated successfully"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - update product" })
    }
}
)


productsRouter.delete('/:id', async (req,res) => {
    const id = parseInt(req.params.id)
    try {
        const response = await prodManager.deleteProduct(id)
        res.status(200).json({message: "Product successfully deleted"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - deleting product"})
    }
}
)

// Middleware for not defined routes
productsRouter.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
})