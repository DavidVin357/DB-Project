import apisauce from 'apisauce'
import { RelationView } from './App'
import { APP_URL } from './constants'

const api = apisauce.create({
  baseURL: APP_URL,
})

// GRAB ENDPOINTS START
export async function deleteEntry(deletionData: any) {
  let res = await api.post('/entry-delete', deletionData)
  if (res.ok) {
    console.log('Deleted successfully!')
    return true
  }
  alert('Failed to delete the given entry!')
  return false
}

export async function createRide(ride_data: any) {
  let res = await api.post('/ride-insert', ride_data)

  if (res.ok) {
    console.log('Created ride successfully!')
    return true
  }
  alert(`Failed to create the ride order!\nError:\n${res.data}`)
  return false
}

export async function createCustomer(customer_data: any) {
  let res = await api.post('/customer-insert', customer_data)

  if (res.ok) {
    console.log('Created customer successfully!')
    return true
  }
  alert(`Failed to create the customer!\nError:\n${res.data}`)
  return false
}

export async function createDriver(driver_data: any) {
  let res = await api.post('/driver-insert', driver_data)

  if (res.ok) {
    console.log('Created driver successfully!')
    return true
  }
  alert(`Failed to create the driver!\nError:\n${res.data}`)
  return false
}

export async function switchDriverAvailability(email: string) {
  let res = await api.patch('/switch-availability', { email })

  if (res.ok) {
    console.log("Switched the driver's availability!")
    return true
  }
  alert(`Failed to switch the driver's availability!\nError:\n${res.data}`)
  return false
}

export async function createGrocery(grocery_data: any) {
  let res = await api.post('/grocery-insert', grocery_data)

  if (res.ok) {
    console.log('Created grocery successfully!')
    return true
  }
  alert(`Failed to create grocery order!\nError:\n${res.data}`)
  return false
}

export async function createTopups(topups_data: any) {
  let res = await api.post('/topup-insert', topups_data)

  if (res.ok) {
    console.log('Created top up successfully!')
    return true
  }
  alert(`Failed to create the top up!\nError:\n${res.data}`)
  return false
}

export async function confirmRide(id: string) {
  let res = await api.put('/ride-confirm', { id })
  if (res.ok) {
    return true
  }
  alert(`Failed to confirm the ride order!\nError:\n${res.data}`)
  return false
}

export async function cancelRide(id: string) {
  let res = await api.put('/ride-cancel', { id })
  if (res.ok) {
    return true
  }
  alert(`Failed to cancel the ride order!\nError:\n${res.data}`)
  return false
}

export async function createFood(food_data: any) {
  let res = await api.post('/food-insert', food_data)

  if (res.ok) {
    console.log('Created food successfully!')
    return true
  }
  alert(`Failed to create the food order!\nError:\n${res.data}`)
  return false
}

export async function confirmFood(id: string) {
  let res = await api.put('/food-confirm', { id })
  if (res.ok) {
    return true
  }
  alert(`Failed to confirm the food order!\nError:\n${res.data}`)
  return false
}

export async function cancelFood(id: string) {
  let res = await api.put('/food-cancel', { id })
  if (res.ok) {
    return true
  }
  alert(`Failed to cancel the food order!\nError:\n${res.data}`)
  return false
}

export async function cancelGroceries(id: string) {
  let res = await api.put('/groceries-cancel', { id })
  if (res.ok) {
    return true
  }
  alert(`Failed to cancel the groceries order!\nError:\n${res.data}`)
  return false
}

// GRAB ENDPOINTS END

// ? A POST query to create your relation
export async function createRelation(relationData: any) {
  // ? Simply uses the API instance created by apisauce library to send the relationData object to the backend
  // ? Refer to the code to see the structure of the relationData object
  let res = await api.post('/table-create', relationData)
  // ? Methods to update you about the creation status of your relation
  if (res.ok) {
    alert('Created relation named ' + relationData.name)
  } else {
    alert('Failed to create relation named ' + relationData.name)
    console.log(res.data)
  }
}

// ? A GET method to obtain your relation from the backend
export async function getRelation(relationName: string) {
  let res = await api.get('/table', { name: relationName })
  if (res.ok) {
    return res.data as Promise<RelationView>
  } else {
    let data: RelationView = {
      columns: [],
      rows: [],
    }
    return data
  }
}

export async function insertEntry(entry: any) {
  let res = await api.post('/table-insert', entry)
  if (res.ok) {
    console.log('Inserted successfully!')
    return true
  }
  alert('Failed to insert the given entry!')
  return false
}

export async function updateEntry(entry: any) {
  let res = await api.post('/table-update', entry)
  if (res.ok) {
    console.log('Inserted successfully!')
    return true
  }
  alert('Failed to update the given entry!')
  return false
}
