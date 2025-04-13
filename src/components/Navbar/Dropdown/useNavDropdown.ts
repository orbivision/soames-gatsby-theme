import { useEffect } from "react";

const useNavDropdown = (
  dropdownRef: React.RefObject<HTMLDivElement>,
  toggleRef: React.RefObject<HTMLButtonElement>
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        toggleRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleRef.current.setAttribute("aria-expanded", "false");
        dropdownRef.current.classList.remove("show");
      }
    };

    const handleToggleClick = () => {
      if (!dropdownRef.current || !toggleRef.current) return;

      const expanded =
        toggleRef.current.getAttribute("aria-expanded") === "true";
      toggleRef.current.setAttribute("aria-expanded", (!expanded).toString());
      dropdownRef.current.classList.toggle("show");
    };

    const toggle = toggleRef.current;
    toggle?.addEventListener("click", handleToggleClick);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      toggle?.removeEventListener("click", handleToggleClick);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, toggleRef]);
};

export default useNavDropdown;
