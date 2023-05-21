import React, { useRef } from "react";
import { Rect } from "react-konva";
import { Html } from "react-konva-utils";
import { colorFromConfidence } from "../utils/colorFromConfidence";
const RectangleView = ({
  shapeProps,
  onSelect,
  fields = [], // array of objects containing name, text, and confidence (0 < c < 1).
}) => {
  const shapeRef = useRef();
  const currentPos = {
    x: shapeProps.x,
    y: shapeProps.y,
    w: shapeProps.width,
    h: shapeProps.height,
  };

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
      />
      <Html>
        <div
          style={{
            position: "absolute",
            top: currentPos.y - fields.length * 27,
            left: currentPos.x,
            display: "flex",
            flexDirection: "column-reverse",
            flexWrap: "wrap",
            gap: 5,
            width: shapeProps.width,
          }}
        >
          {fields.map((field) => {
            return (
              <div
                key={field.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: colorFromConfidence(field.confidence),
                  color: "black",
                  padding: "1px 2px",
                  borderRadius: 6,
                  textAlign: "center",
                  width: "max-content",
                  minWidth: shapeProps.width,
                  maxHeight: 20,
                  fontSize: 15,
                  textTransform: "capitalize",
                }}
              >
                {`${field.name} ${
                  Math.round(field.confidence * 100 * 100) / 100
                }%`}
              </div>
            );
          })}
        </div>
      </Html>
    </React.Fragment>
  );
};
export default RectangleView;
