import { useLocation } from 'react-router-dom'
import { NavLink } from 'theme-ui'
type Props = {
  children?: React.ReactNode
  href: string
}

const NavItem: React.FC<Props> = ({ children, href }) => {
  let path = useLocation().pathname
  return (
    <NavLink href={href} p={2} color={path === href ? 'primary' : 'text'}>
      {children}
    </NavLink>
  )
}
export default NavItem
