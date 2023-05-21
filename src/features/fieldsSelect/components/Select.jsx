import { useState, useMemo } from "react";
import { FiCheck } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import OptionTag from "./OptionTag";

const Select = ({
  options = [],
  placeholder,
  menuDirection,
  onChange,
  disabledOptions = [],
  selectedOptions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // console.log("selectedoptions", selectedOptions);
  const [searchText, setSearchText] = useState("");
  const handleOptionClick = (option) => {
    console.log("clicked");
    onChange(option);
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
    gap: 5,
    flexWrap: "wrap",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "black",
    minHeight: 15,
    background: "#F5F5F5",
    fontSize: "0.9rem",
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
    return selectedOptions.map((option) => (
      <OptionTag
        key={option.label}
        option={option}
        onDelete={() => handleOptionClick(option)}
      />
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);
  return (
    <div style={selectContainerStyle}>
      <div
        style={selectPlaceholderStyle}
        onClick={() => setIsOpen(true)}
        role='button'
        tabIndex={0}
      >
        {selectedTags}
        <input
          type='text'
          placeholder={
            selectedTags.length === 0 ? placeholder : "Search for field"
          }
          onChange={onSearchChange}
          autoFocus={true}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "black",
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
                searchText === "" ? true : option.label.includes(searchText)
              )
              .map((option) => {
                const isDisabled = disabledOptions.includes(option.label);
                const isSelected = !!selectedOptions?.find(
                  (o) => o.value === option.value
                );

                return (
                  <div
                    key={option.label}
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
