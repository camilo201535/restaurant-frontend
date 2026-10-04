import{useState,useEffect,useCallback} from 'react'
import providerService from '../services/provider.service.js'


function ProvidersPage() {

  const [providers, setProviders] = useState([])

  const [formData, setFormData] = useState({ 
        name: '',
        phone: '',
        email: '',
        city: '',
      
  })


  const [selectProvider,setSelectProvider] = useState(null)




  const  [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  
  const  [isEditOpenModal, setIsEditOpenModal] = useState(false)



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


          const  loadProviders = useCallback(async () => {

            try {

              const  response  = await providerService.getAllProviders()
              setProviders(response.data.data)

            }catch (error) {

              console.error('Error  fetching providers:', error)
            }
                },[])   

                const openCreateModal = () => {

                  setFormData({ 
                    name: '', 
                    phone: '', 
                    email: '',
                    city: '' })

                    setIsCreateOpenModal(true)
                }


                const openEditModal = (provider) => {
                   setSelectProvider(provider)

                   setFormData({
                    name: provider.name,
                    phone: provider.phone,
                    email: provider.email,
                    city: provider.city
                   })
                   setIsCreateOpenModal(false)
                   setIsEditOpenModal(true)
                }

                const closeCreateModal = () => {

                  setIsCreateOpenModal(false)
                }


                const closeEditModal = () => {

                   setIsEditOpenModal(false)
                }

                const handleDeleteProvider = async (providerId) => {

                  const confirmDelete = window.confirm('¿Seguro que querés eliminar este proveedor?')

                  if (!confirmDelete) {
                    return
                  }

                  await providerService.deleteProvider(providerId)
                  await loadProviders()
                }


                const handleCreateProvider = (event) => {

                  const{name,value} = event.target

                  setFormData((prevFormData) => ({
                        ...prevFormData,
                        [name]: value

                  }))
                }


                const handleUpdateProvider =(event) => {

                  const {name,value} = event.target
                   setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value
                   }))
                }

          const  handleSubmitCreate = async  (event) => {

            event.preventDefault()

             await providerService.createProvider({

              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              city: formData.city
            
              })

              closeCreateModal()
              await  loadProviders()
         }

         const handleSubmitUpdate = async (event) => {
            event.preventDefault()
            await providerService.updateProvider(

              selectProvider.providerId,
              {

                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                city: formData.city

              }

            )


            closeEditModal()
            await loadProviders()
            

         }


  return (
    <section>
       <div className="d-flex justify-content-between align-items-center mb-3">
         <div>
           <h2>Providers</h2>
           <p className="text-muted mb-0">Seccion de proveedores</p>
         </div>
         <button type="button" className="btn btn-primary" onClick={openCreateModal}>
           New provider
         </button>
       </div>

       <table className="table table-striped table-hover align-middle">
         <thead>
           <tr>
             <th>Name</th>
             <th>Phone</th>
             <th>Email</th>
             <th>City</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody>
           {providers.map((provider) => (
             <tr key={provider.providerId}>
               <td>{provider.name}</td>
               <td>{provider.phone}</td>
               <td>{provider.email}</td>
               <td>{provider.city}</td>
               <td>
                 <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(provider)}>
                   Edit
                 </button>
                 <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProvider(provider.providerId)}>
                   Delete
                 </button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>

       {isCreateOpenModal && (
         <div>
           <h3>New provider</h3>
           <form onSubmit={handleSubmitCreate}>
             <label className="form-label d-block mb-2">
               Name
               <input
                 type="text"
                 className="form-control"
                 name="name"
                 value={formData.name}
                 onChange={handleCreateProvider}
               />
             </label>
             <label className="form-label d-block mb-2">
               Phone
               <input
                 type="text"
                 className="form-control"
                 name="phone"
                 value={formData.phone}
                 onChange={handleCreateProvider}
               />
             </label>
             <label className="form-label d-block mb-2">
               Email
               <input
                 type="email"
                 className="form-control"
                 name="email"
                 value={formData.email}
                 onChange={handleCreateProvider}
               />
             </label>
             <label className="form-label d-block mb-2">
               City
               <input
                 type="text"
                 className="form-control"
                 name="city"
                 value={formData.city}
                 onChange={handleCreateProvider}
               />
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
           <h3>Update provider</h3>
           <form onSubmit={handleSubmitUpdate}>
             <label className="form-label d-block mb-2">
               Name
               <input
                 type="text"
                 className="form-control"
                 name="name"
                 value={formData.name}
                 onChange={handleUpdateProvider}
               />
             </label>
             <label className="form-label d-block mb-2">
               Phone
               <input
                 type="text"
                 className="form-control"
                 name="phone"
                 value={formData.phone}
                 onChange={handleUpdateProvider}
               />
             </label>
             <label className="form-label d-block mb-2">
               Email
               <input
                 type="email"
                 className="form-control"
                 name="email"
                 value={formData.email}
                 onChange={handleUpdateProvider}
               />
             </label>
             <label className="form-label d-block mb-2">
               City
               <input
                 type="text"
                 className="form-control"
                 name="city"
                 value={formData.city}
                 onChange={handleUpdateProvider}
               />
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


export default ProvidersPage;