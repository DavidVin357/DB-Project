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

  const onCustomerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomerEmail(e.target.value)

  const onCustomerFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomerFirstName(e.target.value)

  const onCustomerLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomerLastName(e.target.value)

  const handleCustomerCreation = async () => {
    const insertionData = {
      email: customerEmail,
      first_name: customerFirstName,
      last_name: customerLastName,
    }

    let success = await api.createCustomer(insertionData)
    if (!success) {
      return
    }

    // Refresh Orders table
    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })
  }
  return (
    <div className='container'>
      <div>
        <h1>Create customer</h1>
        <Field
          fieldType='email'
          fieldName='user_email'
          title='Email'
          onChange={onCustomerEmailChange}
        />
        <Field
          fieldType='text'
          fieldName='first_name'
          title='First name'
          onChange={onCustomerFirstNameChange}
        />
        <Field
          fieldType='text'
          fieldName='last_name'
          title='Last name'
          onChange={onCustomerLastNameChange}
        />
        <button onClick={handleCustomerCreation}>Create customer</button>
      </div>
      <div className='customers'>
        <h2>Current customers</h2>

        {customersData?.columns.length ? (
          <TableView relationView={customersData} />
        ) : (
          <h2>No customers yet</h2>
        )}
      </div>
    </div>
  )
}

export default Customers
