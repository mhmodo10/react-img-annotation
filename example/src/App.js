import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState,useEffect} from 'react'
import 'react-img-annotation/dist/index.css'
import AnnotationsEditor from './Components/AnnotationsEditor'
const App = () => {
  const [modifiedLabel,setModifiedLabel] = useState({key : -1, label : ""})
  const [currentImage, setCurrentImage] = useState("https://assets.website-files.com/609d5d3c4d120e9c52e52b07/609d5d3c4d120e370de52b70_invoice-lp-light-border.png")
  const [chosenAnnotation,setChosenAnnotation] = useState({key : 0})
  const [page, setPage] = useState(0)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [boxes,setBoxes] = useState([    {
    x : 0,
    y : 10,
    w : 100,
    h : 100,
    key : 0,
    label: "box1",
    type : "INPUT",
    text: "first text",
    confidence: 0.7
  },])
  const OnAnnotationSelected = (a) =>{
  }
  const OnAnnotationChanged = (ann) =>{
    console.log(ann)
  }
  const OnInputChange = (e) =>{
  }
  const b2 = [
    {
      x : 0,
      y : 0,
      w : 100,
      h : 100,
      key : 0,
      label: "box1",
      type : "INPUT",
      text: "first text"
    },
    {
      x : 130,
      y : 0,
      w : 100,
      h : 200,
      key : 1,
      label: "box2",
      type: "RECT",
      text : 'second text'
    },
    {
      x : 200,
      y : 200,
      w : 100,
      h : 100,
      key : 2,
      label: "box3",
      type: "RECT",
      text : 'third text'
    }
  ]
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
  <div onClick={()=>{setShowAnnotations(!showAnnotations)}}>set visible</div>
      <div style={{border:"1px solid black", width:"fit-content"}} onClick={() =>{setCurrentImage("https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg")}}> Another image</div>
    <div style={{border:"1px solid black", width:"fit-content"}} onClick={() =>{setBoxes(b2); setPage(page+1)}}> change boxes</div>
      {
        boxes && currentImage &&
        <AnnotationsEditor
          w={1920}
          h={600}
          annotationsData={boxes}
          image={currentImage}
          showAnnotations={showAnnotations}
          // shapeStyle={style}
          OnTextChange={OnAnnotationChanged}/>
      }
    {
      // boxes &&

      // <AnnotationCanvas 
      // w={1323}
      // h={548}
      // image={currentImage}
      // annotationsData={boxes}
      // OnAnnotationSelect={OnAnnotationSelected}
      // OnAnnotationsChange={OnAnnotationsChanged}
      // isSelectable={true}
      // shapeStyle={style}
      // chosenStyle={chosenStyle}
      // page_num={page}></AnnotationCanvas>
    }

    {
      // boxes.map((box,i) =>{
      //   return <input key={box.key} id={box.key} value={box.label} onChange={OnInputChange}></input>
      // })
    }

  </>
)
}

export default App
