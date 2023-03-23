import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'

const Drivers = () => {
  const [driverData, setDriverData] = useState<RelationView>()

  const [driverEmail, setDriverEmail] = useState('')
  const [driverFirstName, setDriverFirstName] = useState('')
  const [driverLastName, setDriverLastName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [carNumber, setCarNumber] = useState('')

  useEffect(() => {
    api.getRelation('drivers').then((data) => {
      setDriverData(data)
    })
  }, [])

  const onDriverEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDriverEmail(e.target.value)

  const onDriverFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDriverFirstName(e.target.value)

  const onDriverLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDriverLastName(e.target.value)

  const onLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLicenseNumber(e.target.value)
  const onCarNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCarNumber(e.target.value)

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

    // Refresh Orders table
    api.getRelation('drivers').then((data) => {
      setDriverData(data)
    })
  }
  return (
    <div className='container'>
      <div>
        <h1>Create driver</h1>
        <form>
          <Field
            fieldType='email'
            fieldName='user_email'
            title='Email'
            onChange={onDriverEmailChange}
          />
          <Field
            fieldType='text'
            fieldName='first_name'
            title='First name'
            onChange={onDriverFirstNameChange}
          />
          <Field
            fieldType='text'
            fieldName='last_name'
            title='Last name'
            onChange={onDriverLastNameChange}
          />
          <Field
            fieldType='text'
            fieldName='license_number'
            title='License Number'
            onChange={onLicenseNumberChange}
          />
          <Field
            fieldType='text'
            fieldName='car_number'
            title='Car number'
            onChange={onCarNumberChange}
          />
          <button onClick={handleDriverCreation} type='reset'>
            Create driver
          </button>
        </form>
      </div>
      <div className='drivers'>
        <h2>Current drivers</h2>

        {driverData?.rows.length ? (
          <TableView relationView={driverData} />
        ) : (
          <h3>No drivers yet</h3>
        )}
      </div>
    </div>
  )
}

export default Drivers
