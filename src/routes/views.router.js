import { Router } from 'express'

export const viewsRouter = Router()

viewsRouter.get("/realtimeproducts", async (req,res) => {
    res.render('realtimeproducts')
}
)

import ProductManager from "../controllers/ProductManager.js"
const productManager = new ProductManager(('./src/models/products.json'))

viewsRouter.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.render("home", {products})
    } catch (error) {
        res.status(500).send("Internal Server Error rendering home hdlb"); 
    }
})

