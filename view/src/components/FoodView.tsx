import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'
import { Button, Heading } from 'theme-ui'
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
  const onCustomerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomerEmail(e.target.value)

  const onSelectRestaurantChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectRestaurant(e.target.value)

  const onReceivingLocation = (e: React.ChangeEvent<HTMLInputElement>) =>
    setReceivingLocation(e.target.value)

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOrderTime(e.target.value)

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOrderDate(e.target.value)

  return (
    <div className='container'>
      <div className='order-food-view'>
        <Heading>Order Food</Heading>
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
          onChange={onSelectRestaurantChange}
        />
        <Field
          fieldType='text'
          fieldName='Receiving_Location'
          title='Receiving Location'
          value={ReceivingLocation}
          onChange={onReceivingLocation}
        />
        <Field
          fieldType='time'
          fieldName='departure_time'
          title='Time of Order'
          value={OrderTime}
          onChange={onTimeChange}
        />
        <Field
          fieldType='date'
          fieldName='order_date'
          title='Date of order'
          value={OrderDate}
          onChange={onDateChange}
        />
        <Button onClick={handleOrderCreation}>Order Food</Button>
      </div>
      <div className='tables'>
        <div className='foodorder-table'>
          <Heading>Orders</Heading>

          {foodsData?.rows.length ? (
            <TableView relationView={foodsData} />
          ) : (
            <h2>No orders yet</h2>
          )}
        </div>

        <div className='users-table'>
          <div className='customers'>
            <h2>Current customers</h2>

            {customersData?.columns.length ? (
              <TableView relationView={customersData} />
            ) : (
              <h2>No customers yet</h2>
            )}
          </div>
          <div className='drivers'>
            <h2>Current drivers</h2>

            {driversData?.columns.length ? (
              <TableView relationView={driversData} />
            ) : (
              <h2>No drivers yet</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodView
