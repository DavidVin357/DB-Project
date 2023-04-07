import './App.scss'

import { ThemeProvider } from 'theme-ui'
import { theme } from './theme'

import RideView from './components/RideView'
import Customers from './components/Customers'
import Topups from './components/Topups'
import Drivers from './components/Drivers'
import FoodView from './components/FoodView'
import GroceriesView from './components/GroceriesView'
import Admin from './components/Admin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import NoPage from './components/NoPage'

// ? This interface/object template/class - defines the JSON structure of the displayed table/relation for this application
export interface RelationView {
  columns: Array<string>
  rows: Array<{ [key: string]: any }> // ? represents the string-key, arbitrary-value type, for example [{"id": 2, "name": "mehdi"}, {"id": 1, "name": "fuad"}]}
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<RideView />} />
            <Route path='customers' element={<Customers />} />
            <Route path='topups' element={<Topups />} />
            <Route path='drivers' element={<Drivers />} />
            <Route path='food-order' element={<FoodView />} />
            <Route path='grocery-order' element={<GroceriesView />} />
            <Route path='admin' element={<Admin />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
