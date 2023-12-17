import { useMemo, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import RectangleEdit from "./RectangleEdit";
const transformerProps = {
  anchorFill: "green",
  borderStroke: "red",
};

const rectStyle = {
  stroke: "red",
  fill: "transparent",
};
const higlightedRectStyle = {
  stroke: "blue",
  fill: "transparent",
};
const AnnotationsEditor = ({
  annotations = [],
  onChange,
  onAddAnnotation,
  onDeleteAnnotation,
  onFieldSelectChange,
  onAnnotationSelected,
  options = [],
  boxFields = [], // this is an array of objects, each object has box id and options list
  highlightedAnnotations = [],
  image,
  width = 1000,
  height = 1000,
  defaultAnnotationStyle = rectStyle,
  highlightedAnnotationStyle = higlightedRectStyle,
  transformerStyle = transformerProps,
  showLabels = true,
  rectLabelPositionFunc = (selectedOptions, currentPosition) => {
    return {
      top: currentPosition.y - selectedOptions.length * 27,
      left: currentPosition.x,
    };
  },
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
      ...defaultAnnotationStyle,
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

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      onDblClick={addNewAnnotation}
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
            ...(highlightedAnnotations.includes(annotation.id)
              ? highlightedAnnotationStyle
              : defaultAnnotationStyle),
            ...annotation,
          };
          return (
            <RectangleEdit
              key={shapeProps.id}
              shapeProps={shapeProps}
              isSelected={shapeProps.id === selectedShape?.id}
              onSelect={() => {
                setSelectedShape(shapeProps);
                if (onAnnotationSelected) {
                  onAnnotationSelected(shapeProps);
                }
              }}
              onChange={handleAnnotationChange}
              onDelete={handleDeleteAnnotation}
              transformerProps={transformerStyle}
              options={options}
              selectedOptions={selectedOptionsIds}
              disabledOptions={disabledOptionsIds}
              onFieldSelectChange={handleFieldSelectChange}
              canvasWidth={width}
              canvasHeight={height}
              showLabels={showLabels}
              labelPositionFunc={rectLabelPositionFunc}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};
export default AnnotationsEditor;
