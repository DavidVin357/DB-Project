import { useEffect, useState } from 'react'
import { Button, Heading, Box } from 'theme-ui'

import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'
const Customers = () => {
  const [customersData, setCustomersData] = useState<RelationView>()

  const [customerEmail, setCustomerEmail] = useState('')
  const [customerFirstName, setCustomerFirstName] = useState('')
  const [customerLastName, setCustomerLastName] = useState('')
  const [creditCardNumber, setCreditCardNumber] = useState('')

  useEffect(() => {
    refreshTable()
  }, [])

  const clearValues = () => {
    setCustomerEmail('')
    setCustomerFirstName('')
    setCustomerLastName('')
    setCreditCardNumber('')
  }
  const refreshTable = () => {
    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })
  }
  const handleCustomerCreation = async () => {
    const insertionData = {
      email: customerEmail,
      first_name: customerFirstName,
      last_name: customerLastName,
      credit_card: creditCardNumber,
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
    refreshTable()
  }

  const deleteCustomer = (row: any) => {
    api
      .deleteEntry({
        tableName: 'customers',
        primaryKeyName: 'email',
        primaryKeyValue: row['email'],
      })
      .then(() => refreshTable())
  }

  return (
    <div className='container'>
      <div>
        <Heading>Create customer</Heading>
        <Box as='form'>
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
          <Field
            fieldType='text'
            fieldName='credit_Card'
            title='Credit card number'
            value={creditCardNumber}
            onChange={(e) => setCreditCardNumber(e.target.value)}
          />
          <Button onClick={handleCustomerCreation} type='reset'>
            Create customer
          </Button>
        </Box>
      </div>
      <div className='customers'>
        <Heading>Current customers</Heading>

        {customersData?.rows.length ? (
          <TableView
            relationView={customersData}
            actions={[
              {
                name: 'Remove',
                handler: deleteCustomer,
                props: { bg: 'danger' },
              },
            ]}
          />
        ) : (
          <h3>No customers yet</h3>
        )}
      </div>
    </div>
  )
}

export default Customers
