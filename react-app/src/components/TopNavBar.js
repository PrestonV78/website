import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

// https://stackoverflow.com/questions/42372179/reactstrap-and-react-router-4-0-0-beta-6-active-navlink
import { NavLink as RRNavLink } from 'react-router-dom';

import { isLoaded } from '../util/loadingObject'

/* A helper component to render an array of dropdowns 
 * inside a <Nav> element 
 */
const DropDowns = (props) => {
  const user = props.user
  const isAdmin = Boolean(Number(user.admin))

  return (<div>
    {props.dropdowns.map((dropdown, index) =>
      (!(dropdown.onlyifauthenticated || dropdown.onlyifadmin)
        || (isLoaded(user) &&
          (
            (dropdown.onlyifauthenticated && !dropdown.onlyifadmin)
            || (dropdown.onlyifadmin && isAdmin)
          )
        )
      ) &&
      <UncontrolledDropdown nav inNavbar key={index}>
        <DropdownToggle nav caret>
          {dropdown.label}
        </DropdownToggle>
        <DropdownMenu end>
          {dropdown.entries.map((item) =>
            <DropdownItem key={item.path}>
              <NavLink to={item.path} key={item.path} tag={RRNavLink}>
                {item.label}
              </NavLink>
            </DropdownItem>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
    )}</div>)
}

/**
 * Navigation bar component
 */
const NavBar = (props) => {
  let [isOpen, setOpen] = useState(false);

  const menus = props.menus
  const user = props.user
  const toggle = () => { setOpen(!isOpen); }

  return (
    <div>
      <Navbar color="dark" dark expand="lg">
        <NavbarToggler onClick={toggle} />
        <NavbarBrand to="/">
          {/* {props.branding} */}
          <img width="70px" height="auto" className="img-responsive" src="/logo.svg"  alt="logo" />{' '}
          {/* <img
            src="logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '} */}
          PVerling
        </NavbarBrand>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {menus.topbar.map((item) =>
              <NavItem key={item.path}>
                <NavLink to={item.path} tag={RRNavLink}>
                  {item.label}
                </NavLink>
              </NavItem>
            )}
            {menus.leftdropdowns &&
              <DropDowns className="mr-auto" dropdowns={menus.leftdropdowns} user={user} />
            }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;
