import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState} from 'react'
import 'react-img-annotation/dist/index.css'

const App = () => {
  const [modifiedLabel,setModifiedLabel] = useState({key : -1, label : ""})
  const OnAnnotationSelected = (a) =>{
    console.log(a)
  }
  const OnAnnotationsChanged = (anns) =>{
    setBoxes(anns)
  }
  const OnInputChange = (e) =>{
    setBoxes(boxes.map((box,i) =>{
      if(box.key.toString() === e.target.id){
        setModifiedLabel({key : box.key, label: e.target.value})
        return {...box, label : e.target.value}
      }
      return box
    }))
  }
  const [boxes,setBoxes] = useState([
    {
      x : 0,
      y : 0,
      w : 100,
      h : 100,
      key : 0,
      label: "box1"
    },
    {
      x : 130,
      y : 0,
      w : 100,
      h : 100,
      key : 1,
      label: "box2"
    },
    {
      x : 0,
      y : 130,
      w : 100,
      h : 100,
      key : 2,
      label: "box3"
    }
  ])
  return (
  <>
    <AnnotationCanvas w={850} h={380}
    image={"https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/images/TMP_RichTextLineIndent.png"}
    annotationsData={boxes}
    OnAnnotationSelect={OnAnnotationSelected}
    OnAnnotationsChange={OnAnnotationsChanged}
    modifiedLabel={modifiedLabel}></AnnotationCanvas>
    {
      boxes.map((box,i) =>{
        return <input key={box.key} id={box.key} value={box.label} onChange={OnInputChange}></input>
      })
    }
  </>
)
}

export default App
