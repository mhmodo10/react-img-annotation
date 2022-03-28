import React from 'react'
import {useEffect,useState,useRef} from "react"
import {fabric} from 'fabric'
import Rectangle from '../Rect'
import { Tooltip } from './StyledCanvas'
const AnnotationCanvas = ({w, h, image, annotationsData, OnAnnotationsChange}) =>{
    const [canvas,setCanvas] = useState()
    const [currentLabel, setCurrentLabel] = useState("")
    const [isSelected, setSelected] = useState(false)
    const [currentTooltip,setCurrentTooltip] = useState({
        label : "test",
        top : 0,
        left: 0,
    })
    const [onHover,setOnHover] = useState(false)
    const [shapes, setShapes] = useState([])
    const [annotations, setAnnotations] = useState([])
    const [changedAnnotation, setChangedAnnotation] = useState(null)

    const OnObjectChanged = (e) =>{
        console.log("changed")
        setChangedAnnotation(e.target)
    }
    const OnMouseOver = (e) =>{
        if(e.target && !onHover && !isSelected){
            setOnHover(true)
            setCurrentTooltip({top : e.e.clientY, left : e.e.clientX, label : e.target.data.label})
        }
        else{
            setOnHover(false)
            // setCurrentTooltip(currentTooltip => {return {...currentTooltip, ...{top : e.target.top, left : e.target.left, label : e.target.data.label}}})
        }
    }
    const OnObjectMoving = (e) =>{

    }
    const OnObjectSelected = (e) =>{
        setSelected(true)
        setOnHover(true)
    }
    useEffect(() =>{
        setCanvas(new fabric.Canvas('c',{
            height: 832,
            width: 832,
         }))
    },[])
    useEffect(()=>{
        if(annotations && changedAnnotation){
        setAnnotations(annotations => annotations.map((annotation,i) =>{
            if(changedAnnotation.data.key === annotation.key){
                console.log("changing")
                annotation.x = changedAnnotation.left
                annotation.y = changedAnnotation.top
                annotation.w  *= changedAnnotation.scaleX
                annotation.h *= changedAnnotation.scaleY
            }
            return annotation
        }))
        setChangedAnnotation(null)
        }
    },[changedAnnotation,annotations])

    useEffect(() =>{
        if(OnAnnotationsChange && annotations){
            OnAnnotationsChange(annotations)
        }
    },[annotations])

    useEffect(() =>{
        if(canvas) {
            canvas.setBackgroundImage(image,canvas.renderAll.bind(canvas))
            if(annotationsData && annotations.length === 0){
                let rects = annotationsData.map((annotation,i) =>{
                    return new Rectangle(annotation.x,annotation.y,annotation.w,annotation.h,"test " + i,i,canvas)
                ;})
                setShapes(rects)
                setAnnotations(annotationsData)
                // canvas.add(...rects)
            }
            canvas.on('object:modified',OnObjectChanged);
            canvas.on('mouse:move',OnMouseOver);
            canvas.on('object:moving', OnObjectMoving)
            canvas.on('object:selected', OnObjectSelected)
        }
    },[canvas])

    useEffect(() =>{
        console.log(annotations)
    },[annotations])
    return (
        <div style={{width: "fit-content", height: "fit-content"}}>
        <canvas id="c"
        width={w}
        height={h}
        // onClick={OnCanvasClick}
        // onMouseMove={OnCanvasHover}
        // onMouseDown={OnCanvasHold}
        // onMouseUp={OnCanvasRelease}
        >
            <img src={image} width={w} height={h} id="bg"/>
        </canvas>
        <Tooltip display={onHover ? "block" : "none"} top={currentTooltip.top} left={currentTooltip.left}>{currentTooltip.label}</Tooltip>
        </div>

    )
}
export default AnnotationCanvas