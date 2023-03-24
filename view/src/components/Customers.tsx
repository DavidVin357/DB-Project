import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'

const Customers = () => {
  const [customersData, setCustomersData] = useState<RelationView>()

  const [customerEmail, setCustomerEmail] = useState('')
  const [customerFirstName, setCustomerFirstName] = useState('')
  const [customerLastName, setCustomerLastName] = useState('')

  useEffect(() => {
    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })
  }, [])
  const clearValues = () => {
    setCustomerEmail('')
    setCustomerFirstName('')
    setCustomerLastName('')
  }
  const handleCustomerCreation = async () => {
    const insertionData = {
      email: customerEmail,
      first_name: customerFirstName,
      last_name: customerLastName,
    }

    for (const [key, value] of Object.entries(insertionData)) {
      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createCustomer(insertionData)
    if (!success) {
      return
    }

    // Clear fields
    clearValues()

    // Refresh Orders table
    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })
  }

  return (
    <div className='container'>
      <div>
        <h1>Create customer</h1>
        <form>
          <Field
            fieldType='email'
            fieldName='customer_email'
            title='Email'
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='first_name'
            title='First name'
            value={customerFirstName}
            onChange={(e) => setCustomerFirstName(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='last_name'
            title='Last name'
            value={customerLastName}
            onChange={(e) => setCustomerLastName(e.target.value)}
          />
          <button onClick={handleCustomerCreation} type='reset'>
            Create customer
          </button>
        </form>
      </div>
      <div className='customers'>
        <h2>Current customers</h2>

        {customersData?.rows.length ? (
          <TableView relationView={customersData} />
        ) : (
          <h3>No customers yet</h3>
        )}
      </div>
    </div>
  )
}

export default Customers
