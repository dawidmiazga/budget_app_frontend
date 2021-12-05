import React from "react";
import "../../App.css"
import { SidebarData } from "./SidebarData.js"
import AuthenticationService from "../homeBudgetApp/AuthenticationService.js";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa"

function Navbar() {




    <>
        <div className="navbar">
            <Link to="#" className="menu-bars">
                <FaIcons.FaBars/>
            </Link>
        </div>
    </>

    // const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
    // console.log(isUserLoggedIn)
    // return (
    //     <div className="Sidebar">

    //             {isUserLoggedIn && <li><Link className="nav-link" to="/welcome/dawid">Home</Link></li>}
    //             {isUserLoggedIn && <li><Link className="nav-link" to="/expenses">Expenses</Link></li>}
    //             {isUserLoggedIn && <li><Link className="nav-link" to="/incomes">Income</Link></li>}
    //             {isUserLoggedIn && <li><Link className="nav-link" to="/statistics">Statistics</Link></li>}
    //             {/* {isUserLoggedIn && <li><Link className="nav-link" to="/charts">Charts</Link></li>} */}

    //             {isUserLoggedIn && <li><Link className="nav-link" to="/categories">Categories</Link></li>}

    //             {isUserLoggedIn && <li><Link className="nav-link" to="/test">Nav4</Link></li>}

    //             {!isUserLoggedIn && <li><Link className="nav-link" to="/login">Login</Link></li>}
    //             {isUserLoggedIn && <li><Link className="nav-link" to="/logout" onClick={AuthenticationService.logout}>Logout</Link></li>}

    //     </div>

    // )
}
export default Navbar