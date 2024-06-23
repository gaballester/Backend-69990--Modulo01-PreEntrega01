const socket = io()

socket.on("products", (data) => {
    try {
        productsRender(data)
    } catch (error) {
        console.error("Error ocurred in productsRender:", error)
    }
})

socket.on("products", (data) => {
    try {
        productsRender(data)
    } catch (error) {
        console.error("Error ocurred in productsRender:", error)
    }
})

const productsRender = (products) => {
    try {
        const productContainer = document.getElementById("productContainer")
        let htmlCode = `
            <div class="container text-center">
            <div class="row justify-content-md-center">
                <h3>List all Products</h3>
                <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Code</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">stock</th>
                        <th scope="col">Active</th>
                        <th scope="col">Delete Item</th>
                    </tr>
                </thead>
                <tbody>`  
            
            products.forEach(prod => {
                
                let imgArray = prod.tumbnails
      
                htmlCode += `    
                            <tr>
                                    <td>${prod.id}</td>
                                    <td>${prod.code}</td>
                                    <td>${prod.title}</td>
                                    <td>${prod.description}</td>
                                    <td>${prod.category}</td>
                                    <td>${prod.price}</td>
                                    <td>${prod.stock}</td>
                                    <td>${prod.status}</td> 
                                    <td><button class="btn btn-dark"  onclick="removeElement(${prod.id})">Delete</button></td>
                            </tr> `      
            }   
        )   

        htmlCode += `
                        </tbody>
                    </table>
                    
                </div>
                </div>
        `
        productContainer.innerHTML = htmlCode

    } catch (error) {
        console.error("Error ocurred in productsRender:", error)
    }
}

const removeElement = (proId) => {
    try {
        console.log("Removing product with ID:",proId);
        socket.emit("dropProduct", proId); // Emitir evento para eliminar el producto en el servidor
    } catch (error) {
        console.error("Error occurred in removeElement:", error);
    }
}


document.getElementById('btnAddProd').addEventListener('click',() =>
    {
        alert("presiono boton add")
        addProduct()
    })

const addProduct = () => {
    try {
        const product = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            code: document.getElementById("code").value,
            stock: document.getElementById("stock").value,
            category: document.getElementById("category").value,
            status: document.getElementById("status").value === "true",
            thumbnails: [document.getElementById("thumbnails").value]
        }
        socket.emit("addProduct", product)       
        
    } catch (error) {
        console.log('error',error)
    }
}


