import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'
import { Button, Heading } from 'theme-ui'
const Ewallet = () => {
  // Refresh table on initial page load
  useEffect(() => {
    api.getRelation('transactions').then((data) => {
      setTransactionsData(data)
    })
  }, [])
  const [transactionsData, setTransactionsData] = useState<RelationView>()

  const [CustomerEmail, setCustomerEmail] = useState('')
  const [DriverEmail, setDriverEmail] = useState('')
  const [Amount, setAmount] = useState('')

  const handleTransactionCreation = async () => {
    const insertionData = {
      customer_email: CustomerEmail,
      driver_email: DriverEmail,
      amount: Amount,
    }

    for (const [key, value] of Object.entries(insertionData)) {
      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createTransaction(insertionData)
    if (!success) {
      return
    }

    // Refresh Orders table
    api.getRelation('transactions').then((data) => {
      setTransactionsData(data)
    })
  }

  return (
    <div className='container'>
      <div>
        <Heading>Create transaction</Heading>
        <form>
          <Field
            fieldType='email'
            fieldName='customer_email'
            title='Customer Email'
            value={CustomerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='driver_email'
            title='Driver Email'
            value={DriverEmail}
            onChange={(e) => setDriverEmail(e.target.value)}
          />
          <Field
            fieldType='number'
            fieldName='amount'
            title='Amount'
            value={Amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={handleTransactionCreation} type='reset'>
            Create transaction
          </Button>
        </form>
      </div>
      <div className='transactions'>
        <h2>Current Transactions</h2>

        {transactionsData?.rows.length ? (
          <TableView relationView={transactionsData} />
        ) : (
          <h3>No transactions yet</h3>
        )}
      </div>
    </div>
  )
}

export default Ewallet
