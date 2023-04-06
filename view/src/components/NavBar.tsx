import { Flex } from 'theme-ui'
import NavItem from '../components/NavItem'
const NavBar = () => {
  return (
    <Flex as='nav'>
      <NavItem href='/'>Order Ride</NavItem>
      <NavItem href='/customers'>Customers</NavItem>
      <NavItem href='/drivers'>Drivers</NavItem>
      <NavItem href='/topups'>Top Ups</NavItem>
      <NavItem href='/food-order'>Order Food</NavItem>
      <NavItem href='/grocery-order'>Order Grocery</NavItem>
      <NavItem href='/admin'>Admin</NavItem>
    </Flex>
  )
}

export default NavBar
