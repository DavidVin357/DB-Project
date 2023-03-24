import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'

const Drivers = () => {
  const [currentDrivers, setCurrentDrivers] = useState<RelationView>()
  const [driverEmail, setDriverEmail] = useState('')
  const [driverFirstName, setDriverFirstName] = useState('')
  const [driverLastName, setDriverLastName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [carNumber, setCarNumber] = useState('')

  // Initial load of current drivers
  useEffect(() => {
    api.getRelation('drivers').then((data) => {
      setCurrentDrivers(data)
    })
  }, [])

  const clearValues = () => {
    setDriverEmail('')
    setDriverFirstName('')
    setDriverLastName('')
    setLicenseNumber('')
    setCarNumber('')
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
      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createDriver(insertionData)
    if (!success) {
      return
    }

    // Clear fields
    clearValues()

    // Refresh Orders table
    api.getRelation('drivers').then((data) => {
      setCurrentDrivers(data)
    })
  }

  return (
    <div className='container'>
      <div>
        <h1>Create driver</h1>
        <form>
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
          <button onClick={handleDriverCreation} type='reset'>
            Create driver
          </button>
        </form>
      </div>
      <div className='drivers'>
        <h2>Current drivers</h2>

        {currentDrivers?.rows.length ? (
          <TableView relationView={currentDrivers} />
        ) : (
          <h3>No drivers yet</h3>
        )}
      </div>
    </div>
  )
}

export default Drivers
