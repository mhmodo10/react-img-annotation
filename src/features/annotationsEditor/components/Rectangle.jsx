import React, { useState, useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { RiDeleteBin6Line, RiMenuFill } from "react-icons/ri";
import Select from "../../fieldsSelect/components/Select";
const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  transformerProps,
  onFieldSelectChange,
  options = [],
  selectedOptions = [],
  disabledOptions = [],
  canvasWidth,
  canvasHeight,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [currentPos, setCurrentPos] = useState({
    x: shapeProps.x,
    y: shapeProps.y,
    w: shapeProps.width,
    h: shapeProps.height,
  });
  const [showInteractions, setShowInteractions] = useState(true);
  const [showFieldsMenu, setShowFieldsMenu] = useState(false);
  const [_selectedOptions, setSelectedOptions] = useState(selectedOptions);
  const toggleFieldsMenu = () =>
    setShowFieldsMenu((showFieldsMenu) => !showFieldsMenu);
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    } else {
      setShowFieldsMenu(false);
    }
  }, [isSelected]);

  const handleDelete = () => {
    setShowFieldsMenu(false);
    setShowInteractions(false);
    if (!onDelete) return;
    onDelete(shapeProps.id);
  };

  const handleFieldSelectChange = (option) => {
    console.log(_selectedOptions);
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
    if (onFieldSelectChange)
      onFieldSelectChange({ boxId: shapeProps.id, tempSelectedOptions });
  };
  const outOfBounds = (coords, maxWidth, maxHeight) => {
    const { x, y, width, height } = coords;
    if (x - 1 <= 0 && y - 1 <= 0) {
      return "topLeft";
    }
    if (x + width >= maxWidth - 1 && y + height >= maxHeight - 1) {
      return "bottomRight";
    }
    if (x + width >= maxWidth - 1 && y - 1 <= 0) {
      return "topRight";
    }
    if (x - 1 <= 0 && y + height >= maxHeight - 1) {
      return "bottomLeft";
    }
    if (x - 1 <= 0) {
      return "left";
    }
    if (y - 1 <= 0) {
      return "top";
    }
    if (x + width >= maxWidth - 1) {
      return "right";
    }
    if (y + height >= maxHeight - 1) {
      return "bottom";
    }
  };
  const restrictRect = (e) => {
    switch (outOfBounds(e.target.attrs, canvasWidth, canvasHeight)) {
      case "left":
        shapeRef.current.x(2);
        break;
      case "right":
        shapeRef.current.x(canvasWidth - shapeProps.width - 2);
        break;
      case "top":
        shapeRef.current.y(2);
        break;
      case "bottom":
        shapeRef.current.y(canvasHeight - shapeProps.height - 2);
        break;
      case "topLeft":
        shapeRef.current.x(2);
        shapeRef.current.y(2);
        break;
      case "topRight":
        shapeRef.current.x(canvasWidth - shapeProps.width - 2);
        shapeRef.current.y(2);
        break;
      case "bottomLeft":
        shapeRef.current.x(2);
        shapeRef.current.y(canvasHeight - shapeProps.height - 2);
        break;
      case "bottomRight":
        shapeRef.current.x(canvasWidth - shapeProps.width - 2);
        shapeRef.current.y(canvasHeight - shapeProps.height - 2);
        break;
      default:
        break;
    }
  };
  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragMove={(e) => {
          restrictRect(e);
          setShowInteractions(false);
          setCurrentPos({
            x: e.target.attrs.x,
            y: e.target.attrs.y,
            w: e.target.attrs.width,
            h: e.target.attrs.height,
          });
        }}
        onTransform={() => {
          setShowInteractions(false);
        }}
        onDragEnd={(e) => {
          setShowInteractions(true);
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          setShowInteractions(true);
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          const annotation = {
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          };
          setCurrentPos({
            x: annotation.x,
            y: annotation.y,
            w: annotation.width,
            h: annotation.height,
          });
          onChange(annotation);
        }}
      />
      {isSelected && showInteractions && (
        <Html divProps={{ onBlur: () => setShowFieldsMenu(false) }}>
          {showFieldsMenu && (
            <div
              style={{
                position: "absolute",
                top: currentPos.y + currentPos.h + 50,
                left: currentPos.x,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                padding: 0,
              }}
            >
              <Select
                key={shapeProps.id}
                options={options}
                selectedOptions={_selectedOptions}
                disabledOptions={disabledOptions}
                onChange={handleFieldSelectChange}
                placeholder={"No selected fields."}
              />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: currentPos.y + currentPos.h + 10,
              left: currentPos.x,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <button
              style={{
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                padding: 0,
              }}
              onClick={toggleFieldsMenu}
            >
              <RiMenuFill />
            </button>
            <button
              onClick={handleDelete}
              style={{
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                padding: 0,
              }}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        </Html>
      )}
      {isSelected && (
        <Transformer
          {...transformerProps}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
export default Rectangle;
