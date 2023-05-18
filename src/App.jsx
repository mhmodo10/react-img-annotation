import { useState } from "react";
import { Stage, Layer } from "react-konva";
import Rectangle from "./features/annotationsEditor/components/Rectangle";
import "./App.css";
import AnnotationsEditor from "./features/annotationsEditor/components/AnnotationsEditor";
import Select from "./features/fieldsSelect/components/Select";
const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: "green",
    id: "rect2",
  },
];

const App = () => {
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedId, selectShape] = useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <>
      {/* <Select
        options={[
          { label: "field one", value: "3", key: 1 },
          { label: "field two", value: "4", key: 2 },
        ]}
        disabledOptions={[1]}
        menuDirection={"up"}
      /> */}
      <AnnotationsEditor
        onChange={(newattr) => {
          console.log(newattr);
          setRectangles((rectangles) =>
            rectangles.map((rect) => {
              if (rect.id === newattr.id) {
                return { ...rect, ...newattr };
              }
              return rect;
            })
          );
        }}
        onAddAnnotation={(annotation) => {
          setRectangles((rectangles) => [...rectangles, annotation]);
        }}
        image={
          "https://cdn.corporate.walmart.com/dims4/WMT/f7a8313/2147483647/strip/true/crop/1920x1080+0+0/resize/1200x675!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2F7b%2F66%2F142c151b4cd3a19c13e1ca65f193%2Fbusinessfornature-banner.png"
        }
        options={[
          { label: "field one", value: "3", key: 1 },
          { label: "field two", value: "4", key: 2 },
        ]}
        disabledOptions={[1]}
        highlightedAnnotations={rectangles.map((rect) => rect.id)}
      />
    </>
  );
};

export default App;
