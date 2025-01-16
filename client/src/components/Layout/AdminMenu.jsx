import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import InsertChartOutlinedSharpIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import "./sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      
      <hr />
      <div className="bottom">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/dashboard/admin" style={{ textDecoration: "none" }}>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          </Link>

          <p className="title">LISTS</p>
          <Link to="/dashboard/admin/users" style={{ textDecoration: "none" }}>
            <li>
              <Person3OutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/dashboard/admin/category" style={{ textDecoration: "none" }}>
            <li>
              <Person3OutlinedIcon className="icon" />
              <span>Category</span>
            </li>
          </Link>

          <Link to="/dashboard/admin/products" style={{ textDecoration: "none" }}>
            <li>
              <LocalGroceryStoreOutlinedIcon className="icon" />
              <span>Products</span>
            </li>
          </Link>
          <Link to="/dashboard/admin/orders" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardOutlinedIcon className="icon" />
              <span>Orders</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;