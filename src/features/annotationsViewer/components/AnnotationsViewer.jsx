import { useRef, useMemo } from "react";
import { Stage, Layer, Image } from "react-konva";
import { colorFromConfidence } from "../utils/colorFromConfidence";
import RectangleView from "./RectangleView";
const AnnotationsViewer = ({
  annotations = [],
  onAnnotationClick,
  image,
  width = 1000,
  height = 1000,
}) => {
  const imageRef = useRef(null);
  const backgroundImage = useMemo(() => {
    const _img = new window.Image();
    _img.src = image;
    return _img;
  }, [image]);

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Image image={backgroundImage} ref={imageRef} />
      </Layer>
      <Layer>
        {annotations.map((annotation) => {
          const { fields, ...rest } = annotation;
          const shapeProps = {
            ...rest,
            fill: "transparent",
            stroke: colorFromConfidence(annotation.confidence),
          };
          return (
            <RectangleView
              key={shapeProps.id}
              shapeProps={shapeProps}
              onSelect={() => {
                if (onAnnotationClick) {
                  onAnnotationClick(annotation);
                }
              }}
              fields={fields}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};
export default AnnotationsViewer;
