import { useEffect, useState } from 'react'
import { Button, Heading, Box } from 'theme-ui'

import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'
import validateEmail from '../utils/validateEmail'

const Drivers = () => {
  const [currentDrivers, setCurrentDrivers] = useState<RelationView>()
  const [driverEmail, setDriverEmail] = useState('')
  const [driverFirstName, setDriverFirstName] = useState('')
  const [driverLastName, setDriverLastName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [carNumber, setCarNumber] = useState('')

  // Initial load of current drivers
  useEffect(() => {
    refreshTable()
  }, [])

  const clearValues = () => {
    setDriverEmail('')
    setDriverFirstName('')
    setDriverLastName('')
    setLicenseNumber('')
    setCarNumber('')
  }

  const refreshTable = () => {
    // Refresh Orders table
    api.getRelation('drivers').then((data) => {
      setCurrentDrivers(data)
    })
  }
  const handleDriverCreation = async () => {
    const insertionData = {
      email: driverEmail,
      first_name: driverFirstName,
      last_name: driverLastName,
      license_number: licenseNumber,
      car_number: carNumber,
    }
    for (const [key, value] of Object.entries(insertionData)) {
      if (key === 'email' && !validateEmail(value)) {
        alert(`Invalid email provided`)
        return
      }

      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createDriver(insertionData)
    if (!success) {
      return
    }
    refreshTable()
    // Clear fields
    clearValues()
  }

  const deleteDriver = (row: any) => {
    api
      .deleteEntry({
        tableName: 'drivers',
        primaryKeyName: 'email',
        primaryKeyValue: row['email'],
      })
      .then(() => refreshTable())
  }

  const switchAvailability = (row: any) => {
    api.switchDriverAvailability(row['email']).then(() => refreshTable())
  }

  return (
    <div className='container'>
      <div>
        <Heading>Create driver</Heading>
        <Box as='form'>
          <Field
            fieldType='email'
            fieldName='driver_email'
            title='Email'
            value={driverEmail}
            onChange={(e) => setDriverEmail(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='first_name'
            title='First name'
            value={driverFirstName}
            onChange={(e) => setDriverFirstName(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='last_name'
            title='Last name'
            value={driverLastName}
            onChange={(e) => setDriverLastName(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='license_number'
            title='License Number (9 characters)'
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
          <Field
            fieldType='text'
            fieldName='car_number'
            title='Car number (8 characters)'
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
          />
          <Button onClick={handleDriverCreation} type='reset'>
            Create driver
          </Button>
        </Box>
      </div>
      <div className='drivers'>
        <Heading>Current drivers</Heading>

        {currentDrivers?.rows.length ? (
          <TableView
            relationView={currentDrivers}
            actions={[
              {
                name: 'Remove',
                handler: deleteDriver,
                props: { bg: 'danger' },
              },
              {
                name: 'Switch availability',
                handler: switchAvailability,
                props: { bg: 'green' },
              },
            ]}
          />
        ) : (
          <Heading as='h3'>No drivers yet</Heading>
        )}
      </div>
    </div>
  )
}

export default Drivers
