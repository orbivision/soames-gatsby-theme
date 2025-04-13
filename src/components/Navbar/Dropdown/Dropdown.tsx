import React, { useEffect, useRef } from "react";
import useNavDropdown from "./useNavDropdown";

interface DropdownProps {
  label: string;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useNavDropdown(dropdownRef, toggleRef);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        ref={toggleRef}
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {label}
      </button>
      <div className="dropdown-menu">{children}</div>
    </div>
  );
};

export default Dropdown;
