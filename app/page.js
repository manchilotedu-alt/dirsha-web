'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [clientName, setClientName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*')
    if (data) setProducts(data)
  }

  async function handleCreateSale(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase.rpc('create_sale_record', {
      p_user_id: user?.id || '00000000-0000-0000-0000-000000000000',
      p_vehicle_id: '00000000-0000-0000-0000-000000000000',
      p_payment_method: paymentMethod,
      p_client_name: clientName,
      p_items: [{ productId: selectedProduct, quantity: parseInt(quantity) }]
    })

    if (error) {
      setMessage('ስህተት፦ ' + error.message)
    } else {
      setMessage('ሽያጩ በስኬት ተመዝግቧል!')
      setClientName('')
      setQuantity(1)
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '500px', margin: '20px auto', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#111' }}>ድርሻ (Dirsha) - የሽያጭ መመዝገቢያ</h2>
      {message && <p style={{ color: message.includes('ስህተት') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}
      
      <form onSubmit={handleCreateSale}>
        <div style={{ marginBottom: '15px' }}>
          <label>የደንበኛ ስም፦</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>የክፍያ መንገድ፦</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="CASH">በጥሬ ገንዘብ (Cash)</option>
            <option value="TRANSFER">በባንክ ሐዋላ (Bank Transfer)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>እቃ መምረጫ፦</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          >
            <option value="">-- እቃ ይምረጡ --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.unit_price} ETB)</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>ብዛት፦</label>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
        >
          {loading ? 'እየመዘገበ ነው...' : 'ሽያጭ መዝግብ'}
        </button>
      </form>
    </main>
  )
}
