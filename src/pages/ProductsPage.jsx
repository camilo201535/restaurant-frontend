import{useState,useEffect,useCallback} from 'react'
import productService from '../services/product.service.js'
import providerService from '../services/provider.service.js'


function ProductsPage() {

  const [products, setProducts] = useState([])
  const [providers, setProviders] = useState([])

   const [formData, setFormData] = useState({ 
        name: '',
        description: '',
        price:  0 ,
        stock: 0,
        providerId: '',
      
  })

  const [selectProduct,setSelectProduct] = useState(null)




  const  [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  
  const  [isViewOpenModal, setIsViewOpenModal] = useState(false)
  
  const  [isEditOpenModal, setIsEditOpenModal] = useState(false)



  useEffect(() => { 

    const fetchProducts = async () => { 

      try {

        const  response  = await productService.getAllProducts()
        setProducts(response.data.data)

      }catch (error) {

        console.error('Error fetching products:', error)



      }
          }
            fetchProducts()

            }, [])

              useEffect(() => { 

    const fetchProviders = async () => { 

      try {

        const  response  = await providerService.getAllProviders()
        setProviders(response.data.data)

      }catch (error) {

        console.error('Error fetching providers:', error)

      }
          }
            fetchProviders()

            }, [])


          const  loadProducts = useCallback(async () => {

            try {

              const  response  = await productService.getAllProducts()
              setProducts(response.data.data)

            }catch (error) {

              console.error('Error  fetching products:', error)
            }
                },[])   

                const openCreateModal = () => {

                  setFormData({ 
                    name: '', 
                    description: '', 
                    price: '',
                    stock: 0,
                    providerId: '' })

                    setIsCreateOpenModal(true)
                }


                const openEditModal = (product) => {
                   setSelectProduct(product)

                   setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    providerId: product.providerId
                   })
                   setIsCreateOpenModal(false)
                   setIsViewOpenModal(false)
                   setIsEditOpenModal(true)
                }

                const closeCreateModal = () => {

                  setIsCreateOpenModal(false)
                }


                const closeEditModal = () => {

                   setIsEditOpenModal(false)
                }



                const handleDeleteProduct = async (productId) => {

                  const confirmDelete = window.confirm('Are you sure you want to delete this product?')

                  if (!confirmDelete) {
                    return
                  }

                  await productService.deleteProduct(productId)
                  await loadProducts()
                }


                const handleCreateProduct = (event) => {

                  const{name,value} = event.target

                  setFormData((prevFormData) => ({
                        ...prevFormData,
                        [name]: value

                  }))
                }


                const handleUpdateProduct =(event) => {

                  const {name,value} = event.target
                   setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value
                   }))
                }

          const  handleSubmitCreate = async  (event) => {

            event.preventDefault()

             await productService.createProduct({

              name: formData.name,
              description: formData.description,
              price: formData.price,
              stock: formData.stock,
              providerId: formData.providerId
            
              })

              closeCreateModal()
              await  loadProducts()
         }

         const handleSubmitUpdate = async (event) => {
            event.preventDefault()
            await productService.updateProduct(

              selectProduct.productId,
              {

                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                providerId: formData.providerId

              }

            )


            closeEditModal()
            await loadProducts()
            

         }

           return (
    <section>
       <div className="d-flex justify-content-between align-items-center mb-3">
         <div>
           <h2>Products</h2>
           <p className="text-muted mb-0">Seccion de productos</p>
         </div>
         <button type="button" className="btn btn-primary" onClick={openCreateModal}>
           New product
         </button>
       </div>

       <table className="table table-striped table-hover align-middle">
         <thead>
           <tr>
             <th>Name</th>
             <th>Description</th>
             <th>Price</th>
             <th>Stock</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody>
           {products.map((product) => (
             <tr key={product.productId}>
               <td>{product.name}</td>
               <td>{product.description}</td>
               <td>{product.price}</td>
               <td>{product.stock}</td>
               <td>
                 <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(product)}>
                   Edit
                 </button>
                 <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(product.productId)}>
                   Delete
                 </button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>


              {isCreateOpenModal && (
         <div>
           <h3>New product</h3>
           <form onSubmit={handleSubmitCreate}>
             <label className="form-label d-block mb-2">
               Name
               <input
                 type="text"
                 className="form-control"
                 name="name"
                 value={formData.name}
                 onChange={handleCreateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Description
               <input
                 type="text"
                 className="form-control"
                 name="description"
                 value={formData.description}
                 onChange={handleCreateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Price
               <input
                 type="number"
                 className="form-control"
                 name="price"
                 value={formData.price}
                 onChange={handleCreateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Stock
               <input
                 type="number"
                 className="form-control"
                 name="stock"
                 value={formData.stock}
                 onChange={handleCreateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Provider
               <select
                 className="form-control"
                 name="providerId"
                 value={formData.providerId}
                 onChange={handleCreateProduct}
               >
                 <option value="">Select a provider</option>
                 {providers.map((provider) => (
                   <option key={provider.providerId} value={provider.providerId}>
                     {provider.name}
                   </option>
                 ))}
               </select>
             </label>
             <button type="submit" className="btn btn-primary me-2">Create</button>
             <button type="button" className="btn btn-secondary" onClick={closeCreateModal}>
               Cancel
             </button>
           </form>
         </div>
       )}






       {isEditOpenModal && (
         <div>
           <h3>Update product</h3>
           <form onSubmit={handleSubmitUpdate}>
             <label className="form-label d-block mb-2">
               Name
               <input
                 type="text"
                 className="form-control"
                 name="name"
                 value={formData.name}
                 onChange={handleUpdateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Description
               <input
                 type="text"
                 className="form-control"
                 name="description"
                 value={formData.description}
                 onChange={handleUpdateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Price
               <input
                 type="number"
                 className="form-control"
                 name="price"
                 value={formData.price}
                 onChange={handleUpdateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Stock
               <input
                 type="number"
                 className="form-control"
                 name="stock"
                 value={formData.stock}
                 onChange={handleUpdateProduct}
               />
             </label>
             <label className="form-label d-block mb-2">
               Provider
               <select
                 className="form-control"
                 name="providerId"
                 value={formData.providerId}
                 onChange={handleUpdateProduct}
               >
                 <option value="">Select a provider</option>
                 {providers.map((provider) => (
                   <option key={provider.providerId} value={provider.providerId}>
                     {provider.name}
                   </option>
                 ))}
               </select>
             </label>
             <button type="submit" className="btn btn-primary me-2">Update</button>
             <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
               Cancel
             </button>
           </form>
         </div>
       )}
    </section>

  );
}

export default ProductsPage