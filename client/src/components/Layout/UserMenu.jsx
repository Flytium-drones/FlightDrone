import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div>
      <div className="text-center">
        <div className="list-group">
          <h3>User Panel</h3>
          <NavLink to="/dashboard/user/profile" className="list-group-item">
            Profile
          </NavLink>
          <NavLink to="/dashboard/user/orders" className="list-group-item">
            Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
