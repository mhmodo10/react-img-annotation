import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState,useEffect,useCallback} from 'react'
import 'react-img-annotation/dist/index.css'

const App = () => {
  const [modifiedLabel,setModifiedLabel] = useState({key : -1, label : ""})
  const [currentImage, setCurrentImage] = useState("https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg")
  const [chosenAnnotation,setChosenAnnotation] = useState({key : 0})
  const OnAnnotationSelected = (a) =>{
  }
  const OnAnnotationsChanged = (anns) =>{
    setBoxes(anns)
    console.log(anns)
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
      w : 500,
      h : 500,
      key : 0,
      label: "box1",
      type : "INPUT",
      text: "asda"
    },
    {
      x : 130,
      y : 0,
      w : 100,
      h : 100,
      key : 1,
      label: "box2",
      type : "RECT"
    },
    {
      x : 0,
      y : 130,
      w : 100,
      h : 100,
      key : 2,
      label: "box3",
      type : "RECT"
    }
  ])
  const style = {
    fill : "yellow",
    stroke : "blue",
    borderColor : "green",
    cornerColor : "red",
    cornerSize : 7,
    transparentCorners : false,
    strokeWidth : 5,
  }
  const chosenStyle = {
    fill : "red",
    stroke : "purple",
    borderColor : "blue",
    cornerColor : "black",
    cornerSize : 7,
    transparentCorners : false,
    strokeWidth : 3,
  }
  useEffect(() =>{
    console.log(boxes)
  },[boxes])
  return (
  <>
      <div style={{border:"1px solid black", width:"fit-content"}} onClick={() =>{setCurrentImage("https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg");
    setChosenAnnotation({key : chosenAnnotation.key < 2 ? chosenAnnotation.key + 1 : 0})}}> Another image</div>
    <div style={{border:"1px solid black", width:"fit-content"}} onClick={() =>{
    setBoxes([
    {
      x : 0,
      y : 0,
      w : 100,
      h : 100,
      key : 0,
      label: "box1",
      type : "RECT",
      text: ""
    },
    {
      x : 130,
      y : 0,
      w : 100,
      h : 200,
      key : 1,
      label: "box2",
      type: "RECT"
    },
    {
      x : 200,
      y : 200,
      w : 100,
      h : 100,
      key : 2,
      label: "box3",
      type: "RECT"
    }
  ])
  }}> change boxes</div>
    <AnnotationCanvas w={1323} h={548}
    image={currentImage}
    annotationsData={boxes}
    OnAnnotationSelect={OnAnnotationSelected}
    OnAnnotationsChange={OnAnnotationsChanged}
    modifiedLabel={modifiedLabel}
    isSelectable={true}
    shapeStyle={style}
    chosenStyle={chosenStyle}
    chosenAnnotations={[chosenAnnotation]}
    activeAnnotation={chosenAnnotation}
    highlightedAnnotation={chosenAnnotation}></AnnotationCanvas>
    {
      boxes.map((box,i) =>{
        return <input key={box.key} id={box.key} value={box.label} onChange={OnInputChange}></input>
      })
    }

  </>
)
}

export default App
