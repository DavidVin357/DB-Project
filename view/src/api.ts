import apisauce from 'apisauce'
import { RelationView } from './App'
import { APP_URL } from './constants'
// ? REST API functions to communicate with your database backend
// ? Machine IP - replace with your server's IP address; run `ifconfig` and take the first inet IP address (should be below ens32)
// const machineIP = "172.25.76.144"
const machineIP = '172.31.203.172'
const machinePort = '2222'
const api = apisauce.create({
  baseURL: APP_URL,
})

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
