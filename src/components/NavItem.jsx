import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavItem({ to, label, hasDropdown, children }) {
  return (
    <li className="relative group">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${isActive ? 'text-red-300' : 'text-white'} hover:text-red-200 transition-colors font-semibold`
        }
        state={{ scrollToDetails: true }}
      >
        {label}
      </NavLink>
      {hasDropdown && (
        <ul className="absolute left-0 mt-2 bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          {children}
        </ul>
      )}
    </li>
  );
}
