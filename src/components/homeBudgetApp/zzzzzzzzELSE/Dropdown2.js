import { useState } from "react";

function Dropdown2() {

    const [isActive, setIsActive] = useState(false);

    return (
        <div className="dropdown">
            <div className="dropdown-btn" onClick={(e) =>
                setIsActive(!isActive)}>
                Choose one
                <span className="fas fa-caret-down"></span>
            </div>
            <div className="dropdown-content">
                <div className="dropdown-item">
                    2021
                </div>
                <div className="dropdown-item">
                    2020
                </div>
            </div>
        </div>
    )
    // return <p>Hello</p>;
}

export default Dropdown2