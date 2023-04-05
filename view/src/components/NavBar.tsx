import { Flex } from 'theme-ui'
import NavItem from '../components/NavItem'
const NavBar = () => {
  return (
    <Flex as='nav'>
      <NavItem href='/'>Order Ride</NavItem>
      <NavItem href='/customers'>Customers</NavItem>
      <NavItem href='/drivers'>Drivers</NavItem>
      <NavItem href='/ewallet'>E-Wallet</NavItem>
      <NavItem href='/food-order'>Order Food</NavItem>
      <NavItem href='/grocery-order'>Order Food</NavItem>
    </Flex>
  )
}

export default NavBar
