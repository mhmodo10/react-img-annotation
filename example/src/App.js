import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState,useEffect} from 'react'
import 'react-img-annotation/dist/index.css'

const App = () => {
  const [modifiedLabel,setModifiedLabel] = useState({key : -1, label : ""})
  const [currentImage, setCurrentImage] = useState("http://127.0.0.1:5000/static/srg_kjq__ctfncblkjxxuiwwzijeltdrrxwkznhapozvk-uhna1/16486416219999316.jpg")
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
  useEffect(() =>{
    let img = new Image()
    img.src = "http://127.0.0.1:5000/static/srg_kjq__ctfncblkjxxuiwwzijeltdrrxwkznhapozvk-uhna1/16486416219999316.jpg"
    console.log(img.naturalHeight)
    console.log(img.naturalWidth)
  },[])
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
  const style = {
    fill : "yellow",
    stroke : "blue",
    borderColor : "green",
    cornerColor : "red",
    cornerSize : 20,
    transparentCorners : false,
    strokeWidth : 5,
  }
  return (
  <>
      <div onClick={() =>{setCurrentImage("http://127.0.0.1:5000/static/srg_kjq__ctfncblkjxxuiwwzijeltdrrxwkznhapozvk-uhna1/16486478488563945.jpg")}}> Another image</div>
    <div onClick={() =>{setBoxes([
    {
      x : 0,
      y : 0,
      w : 200,
      h : 100,
      key : 0,
      label: "box1"
    },
    {
      x : 130,
      y : 0,
      w : 100,
      h : 200,
      key : 1,
      label: "box2"
    },
    {
      x : 200,
      y : 200,
      w : 100,
      h : 100,
      key : 2,
      label: "box3"
    }
  ])
  setCurrentImage("http://127.0.0.1:5000/static/srg_kjq__ctfncblkjxxuiwwzijeltdrrxwkznhapozvk-uhna1/16486478488563945.jpg")}}> change boxes</div>
    <AnnotationCanvas w={1654} h={2339}
    image={currentImage}
    annotationsData={boxes}
    OnAnnotationSelect={OnAnnotationSelected}
    OnAnnotationsChange={OnAnnotationsChanged}
    modifiedLabel={modifiedLabel}
    isSelectable={true}
    shapeStyle={style}></AnnotationCanvas>
    {
      boxes.map((box,i) =>{
        return <input key={box.key} id={box.key} value={box.label} onChange={OnInputChange}></input>
      })
    }

  </>
)
}

export default App
