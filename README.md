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
```javascript
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
        image={
          "url/to/image"
        }
        width={1144}
        height={643}
        options={[
          { label: "field one", value: "3"},
          { label: "field two", value: "4"},
        ]}
        disabledOptions={["field one"]}
        highlightedAnnotations={[]}
      />
    </>
  );
};

export default App;
```

Here is how to use `AnnotationsViewer`:
```javascript
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
        image={
          "url/to/image"
        }
        width={1144}
        height={643}
        onAnnotationClick={(annotation) => console.log(annotation)}
      />
    </>
  );
};

export default App;
```

## License

MIT © [mhmodo10](https://github.com/mhmodo10)