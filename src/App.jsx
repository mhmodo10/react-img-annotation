import { useState } from "react";
import RectangleEdit from "./features/annotationsEditor/components/RectangleEdit";
import "./App.css";
import AnnotationsEditor from "./features/annotationsEditor/components/AnnotationsEditor";
import AnnotationsViewer from "./features/annotationsViewer/components/AnnotationsViewer";
const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "transparent",
    id: "rect1",
    confidence: 0.2,
    fields: [
      { name: "rect1 field1", confidence: 0.32323 },
      { name: "rect1 field2", confidence: 0.3123123 },
      { name: "rect1 field3", confidence: 0.35435 },
      { name: "rect1 field4", confidence: 0.344 },
    ],
  },
  {
    x: 150,
    y: 150,
    width: 300,
    height: 100,
    fill: "transparent",
    id: "rect2",
    confidence: 0.9,
    fields: [{ name: "rect2 field1", confidence: 0.9 }],
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
      <AnnotationsViewer
        annotations={rectangles}
        image={
          "https://cdn.corporate.walmart.com/dims4/WMT/f7a8313/2147483647/strip/true/crop/1920x1080+0+0/resize/1200x675!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2F7b%2F66%2F142c151b4cd3a19c13e1ca65f193%2Fbusinessfornature-banner.png"
        }
        width={1144}
        height={643}
        onAnnotationClick={(e) => console.log(e)}
      />
      {/* <AnnotationsEditor
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
        width={1144}
        height={643}
        options={[
          { label: "field one", value: "3", key: 1 },
          { label: "field two", value: "4", key: 2 },
        ]}
        disabledOptions={["field one"]}
        // highlightedAnnotations={rectangles.map((rect) => rect.id)}
      /> */}
    </>
  );
};

export default App;
