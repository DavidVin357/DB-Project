interface NavBarProps {
  onTabChange: (tabName: string) => void
}

const NavBar = (props: NavBarProps) => {
  return (
    <ul className='navbar'>
      <li onClick={() => props.onTabChange('general')}>General</li>
      <li onClick={() => props.onTabChange('ride-sharing')}>Ride Sharing</li>
      <li onClick={() => props.onTabChange('customers')}>Customers</li>
      <li onClick={() => props.onTabChange('drivers')}>Drivers</li>
      <li onClick={() => props.onTabChange('ewallet')}>E-Wallet</li>
      <li onClick={() => props.onTabChange('food-delivery')}>Food Delivery</li>
      <li onClick={() => props.onTabChange('grocery-delivery')}>Grocery Delivery</li>
    </ul>
  )
}

export default NavBar
