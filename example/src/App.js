import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState} from 'react'
import 'react-img-annotation/dist/index.css'

const App = () => {
  const [selectedAnnotation,setSelectedAnnotation] = useState()
  const OnAnnotationSelected = (a) =>{
    console.log(a)
  }
  const OnAnnotationsChanged = (anns) =>{
    console.log("annotations")
    console.log(anns)
  }
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
    <AnnotationCanvas w={850} h={380}
    image={"https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/images/TMP_RichTextLineIndent.png"}
    annotationsData={boxes}
    OnAnnotationSelect={OnAnnotationSelected}
    OnAnnotationsChange={OnAnnotationsChanged}></AnnotationCanvas>
  </>
)
}

export default App
