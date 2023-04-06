import { useEffect, useState } from 'react'
import { Heading, Button, Flex, Box } from 'theme-ui'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'

const AdminView = () => {
  const [ordersData, setOrdersData] = useState<RelationView>()
  const [customersData, setCustomersData] = useState<RelationView>()
  const [driversData, setDriversData] = useState<RelationView>()
  const [foodsData, setFoodsData] = useState<RelationView>()
  const [groceriesData, setGroceriesData] = useState<RelationView>()
  const [transactionsData, setTransactionsData] = useState<RelationView>()

  useEffect(() => refreshTables(), [])

  const refreshTables = () => {
    api.getRelation('rides').then((data) => {
      setOrdersData(data)
    })

    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })

    api.getRelation('drivers').then((data) => {
      setDriversData(data)
    })

    api.getRelation('foodorder').then((data) => {
        setFoodsData(data)
      })

    api.getRelation('groceriesorder').then((data) => {
        setGroceriesData(data)
      })

    api.getRelation('transactions').then((data) => {
        setTransactionsData(data)
      })
  }

  const cancelRide = (row: any) => {
    api.cancelRide(row['id']).then(() => refreshTables())
  }

  const cancelFood = (row: any) => {
    api.cancelFood(row['id']).then(() => refreshTables())
  }

  const cancelGroceries = (row: any) => {
    api.cancelGroceries(row['id']).then(() => refreshTables())
  }

  const deleteCustomer = (row: any) => {
    api
      .deleteEntry({
        tableName: 'customers',
        primaryKeyName: 'email',
        primaryKeyValue: row['email'],
      })
      .then(() => refreshTables())
  }

  const deleteDriver = (row: any) => {
    api
      .deleteEntry({
        tableName: 'drivers',
        primaryKeyName: 'email',
        primaryKeyValue: row['email'],
      })
      .then(() => refreshTables())
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 4 }}>
      <Flex sx={{ justifyContent: 'space-around' }}>
        <div className='tables'>
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
            <div className='drivers'>
              <Heading as='h2'>Current drivers</Heading>

              {driversData?.rows.length ? (
                <TableView relationView={driversData} 
                actions={[
                  {
                    name: 'Remove',
                    handler: deleteDriver,
                    props: { bg: 'danger' },
                  },
                ]}
              />
              ) : (
                <Heading as='h3'>No drivers yet</Heading>
              )}
          </div>
        </div>
      </Flex>
      <Box sx={{ alignSelf: 'center' }}>
        <Heading>Ride Orders</Heading>

        {ordersData?.rows.length ? (
          <TableView
            relationView={ordersData}
            actions={[
              {
                name: 'Remove',
                handler: cancelRide,
                props: { bg: 'danger' },
              },
            ]}
          />
        ) : (
          <Heading as='h3'>No orders yet</Heading>
        )}
      </Box>
    
      <Box sx={{ alignSelf: 'center' }}>
        <Heading>Food Orders</Heading>

        {foodsData?.rows.length ? (
          <TableView
            relationView={foodsData}
            actions={[
              {
                name: 'Remove',
                handler: cancelFood,
                props: { bg: 'danger' },
              },
            ]}
          />
        ) : (
          <Heading as='h3'>No orders yet</Heading>
        )}
      </Box>

      <Box sx={{ alignSelf: 'center' }}>
        <Heading>Groceries Orders</Heading>

        {groceriesData?.rows.length ? (
          <TableView
            relationView={groceriesData}
            actions={[
              {
                name: 'Remove',
                handler: cancelGroceries,
                props: { bg: 'danger' },
              },
            ]}
          />
        ) : (
          <Heading as='h3'>No orders yet</Heading>
        )}
      </Box>

      <Box sx={{ alignSelf: 'center' }}>
        <Heading>All Transactions</Heading>

        {transactionsData?.rows.length ? (
          <TableView
            relationView={transactionsData}/>
        ) : (
          <Heading as='h3'>No orders yet</Heading>
        )}
      </Box>
    </Flex>
    
  )
}

export default AdminView
