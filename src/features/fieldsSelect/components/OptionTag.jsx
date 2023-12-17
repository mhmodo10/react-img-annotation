import { IoCloseCircleOutline } from "react-icons/io5";
const OptionTag = ({ option, onDelete }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        background: "gray",
        color: "white",
        gap: 4,
        padding: "1px 2px",
        borderRadius: 6,
        textAlign: "center",
      }}
    >
      {option.label}
      <div
        onClick={onDelete}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IoCloseCircleOutline size={"1.1rem"}/>
      </div>
    </div>
  );
};

export default OptionTag;
