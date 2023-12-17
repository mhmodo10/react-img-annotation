# react-img-annotation

This is a package that helps with annotating data and viewing annotations.

It supports creating rectangles and attaching labels/fields to said rectangles.

## NOTE:

This package was previously implemented differently using fabricjs, now it has been migrated to konva. If you want to use the previous implementation you can use version `1.1.61`

# Dependencies

for this library you need konva, react-konva, react-konva-utils, react-icons

which you can install using `npm install konva react-konva react-konva-utils react-icons`

# Examples

There are two main components in this package: `AnnotationsEditor` and `AnnotationsViewer`
here is how to use `AnnotationsEditor`:

```JSX
import { useState } from "react";
import { AnnotationsEditor } from "react-img-annotation";
import "./App.css";
const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "transparent",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 300,
    height: 100,
    fill: "transparent",
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
      <AnnotationsEditor
        // initial annotations
        annotations={[]}
        onChange={(newattr) => {
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
        onDeleteAnnotation={(deletedId) => {
          console.log(deletedId);
        }}
        onFieldSelectChange={(change) => {
          console.log(change);
        }}
        onAnnotationSelected={(shapeProps) => {
          console.log(shapeProps);
        }}
        options={[
          { label: "field one", value: "3" },
          { label: "field two", value: "4" },
        ]}
        image={"url/to/image"}
        width={1144}
        height={643}
        disabledOptions={["field one"]}
        highlightedAnnotations={[]}
        // default rect styling, check konva rect for all props
        defaultAnnotationStyle={{
          stroke: "red",
          fill: "transparent",
        }}
        // higlighted rect styling, check konva rect for all props
        highlightedAnnotationStyle={{
          stroke: "blue",
          fill: "transparent",
        }}
        // transformer styling, check konva transformer for all props
        transformerStyle={{ anchorFill: "green", borderStroke: "red" }}
        showLabels={true} // shows labels on top of the rectangles
        rectLabelPositionFunc={(selectedOptions, currentPos) => {
          // control position of labels (default is on top)
          return {
            top: 25,
            left: 25,
          };
        }}
      />
    </>
  );
};

export default App;
```

Here is how to use `AnnotationsViewer`:

```JSX
import { useState } from "react";
import "./App.css";
import { AnnotationsViewer } from "react-img-annotation";
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

  return (
    <>
      <AnnotationsViewer
        annotations={rectangles}
        image={"url/to/image"}
        width={1144}
        height={643}
        onAnnotationClick={(annotation) => console.log(annotation)}
      />
    </>
  );
};

export default App;
```

# Style customization:

Many parts of the package are customizable through classNames:

| className                       | description                                                | notes                                |
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------ |
| rect-edit-labels-container      | controls styling for labels container in editor rectangles | do not change position, top or left. |
| rect-edit-label                 | controls styling for labels                                |                                      |
| rect-edit-menu-button           | menu button styling                                        |                                      |
| rect-edit-delete-button         | delete button styling                                      |                                      |
| rect-view-label                 | label styling in viewer rectangles                         |                                      |
| fields-select-placeholder       | styling for fields select placehlder                       |                                      |
| fields-select-placeholder-input | styling for select input                                   |                                      |
| fields-select-dropdown          | styling for select dropdown                                |                                      |
| fields-select-no-options        | styling for when there are no options                      |                                      |
| fields-select-option            | styling for a single option                                |                                      |

## License

MIT © [mhmodo10](https://github.com/mhmodo10)
