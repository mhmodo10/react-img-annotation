import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState,useEffect} from 'react'
import 'react-img-annotation/dist/index.css'
import AnnotationsEditor from './Components/AnnotationsEditor'
import invImage from './Images/invoice11-1.jpg'
const App = () => {
  const [modifiedLabel,setModifiedLabel] = useState({key : -1, label : ""})
  const [currentImage, setCurrentImage] = useState(invImage)
  const [chosenAnnotation,setChosenAnnotation] = useState({key : 0, page_num : 0})
  const [page, setPage] = useState(0)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [boxes,setBoxes] = useState([    {
    h: 46.601941747572816,
    key: 0,
    label: "box1",
    page_num: 0,
    w: 135.92233009708738,
    x: 1134,
    y: 814,
    label: "box1",
    type : "RECT",
    text: "$250.00",
    confidence: 0.7,
    page_num : 0,
    field_name : 'field 1',
    parent : 'group 1'
  },
  {
    h: 46.601941747572816,
    key: 1,
    label: "box1",
    page_num: 0,
    w: 135.92233009708738,
    x: 1134,
    y: 870,
    label: "box1",
    type : "RECT",
    text: "$240.00",
    confidence: 0.7,
    page_num : 0,
    field_name : 'field 2',
    parent : 'group1',
  },
  {
    h : 50.476190476190474,
    key : 2,
    label : "box 2",
    page_num : 0,
    w : 636.2092014642164,
    x : 281,
    y : 812,
    text : 'pellentesque habitant morbi trisique senectus',
    field_name : 'field 3',
    parent : 'group1',
    confidence : 0.7,
  },
  {
    "x": 282,
    "y": 876,
    "w": 645.7142857142858,
    "h": 46.666666666666664,
    "page_num": 0,
    "key": 3,
    "label": "box 3",
    text : 'Et netus et malesuada fames ac turpis egestas',
    field_name : 'field 4',
    parent : 'group1',
    confidence : 0.8
},
{
  "x": 152,
  "y": 424,
  "w": 217.14285714285714,
  "h": 217.14285714285714,
  "page_num": 0,
  "key": 4,
  "label": "box 4",
  text : 'BILL FROM\nJan\nBlocklab\nWestvest 183\nDelft\n00121319032',
  field_name : 'field 4',
  parent : 'group1',
  confidence : 0.8
},
{
  "x": 283,
  "y": 934.3333740234375,
  "w": 380.0001703882218,
  "h": 48.09342385748789,
  "page_num": 0,
  "key": 5,
  "label": "box 5",
  text : 'Sed velit urna, interdum vel',
  field_name : 'field 4aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  parent : 'group1',
  confidence : 0.8
}])
  const OnAnnotationSelected = (a) =>{
  }
  const OnAnnotationsChanged = (anns) =>{
    console.log(anns)
    // setBoxes(anns)
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
    },

  ]
  const style = {
    fill : "transparent",
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
          w={1700}
          h={2200}
          annotationsData={boxes}
          image={currentImage}
          showAnnotations={showAnnotations}
          // shapeStyle={style}
          isEditable={false}
          OnTextChange={OnAnnotationsChanged}/>
      }
    {/* {
      boxes &&

      <AnnotationCanvas 
      w={1700}
      h={2200}
      image={currentImage}
      annotationsData={boxes}
      OnAnnotationSelect={OnAnnotationSelected}
      OnAnnotationsChange={OnAnnotationsChanged}
      OnAnnotationsDelete={(ann) =>{console.log(ann)}}
      isSelectable={true}
      shapeStyle={style}
      chosenStyle={chosenStyle}
      chosenAnnotations={[chosenAnnotation]}
      page_num={page}
      isEditable={true}></AnnotationCanvas>
    } */}

    {
      // boxes.map((box,i) =>{
      //   return <input key={box.key} id={box.key} value={box.label} onChange={OnInputChange}></input>
      // })
    }

  </>
)
}

export default App
