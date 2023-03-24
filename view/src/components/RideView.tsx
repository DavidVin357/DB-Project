import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'

const RideView = () => {
  const [customerEmail, setCustomerEmail] = useState('')
  const [startLocation, setStartLocation] = useState('')
  const [endLocation, setEndLocation] = useState('')
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().substring(0, 10)
  )
  const [departureTime, setDepartureTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  )

  const [ordersData, setOrdersData] = useState<RelationView>()
  const [customersData, setCustomersData] = useState<RelationView>()
  const [driversData, setDriversData] = useState<RelationView>()
  useEffect(() => {
    api.getRelation('rides').then((data) => {
      setOrdersData(data)
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
    setStartLocation('')
    setEndLocation('')
    setDepartureDate(new Date().toISOString().substring(0, 10))
    setDepartureTime(
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
      start_location: startLocation,
      end_location: endLocation,
      departure_time: departureTime,
      departure_date: departureDate,
    }

    for (const [key, value] of Object.entries(insertionData)) {
      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createRide(insertionData)
    if (!success) {
      return
    }

    // Clear fields
    clearValues()

    // Refresh Orders table
    api.getRelation('rides').then((data) => {
      setOrdersData(data)
    })
  }

  return (
    <div className='container'>
      <div className='order-ride-view'>
        <h1>Order Ride </h1>
        <Field
          fieldType='email'
          fieldName='customer_email'
          title='Customer email'
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        <Field
          fieldType='text'
          fieldName='start_location'
          title='Start location'
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <Field
          fieldType='text'
          fieldName='end_location'
          title='End location'
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <Field
          fieldType='date'
          fieldName='departure_date'
          title='Date of departure'
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
        <Field
          fieldType='time'
          fieldName='departure_time'
          title='Time of departure'
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />
        <button onClick={handleOrderCreation}>Order Ride</button>
      </div>
      <div className='tables'>
        <div className='order-table'>
          <h1>Orders</h1>

          {ordersData?.rows.length ? (
            <TableView relationView={ordersData} />
          ) : (
            <h3>No orders yet</h3>
          )}
        </div>

        <div className='users-table'>
          <div className='customers'>
            <h2>Current customers</h2>

            {customersData?.rows.length ? (
              <TableView relationView={customersData} />
            ) : (
              <h3>No customers yet</h3>
            )}
          </div>
          <div className='drivers'>
            <h2>Current drivers</h2>

            {driversData?.rows.length ? (
              <TableView relationView={driversData} />
            ) : (
              <h3>No drivers yet</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RideView
