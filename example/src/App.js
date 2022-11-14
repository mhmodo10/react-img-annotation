import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState,useEffect} from 'react'
import 'react-img-annotation/dist/index.css'

const App = () => {
  const [modifiedLabel,setModifiedLabel] = useState({key : -1, label : ""})
  const [currentImage, setCurrentImage] = useState("https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg")
  const [chosenAnnotation,setChosenAnnotation] = useState({key : 0})
  const [page, setPage] = useState(0)
  const [boxes,setBoxes] = useState([])
  const OnAnnotationSelected = (a) =>{
  }
  const OnAnnotationsChanged = (anns) =>{
    setBoxes(anns)
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
      <div style={{border:"1px solid black", width:"fit-content"}} onClick={() =>{setCurrentImage("https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/WOPA160517_D056-resized.jpg?crop=864%2C0%2C1728%2C2304&wid=600&hei=800&scl=2.88")}}> Another image</div>
    <div style={{border:"1px solid black", width:"fit-content"}} onClick={() =>{setBoxes(b2); setPage(page+1)}}> change boxes</div>
    {
      boxes &&

      <AnnotationCanvas 
      w={1323}
      h={548}
      image={currentImage}
      annotationsData={boxes}
      OnAnnotationSelect={OnAnnotationSelected}
      OnAnnotationsChange={OnAnnotationsChanged}
      isSelectable={true}
      shapeStyle={style}
      chosenStyle={chosenStyle}
      page_num={page}></AnnotationCanvas>
    }

    {
      boxes.map((box,i) =>{
        return <input key={box.key} id={box.key} value={box.label} onChange={OnInputChange}></input>
      })
    }

  </>
)
}

export default App
