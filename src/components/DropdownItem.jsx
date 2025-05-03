import React from 'react';
import { NavLink } from 'react-router-dom';

export default function DropdownItem({ to, children }) {
  return (
    <li className="px-5 py-3 hover:bg-pink-100 rounded-lg">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${isActive ? 'text-red-500' : 'text-gray-800'} block font-medium`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}
