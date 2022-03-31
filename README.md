# react-img-annotation
this is a library the makes image annotations easy, you can add,delete,scale,rotate and label annotations.
more features are coming soon!
[![NPM](https://img.shields.io/npm/v/react-img-annotation.svg)](https://www.npmjs.com/package/react-img-annotation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save fabric
npm install --save react-img-annotation
```

## Usage
this is how you use the AnnotationsCanvas component
```jsx
imageSrc = "string with the url or image path"

annotationsData is a list of boxes each box has the following structure
{
  key : key #unique,
  label : string.
  x : int, #x-coordinates with (0,0) being top left
  y : int, #y-coordinates with (0,0) being top left
  w : int, #box width
  h : int, #box height
}
all the boxes in annotationsData get drawn

OnAnnotationsChange is called when there is any change to the boxes on the canvas (i.e change location, scale,rotation)
and gives the changed annotations as input

modifiedLabel is optional and given when you want to edit a certain label in from outside AnnotationCanvas and has the following structure
{
key : key of the edited annotation,
label: new label
}

isSelectable is a boolean that dictates if interaction with annotations is allowed

OnAnnotationsSelect gets called when an annotation is selected and gives the selected annotation as input
```
```jsx
import {AnnotationCanvas} from 'react-img-annotation'
<AnnotationCanvas
image={imageSrc}
annotationsData={annotationsData}
OnAnnotationsChange={(annotations) => {OnAnnotationsChange(annotations)}}
w={widthNumber}
h={heightNumber}
modifiedLabel={modifiedLabel}
isSelectable={isSelectable}
OnAnnotationSelect={(annotation) =>{OnAnnotationSelect(annotation)}}>
</AnnotationCanvas>
```

## License

MIT © [mhmodo10](https://github.com/mhmodo10)
