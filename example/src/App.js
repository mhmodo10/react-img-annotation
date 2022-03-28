import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import { ExampleComponent } from 'react-img-annotation'
import 'react-img-annotation/dist/index.css'

const App = () => {
  const boxes = [
    {
      x : 0,
      y : 0,
      w : 100,
      h : 100,
      key : 0,
    },
    {
      x : 130,
      y : 0,
      w : 100,
      h : 100,
      key : 1,
    },
    {
      x : 0,
      y : 130,
      w : 100,
      h : 100,
      key : 2,
    }
  ]
  return (
  <>
    <ExampleComponent text="Create React Library Example 😄" />
    <AnnotationCanvas w={850} h={380}
    image={"https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/images/TMP_RichTextLineIndent.png"}
    annotationsData={boxes}></AnnotationCanvas>
  </>
)
}

export default App
