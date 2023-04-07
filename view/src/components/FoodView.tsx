import { useEffect, useState } from 'react'
import { Heading, Button, Flex, Box } from 'theme-ui'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'

const FoodView = () => {
  const [customerEmail, setCustomerEmail] = useState('')
  const [SelectRestaurant, setSelectRestaurant] = useState('')
  const [ReceivingLocation, setReceivingLocation] = useState('')
  const [OrderDate, setOrderDate] = useState(
    new Date().toISOString().substring(0, 10)
  )
  const [OrderTime, setOrderTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  )
  const [foodsData, setFoodsData] = useState<RelationView>()
  const [customersData, setCustomersData] = useState<RelationView>()
  const [driversData, setDriversData] = useState<RelationView>()

  useEffect(() => {
    api.getRelation('foodorder').then((data) => {
      setFoodsData(data)
    })

    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })

    api.getRelation('drivers').then((data) => {
      setDriversData(data)
    })
  }, [])
  const clearValues = () => {
    setCustomerEmail('')
    setReceivingLocation('')
    setSelectRestaurant('')
    setOrderDate(new Date().toISOString().substring(0, 10))
    setOrderTime(
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    )
  }
  const handleOrderCreation = async () => {
    const insertionData = {
      customer_email: customerEmail,
      select_restaurant: SelectRestaurant,
      receiving_location: ReceivingLocation,
      order_time: OrderTime,
      order_date: OrderDate,
    }

    for (const [key, value] of Object.entries(insertionData)) {
      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createFood(insertionData)
    if (!success) {
      return
    }

    // Clear fields
    clearValues()

    // Refresh Orders table
    api.getRelation('foodorder').then((data) => {
      setFoodsData(data)
    })
  }

  const refreshTables = () => {
    api.getRelation('foodorder').then((data) => {
      setFoodsData(data)
    })

    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })

    api.getRelation('drivers').then((data) => {
      setDriversData(data)
    })
  }

  const confirmFood = (row: any) => {
    api.confirmFood(row['id']).then(() => refreshTables())
  }
  const cancelFood = (row: any) => {
    api.cancelFood(row['id']).then(() => refreshTables())
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 4 }} py={3}>
      <Flex sx={{ justifyContent: 'space-around' }}>
        <div className='order-food-view'>
          <Heading>Order Food </Heading>
          <Field
            fieldType='email'
            fieldName='customer_email'
            title='Customer email'
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='select_restaurant'
            title='Select Restaurant'
            value={SelectRestaurant}
            onChange={(e) => setSelectRestaurant(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='receiving_location'
            title='Receiving Location'
            value={ReceivingLocation}
            onChange={(e) => setReceivingLocation(e.target.value)}
          />
          <Field
            fieldType='time'
            fieldName='departure_time'
            title='Time of Order'
            value={OrderTime}
            onChange={(e) => setOrderTime(e.target.value)}
          />
          <Field
            fieldType='date'
            fieldName='order_date'
            title='Date of order'
            value={OrderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
          <Button onClick={handleOrderCreation}>Order Food</Button>
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
            <div className='drivers'>
              <Heading as='h2'>Current drivers</Heading>

              {driversData?.rows.length ? (
                <TableView relationView={driversData} />
              ) : (
                <Heading as='h3'>No drivers yet</Heading>
              )}
            </div>
          </div>
        </div>
      </Flex>

      <Box sx={{ alignSelf: 'center' }}>
        <Heading>Orders</Heading>

        {foodsData?.rows.length ? (
          <TableView
            relationView={foodsData}
            actions={[
              {
                name: 'Confirm',
                handler: confirmFood,
                props: { bg: 'green' },
              },
              {
                name: 'Cancel',
                handler: cancelFood,
                props: { bg: 'danger' },
              },
            ]}
          />
        ) : (
          <Heading as='h3'>No orders yet</Heading>
        )}
      </Box>
    </Flex>
  )
}

export default FoodView
