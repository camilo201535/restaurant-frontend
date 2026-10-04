import{useState,useEffect,useCallback} from 'react'
import userService from '../services/user.service.js'


function UsersPage() {

  const [users, setUsers] = useState([])

   const [formData, setFormData] = useState({ 
        idNumber: '',
        name: '',
        lastName: '',
        email: '',
        password: '',
        role: 'employee',
      
  })

  const [selectUser,setSelectUser] = useState(null)




  const  [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  
  const  [isEditOpenModal, setIsEditOpenModal] = useState(false)



  useEffect(() => { 

    const fetchUsers = async () => { 

      try {

        const  response  = await userService.getAllUsers()
        setUsers(response.data.data)

      }catch (error) {

        console.error('Error fetching users:', error)



      }
          }
            fetchUsers()

            }, [])


          const  loadUsers = useCallback(async () => {

            try {

              const  response  = await userService.getAllUsers()
              setUsers(response.data.data)

            }catch (error) {

              console.error('Error  fetching users:', error)
            }
                },[])   

                const openCreateModal = () => {

                  setFormData({ 
                    idNumber: '',
                    name: '', 
                    lastName: '',
                    email: '', 
                    password: '',
                    role: 'employee' })

                    setIsCreateOpenModal(true)
                }


                const openEditModal = (user) => {
                   setSelectUser(user)

                   setFormData({
                    idNumber: user.idNumber,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    password: '',
                    role: user.role
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


                const handleDeleteUser = async (userId) => {

                  const confirmDelete = window.confirm('Are you sure you want to delete this user?')

                  if (!confirmDelete) {
                    return
                  }

                  await userService.deleteUser(userId)
                  await loadUsers()
                }


                const handleCreateUser = (event) => {

                  const{name,value} = event.target

                  setFormData((prevFormData) => ({
                        ...prevFormData,
                        [name]: value

                  }))
                }


                const handleUpdateUser =(event) => {

                  const {name,value} = event.target
                   setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value
                   }))
                }

          const  handleSubmitCreate = async  (event) => {

            event.preventDefault()

             await userService.createUser({

              idNumber: formData.idNumber,
              name: formData.name,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              role: formData.role
            
              })

              closeCreateModal()
              await  loadUsers()
         }


         const handleSubmitUpdate = async (event) => {
          event.preventDefault()

            try {
              await userService.updateUser(
                selectUser.userId,
                {
                  idNumber: formData.idNumber,
                  name: formData.name,
                  lastName: formData.lastName,
                  email: formData.email,
                  role: formData.role
                }
              )

              closeEditModal()
              await loadUsers()
            } catch (error) {
              console.error('Error updating user:', error)
              alert(error.response?.data?.message || error.message)
            }
          }

      


  return (
    <section>
       <div className="d-flex justify-content-between align-items-center mb-3">
         <div>
           <h2>Users</h2>
           <p className="text-muted mb-0">Seccion de usuarios</p>
         </div>
         <button type="button" className="btn btn-primary" onClick={openCreateModal}>
           New user
         </button>
       </div>

       <table className="table table-striped table-hover align-middle">
         <thead>
           <tr>
             <th>ID number</th>
             <th>Name</th>
             <th>Last name</th>
             <th>Email</th>
             <th>Role</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody>
           {users.map((user) => (
             <tr key={user.userId}>
               <td>{user.idNumber}</td>
               <td>{user.name}</td>
               <td>{user.lastName}</td>
               <td>{user.email}</td>
               <td>{user.role}</td>
               <td>
                 <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(user)}>
                   Edit
                 </button>
                 <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.userId)}>
                   Delete
                 </button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>

       {isCreateOpenModal && (
         <div>
           <h3>New user</h3>
           <form onSubmit={handleSubmitCreate}>
             <label className="form-label d-block mb-2">
               ID number
               <input
                 type="text"
                 className="form-control"
                 name="idNumber"
                 value={formData.idNumber}
                 onChange={handleCreateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Name
               <input
                 type="text"
                 className="form-control"
                 name="name"
                 value={formData.name}
                 onChange={handleCreateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Last name
               <input
                 type="text"
                 className="form-control"
                 name="lastName"
                 value={formData.lastName}
                 onChange={handleCreateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Email
               <input
                 type="email"
                 className="form-control"
                 name="email"
                 value={formData.email}
                 onChange={handleCreateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Password
               <input
                 type="password"
                 className="form-control"
                 name="password"
                 value={formData.password}
                 onChange={handleCreateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Role
               <select
                 className="form-control"
                 name="role"
                 value={formData.role}
                 onChange={handleCreateUser}
               >
                 <option value="employee">employee</option>
                 <option value="admin">admin</option>
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
           <h3>Update user</h3>
           <form onSubmit={handleSubmitUpdate}>
             <label className="form-label d-block mb-2">
               ID number
               <input
                 type="text"
                 className="form-control"
                 name="idNumber"
                 value={formData.idNumber}
                 onChange={handleUpdateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Name
               <input
                 type="text"
                 className="form-control"
                 name="name"
                 value={formData.name}
                 onChange={handleUpdateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Last name
               <input
                 type="text"
                 className="form-control"
                 name="lastName"
                 value={formData.lastName}
                 onChange={handleUpdateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Email
               <input
                 type="email"
                 className="form-control"
                 name="email"
                 value={formData.email}
                 onChange={handleUpdateUser}
               />
             </label>
             <label className="form-label d-block mb-2">
               Role
               <select
                 className="form-control"
                 name="role"
                 value={formData.role}
                 onChange={handleUpdateUser}
               >
                 <option value="employee">employee</option>
                 <option value="admin">admin</option>
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


export default UsersPage;