import { useEffect, useState, useRef, useMemo } from "react";
import { Stage, Layer, Image } from "react-konva";
import Rectangle from "./Rectangle";
const transformerProps = {
  anchorFill: "green",
  borderStroke: "red",
};

const rectProps = {
  stroke: "red",
  fill: "transparent",
};
const higlightedRectProps = {
  stroke: "blue",
  fill: "transparent",
};
const AnnotationsEditor = ({
  annotations = [],
  onChange,
  onAddAnnotation,
  onDeleteAnnotation,
  onFieldSelectChange,
  options = [],
  boxFields = [], // this is an array of objects, each object has box id and options list
  highlightedAnnotations = [],
  image,
  width = 1000,
  height = 1000,
}) => {
  const [selectedShape, setSelectedShape] = useState(null);
  const [_annotations, setAnnotations] = useState(annotations ?? []);
  const imageRef = useRef(null);
  const backgroundImage = useMemo(() => {
    const _img = new window.Image();
    _img.src = image;
    return _img;
  }, [image]);
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target === imageRef.current;
    if (clickedOnEmpty) {
      setSelectedShape(null);
    }
  };
  const addNewAnnotation = (e) => {
    if (selectedShape !== null) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    const annotation = {
      ...rectProps,
      x,
      y,
      width: 100,
      height: 100,
      id: new Date().getTime(),
    };
    setAnnotations((_annotations) => [..._annotations, annotation]);
    onAddAnnotation(annotation);
  };
  const handleAnnotationChange = (newAttr) => {
    setAnnotations((_annotations) =>
      _annotations.map((annotation) => {
        if (annotation.id === newAttr.id) {
          return { ...annotation, ...newAttr };
        }
        return annotation;
      })
    );
    if (onChange) {
      onChange(newAttr);
    }
  };
  const handleDeleteAnnotation = (deletedId) => {
    setAnnotations((_annotations) =>
      _annotations.filter((annotation) => annotation.id !== deletedId)
    );
    if (deletedId === selectedShape.id) {
      console.log("reset selection");
      setSelectedShape(null);
    }
    if (onDeleteAnnotation) {
      onDeleteAnnotation(deletedId);
    }
  };

  const handleFieldSelectChange = (e) => {
    if (onFieldSelectChange) onFieldSelectChange(e);
  };
  useEffect(() => {
    console.log(_annotations);
  }, [_annotations]);
  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      onDblClick={addNewAnnotation}
      style={{
        outline: "1px solid red",
      }}
    >
      <Layer>
        <Image image={backgroundImage} ref={imageRef} />
      </Layer>
      <Layer>
        {_annotations.map((annotation) => {
          const selectedOptionsIds = boxFields.find(
            (box) => box.boxId === annotation.id
          )?.fieldIds;
          const disabledOptionsIds = boxFields.reduce((acc, curr) => {
            if (curr.boxId === annotation.id) {
              return acc;
            }
            return [...acc, ...curr.fieldIds];
          }, []);
          const shapeProps = {
            ...annotation,
            ...(highlightedAnnotations.includes(annotation.id)
              ? higlightedRectProps
              : rectProps),
          };
          return (
            <Rectangle
              key={shapeProps.id}
              shapeProps={shapeProps}
              isSelected={shapeProps.id === selectedShape?.id}
              onSelect={() => {
                setSelectedShape(shapeProps);
              }}
              onChange={handleAnnotationChange}
              onDelete={handleDeleteAnnotation}
              transformerProps={transformerProps}
              options={options}
              selectedOptions={selectedOptionsIds}
              disabledOptions={disabledOptionsIds}
              onFieldSelectChange={handleFieldSelectChange}
              canvasWidth={backgroundImage.width}
              canvasHeight={backgroundImage.height}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};
export default AnnotationsEditor;
