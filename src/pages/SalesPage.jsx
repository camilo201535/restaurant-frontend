import { useState, useEffect, useCallback } from 'react'
import saleService from '../services/sale.service.js'
import userService from '../services/user.service.js'
import productService from '../services/product.service.js'

const emptyForm = { userId: '', saleDate: '' }
const emptyItem = { productId: '', quantity: 1 }

// Convierte la fecha del backend al formato de <input type="datetime-local">
const toInputDate = (date) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function SalesPage() {
  const [sales, setSales] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [mode, setMode] = useState(null) // 'create' | 'edit' | null (formulario cerrado)
  const [selectedSale, setSelectedSale] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [items, setItems] = useState([emptyItem])

  const loadSales = useCallback(async () => {
    try {
      const response = await saleService.getAllSales()
      setSales(response.data.data)
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers()
      setUsers(response.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  const loadProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts()
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  useEffect(() => {
    loadSales()
    loadUsers()
    loadProducts()
  }, [loadSales, loadUsers, loadProducts])

  const handleDelete = async (saleId) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return

    try {
      await saleService.deleteSale(saleId)
      await loadSales()
    } catch (error) {
      alert(error.response?.data?.message || error.message)
    }
  }

  const openCreate = () => {
    setSelectedSale(null)
    setFormData(emptyForm)
    setItems([emptyItem])
    setMode('create')
  }

  const openEdit = (sale) => {
    setSelectedSale(sale)
    setFormData({ userId: sale.userId, saleDate: toInputDate(sale.saleDate) })
    setMode('edit')
  }

  const closeForm = () => setMode(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const addItem = () => setItems((prev) => [...prev, emptyItem])

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (mode === 'create') {
        await saleService.createSale({
          userId: Number(formData.userId),
          products: items.map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity)
          }))
        })
        await loadProducts() // el stock cambió
      } else {
        await saleService.updateSale(selectedSale.saleId, {
          userId: Number(formData.userId),
          saleDate: formData.saleDate
        })
      }

      closeForm()
      await loadSales()
    } catch (error) {
      alert(error.response?.data?.message || error.message)
    }
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Sales</h2>
          <p className="text-muted mb-0">Seccion de ventas</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          New sale
        </button>
      </div>

      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Products</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.saleId}>
              <td>{new Date(sale.saleDate).toLocaleString()}</td>
              <td>{sale.user ? `${sale.user.name} ${sale.user.lastName}` : '-'}</td>
              <td>
                {sale.saleProducts
                  ?.map((sp) => `${sp.product?.name ?? 'Product'} x${sp.quantity}`)
                  .join(', ')}
              </td>
              <td>$ {Number(sale.totalAmount).toLocaleString()}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => openEdit(sale)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(sale.saleId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mode && (
        <div>
          <h3>{mode === 'create' ? 'New sale' : 'Update sale'}</h3>
          <form onSubmit={handleSubmit}>
            <label className="form-label d-block mb-2">
              User
              <select
                className="form-control"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.name} {user.lastName}
                  </option>
                ))}
              </select>
            </label>

            {mode === 'edit' && (
              <label className="form-label d-block mb-2">
                Sale date
                <input
                  type="datetime-local"
                  className="form-control"
                  name="saleDate"
                  value={formData.saleDate}
                  onChange={handleChange}
                  required
                />
              </label>
            )}

            {mode === 'create' && (
              <div className="mb-3">
                <h5>Products</h5>
                {items.map((item, index) => (
                  <div key={index} className="d-flex gap-2 mb-2">
                    <select
                      className="form-control"
                      value={item.productId}
                      onChange={(event) =>
                        handleItemChange(index, 'productId', event.target.value)
                      }
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.productId} value={product.productId}>
                          {product.name} (stock: {product.stock})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      className="form-control w-25"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(index, 'quantity', event.target.value)
                      }
                      required
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={addItem}
                >
                  Add product
                </button>
              </div>
            )}

            <button type="submit" className="btn btn-primary me-2">
              {mode === 'create' ? 'Create' : 'Update'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={closeForm}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </section>
  )
}

export default SalesPage