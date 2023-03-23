import { useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'

const Drivers = () => {
  const [customersData, setCustomersData] = useState<RelationView>()

  return (
    <form>
      <Field fieldType='first_name' fieldName='user_email' title='User email' />
      <Field
        fieldType='text'
        fieldName='start_location'
        title='Start location'
      />
      <Field fieldType='text' fieldName='end_location' title='End location' />
      <button type='submit'>Create customer</button>
    </form>
  )
}

export default Drivers
