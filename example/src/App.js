import React from 'react'
import AnnotationCanvas from './Components/Canvas'
import {useState,useEffect} from 'react'
import AnnotationsEditor from './Components/AnnotationsEditor'
import invImage from './Images/invoice11-1.jpg'
const App = () => {
  const [modifiedLabel,setModifiedLabel] = useState({key : -1, label : ""})
  const [currentImage, setCurrentImage] = useState(invImage)
  const [chosenAnnotation,setChosenAnnotation] = useState({key : 0, page_num : 0})
  const [page, setPage] = useState(0)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [boxes,setBoxes] = useState([    
    {
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
  "x": 152,
  "y": 424,
  "w": 317.14285714285714,
  "h": 317.14285714285714,
  "page_num": 0,
  "key": 4,
  "label": "box 4",
  text : 'BILL FROM\nJan\nBlocklab\nWestvest 183\nDelft\n00121319032',
  field_name : 'field 49',
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
}
  // {
  //   "field_label": "amount1",
  //   "field_name": "amount1",
  //   "h": 31.00357028780259,
  //   "key": 1,
  //   "label": "box 1",
  //   "page_num": 0,
  //   "parent": "Amounts",
  //   "w": 144.99999999953056,
  //   "x": 791.183349609375,
  //   "y": 588.6333312988281,
  //   "text": "$300.00",
  //   "confidence": 0.98
  // },
  // {
  //   "field_label": "amount2",
  //   "field_name": "amount2",
  //   "h": 35.00016121563088,
  //   "key": 2,
  //   "label": "box 2",
  //   "page_num": 0,
  //   "parent": "Amounts",
  //   "w": 122.01574389811867,
  //   "x": 999.183349609375,
  //   "y": 627.6333312988281,
  //   "text": "$1.920.00",
  //   "confidence": 0.98
  // },
  // {
  //   "field_label": "total",
  //   "field_name": "total",
  //   "h": 38.00012743945178,
  //   "key": 3,
  //   "label": "box 3",
  //   "page_num": 0,
  //   "parent": "Amounts",
  //   "w": 129.9999999999878,
  //   "x": 795.183349609375,
  //   "y": 669.6333312988281,
  //   "text": "$1500.00",
  //   "confidence": 0.97
  // },
  // {
  //   "field_label": "Address",
  //   "field_name": "Address",
  //   "h": 25.000390825250918,
  //   "key": 6,
  //   "label": "box 6",
  //   "page_num": 0,
  //   "parent": "Receiver",
  //   "w": 157.01280852336274,
  //   "x": 102.18334960937501,
  //   "y": 414.6333312988281,
  //   "text": "Delft",
  //   "confidence": 0.98
  // },
  // {
  //   "field_label": "Name",
  //   "field_name": "Name",
  //   "h": 24.99996863875856,
  //   "key": 4,
  //   "label": "box 4",
  //   "page_num": 0,
  //   "parent": "Receiver",
  //   "w": 162.01197425507598,
  //   "x": 107.183349609375,
  //   "y": 335.6333312988281,
  //   "text": "Sarah1234",
  //   "confidence": 0.98
  // },
  // {
  //   "field_label": "Address",
  //   "field_name": "Address",
  //   "h": 24.005710638313992,
  //   "key": 5,
  //   "label": "box 5",
  //   "page_num": 0,
  //   "parent": "Sender",
  //   "w": 171.91733509407715,
  //   "x": 447.183349609375,
  //   "y": 336.6333312988281,
  //   "text": "Marin123",
  //   "confidence": 0.99
  // },
  // {
  //   "field_label": "Name",
  //   "field_name": "Name",
  //   "h": 26.000373413022334,
  //   "key": 7,
  //   "label": "box 7",
  //   "page_num": 0,
  //   "parent": "Sender",
  //   "w": 195.81926447612364,
  //   "x": 439.183349609375,
  //   "y": 413.6333312988281,
  //   "text": "Rotterdam",
  //   "confidence": 0.99
  // }
])
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
      {/* {
        boxes && currentImage &&
        <AnnotationsEditor
          w={1700}
          h={2200}
          annotationsData={boxes}
          image={currentImage}
          showAnnotations={showAnnotations}
          // shapeStyle={style}
          isEditable={false}
          OnTextChange={OnAnnotationsChanged}
          viewTextBox={false}/>
      } */}
    {
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
