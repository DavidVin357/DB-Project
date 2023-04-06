import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'
import { Button, Heading } from 'theme-ui'
const Topups = () => {

  const refreshTable = () => {
    api.getRelation('topups').then((data) => {
      setTopupsData(data)
    })

    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })
  }
  useEffect(() => {
    refreshTable()
  }, [])
  const [topupsData, setTopupsData] = useState<RelationView>()
  const [customersData, setCustomersData] = useState<RelationView>()

  const [CustomerEmail, setCustomerEmail] = useState('')
  const [Amount, setAmount] = useState('')

  const handleTopupCreation = async () => {
    const insertionData = {
      customer_email: CustomerEmail,
      amount: Amount
    }

    for (const [key, value] of Object.entries(insertionData)) {
      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createTopups(insertionData)
    if (!success) {
      return
    }

    // Refresh Topups table
    refreshTable()
  }

  const confirmTopup = (row: any) => {
    api.confirmTopup(row['id']).then(() => refreshTable())
  }

  const cancelTopup = (row: any) => {
    api.cancelTopup(row['id']).then(() => refreshTable())
  }

  return (
    <div className='container'>
      <div>
        <Heading>Top up ewallet</Heading>
        <form>
          <Field
            fieldType='email'
            fieldName='customer_email'
            title='Customer Email'
            value={CustomerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Field
            fieldType='number'
            fieldName='amount'
            title='Top up amount'
            value={Amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={handleTopupCreation} type='reset'>
            Top up ewallet
          </Button>
        </form>
      </div>
      <div className='tables'>
          <div className='users-table'>
            <div className='customers'>
              <Heading as='h2'>Current customers</Heading>

              {customersData?.rows.length ? (
                <TableView relationView={customersData} />
              ) : (
                <Heading as='h3'>No customers yet</Heading>
              )}
            </div>
            <div className='topups'>
              <Heading as='h2'>Current Topups</Heading>

              {topupsData?.rows.length ? (
                <TableView relationView={topupsData} 
                actions={[
                  {
                    name: 'Confirm',
                    handler: confirmTopup,
                    props: { bg: 'green' },
                  },
                  {
                    name: 'Cancel',
                    handler: cancelTopup,
                    props: { bg: 'danger' },
                  },
                ]}/>
              ) : (
                <Heading as='h3'>No Topups yet</Heading>
              )}
            </div>
          </div>
        </div>
        </div>
  )
}

export default Topups
