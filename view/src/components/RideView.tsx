import { useEffect, useState } from 'react'
import { Heading, Button, Flex, Box } from 'theme-ui'
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

  useEffect(() => refreshTables(), [])

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

  const cancelRide = (row: any) => {
    api.cancelRide(row['id']).then(() => refreshTables())
  }

  const confirmRide = (row: any) => {
    api.confirmRide(row['id']).then(() => refreshTables())
    
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 4 }} py={3}>
      <Flex sx={{ justifyContent: 'space-around' }}>
        <div className='order-ride-view'>
          <Heading>Order Ride </Heading>
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
          <Button onClick={handleOrderCreation}>Order Ride</Button>
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

        {ordersData?.rows.length ? (
          <TableView
            relationView={ordersData}
            actions={[
              {
                name: 'Confirm',
                handler: confirmRide,
                props: { bg: 'green' },
              },
              {
                name: 'Cancel',
                handler: cancelRide,
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

export default RideView
