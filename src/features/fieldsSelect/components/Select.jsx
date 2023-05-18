import { useState, useMemo } from "react";
import { FiCheck } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";

const Select = ({
  options = [],
  placeholder,
  menuDirection,
  onChange,
  disabledOptions = [],
  selectedOptions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [_selectedOptions, setSelectedOptions] = useState(selectedOptions);
  const [searchText, setSearchText] = useState("");
  const handleOptionClick = (option) => {
    const isSelected = _selectedOptions.find((o) => o.value === option.value);
    let tempSelectedOptions = structuredClone(_selectedOptions);
    if (isSelected) {
      tempSelectedOptions = _selectedOptions.filter(
        (o) => o.value !== option.value
      );
    } else {
      tempSelectedOptions = [...tempSelectedOptions, option];
    }
    setSelectedOptions(tempSelectedOptions);
    onChange(tempSelectedOptions);
  };

  const toggleDropdown = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const selectContainerStyle = {
    position: "relative",
    display: "inline-block",
    width: 200,
  };

  const selectPlaceholderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: _selectedOptions ? "bold" : "normal",
    color: "black",
    minHeight: 15,
    background: "#F5F5F5",
  };

  const selectOptionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: "normal",
    backgroundColor: "transparent",
    color: "black",
  };

  const selectOptionSelectedStyle = {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  };

  const selectOptionIconStyle = {
    marginRight: "4px",
  };

  const selectNoOptionsStyle = {
    padding: "8px 12px",
    color: "#999",
  };

  const selectDropdownStyle = {
    position: "absolute",
    top: menuDirection === "up" ? "auto" : "100%",
    bottom: menuDirection === "up" ? "100%" : "auto",
    left: "0",
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    zIndex: "999",
    borderRadius: 6,
  };
  const selectedTags = useMemo(() => {
    return _selectedOptions.length > 0
      ? _selectedOptions.map((option) => option.label + " ")
      : placeholder;
  }, [_selectedOptions, placeholder]);
  return (
    <div style={selectContainerStyle}>
      <div
        style={selectPlaceholderStyle}
        onClick={() => setIsOpen(true)}
        role='button'
        tabIndex={0}
      >
        <input
          type='text'
          placeholder={selectedTags}
          onChange={onSearchChange}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
      </div>
      {isOpen && (
        <div style={selectDropdownStyle}>
          {options.length === 0 ? (
            <div style={selectNoOptionsStyle}>
              <div>
                <FaExclamationCircle style={{ marginRight: "8px" }} />
                No options available.
              </div>
            </div>
          ) : (
            options
              .filter((option) =>
                searchText === "" ? true : option.label === searchText
              )
              .map((option) => {
                const isDisabled = disabledOptions.includes(option.key);
                const isSelected = !!_selectedOptions?.find(
                  (o) => o.value === option.value
                );

                return (
                  <div
                    key={option.key}
                    style={{
                      ...selectOptionStyle,
                      ...(isSelected ? selectOptionSelectedStyle : {}),
                    }}
                    onClick={() => handleOptionClick(option)}
                    role='button'
                    tabIndex={0}
                    aria-disabled={isDisabled}
                    aria-selected={isSelected}
                  >
                    {option.label}
                    {isSelected && <FiCheck style={selectOptionIconStyle} />}
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
