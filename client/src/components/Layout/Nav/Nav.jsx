import { useState, useEffect, useRef } from "react";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../Context/auth";
import { toast } from "react-toastify";
import { useCart } from "../../../Context/cart";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navbarRef = useRef(null);
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
  };

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const navbarHeight = navbarRef.current?.offsetHeight || 0;

    if (currentScrollPos > navbarHeight) {
      setIsSticky(true);
      setIsVisible(currentScrollPos < prevScrollPos);
    } else {
      setIsSticky(false);
      setIsVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      ref={navbarRef}
      className={`bg-white backdrop-blur-md bg-opacity-80 p-4 shadow-sm transition-all duration-300 ease-in-out transform ${isSticky
        ? `${isVisible ? "translate-y-0" : "-translate-y-full"
        } fixed top-0 left-0 w-full z-50`
        : "relative z-50"
        }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FLYTIUM
          </span>
        </div>

        <ul className="hidden md:flex items-center space-x-8">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              ABOUT US
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              SERVICES
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/store"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              STORE
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cartpage"
              className={({ isActive }) =>
                `flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                {cart?.length || 0}
              </span>
            </NavLink>
          </li>

          {!auth.user ? (
            <li>
              <NavLink
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Login
              </NavLink>
            </li>
          ) : (
            <li className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <UserIcon className="h-5 w-5" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  {auth?.user?.role === 1 ? (
                    <div className="py-1">
                      <NavLink
                        to="/dashboard/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {auth?.user?.name}
                      </NavLink>
                    </div>
                  ) : (
                    <div className="py-1">
                      <NavLink
                        to="/dashboard/user/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {auth?.user?.name}
                      </NavLink>
                      <NavLink
                        to="/dashboard/user/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Orders
                      </NavLink>
                    </div>
                  )}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>

        <button
          className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  SERVICES
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  STORE
                </Link>
              </li>
              <li>
                <NavLink
                  to="/cartpage"
                  className={({ isActive }) =>
                    `flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                    {cart?.length || 0}
                  </span>
                </NavLink>
              </li>

              {!auth.user ? (
                <li>
                  <NavLink
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </NavLink>
                </li>
              ) : (
                <li className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <UserIcon className="h-5 w-5" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      {auth?.user?.role === 1 ? (
                        <div className="py-1">
                          <NavLink
                            to="/dashboard/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {auth?.user?.name}
                          </NavLink>
                        </div>
                      ) : (
                        <div className="py-1">
                          <NavLink
                            to="/dashboard/user/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {auth?.user?.name}
                          </NavLink>
                          <NavLink
                            to="/dashboard/user/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Orders
                          </NavLink>
                        </div>
                      )}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )}

            </ul>

            <button
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
      
    </nav>
  );
};

export default Navbar;  