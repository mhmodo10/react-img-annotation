import React from 'react'
import { useEffect, useState } from "react"
import { fabric } from 'fabric'
import Rectangle from '../Rect'
import TextInput from '../TextInput'
import './style.css'
const AnnotationCanvas = ({ w, h, image, annotationsData, OnAnnotationsChange, OnAnnotationSelect,
                            modifiedLabel, isSelectable, shapeStyle, chosenAnnotations, chosenStyle,
                            activeAnnotation, highlightedAnnotation}) =>{
    const [canvas,setCanvas] = useState()
    const [currentTooltip,setCurrentTooltip] = useState({label : "test", top : 0, left: 0})
    const [onHover,setOnHover] = useState(false)
    const [annotations, setAnnotations] = useState([-1])
    const [canvasAnnotations, setCanvasAnnotations] = useState([])
    const [selectedAnnotation, setSelectedAnnotation] = useState(null)
    var isSelected = false
    var isExpired = true

    //find target in array
    const isInArray = (target, arr) =>{
        let match = arr.filter(ann => ann.key === target.key)
        return match.length > 0
    }
    const createObject = (type,data) =>{
        switch(type){
            case "RECT":
                return new Rectangle(data)
            case "INPUT":
                return new TextInput(data)
            default:
                return new Rectangle(data)
        }
    }

    const OnButtonUp = (e) =>{
        e.preventDefault()
        if(e.code === "KeyD" && selectedAnnotation){
            if(selectedAnnotation.get('type') === "textbox"){
                if(!selectedAnnotation.isEditing){
                    setSelectedAnnotation(null)
                }
            }
            else{
                canvas.remove(selectedAnnotation)
                setSelectedAnnotation(null)
            }
        }
    }

    //handles canvas zoom
    const ZoomCanvas = (opt) =>{
        if(opt.e.altKey){
            var delta = opt.e.deltaY;
            var zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 2) zoom = 2;
            if (zoom < 1) zoom = 1;
            canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
            canvas.setZoom(zoom)
        }
    }

    //creates new rectangle
    const OnDoubleClick = (e) =>{
        if(!isSelected){
            var highest = 0
            canvas.getObjects().forEach((o, i) =>{
                if(highest < o.data.key){
                    highest = o.data.key
                }
            })
            let key = highest + 1
            let data = {
                x : e.pointer.x,
                y : e.pointer.y,
                w : 100,
                h : 100,
                label : `box ${key}`,
                key : key,
                canvas : canvas,
                type : "RECT",
                isSelectable : isSelectable ? true : false,
                style : shapeStyle
            }
            let rect = createObject(data.type,data)
            setCanvasAnnotations(canvasAnnotations => [...canvasAnnotations,rect])
            setAnnotations(annotations => [...annotations,{
                x : e.pointer.x,
                y : e.pointer.y,
                h : rect.shape.height,
                w : rect.shape.width,
                key : rect.shape.data.key,
                label : rect.shape.data.label,
                type : rect.type,
                isSelectable : data.isSelectable,
                style : shapeStyle,
            }])
            canvas.setActiveObject(rect.shape)
            isExpired = true
        }
    }

    //shows tooltip
    const OnMouseOver = (e) =>{
        if(e.target && !isSelected){
            setOnHover(true)
            setCurrentTooltip({top : e.target.top + 25, left : e.target.left, label : e.target.data.label})
        }
        else{
            setOnHover(false)
        }
    }

    //on remove object
    const OnObjectRemoved = (e) =>{
        setCanvasAnnotations(canvasAnnotations => canvasAnnotations.filter(canvasAnnotation => canvasAnnotation.shape.data.key !== e.target.data.key))
        setAnnotations(annotations => annotations.filter(annotation => annotation.key !== e.target.data.key))
        isExpired = true
    }

    //detects change in objects
    const OnObjectChanged = (e) => {
        isExpired = true
        let ann = e.target
        setAnnotations(annotations => annotations.map((annotation,i) =>{
            if(ann.data.key === annotation.key){
                switch(ann.get('type')){
                    case "textbox":
                        return {
                            ...annotation,
                            x : ann.left,
                            y : ann.top,
                            w : ann.scaleX ? ann.width * ann.scaleX : ann.width,
                            h : ann.scaleY ? ann.height * ann.scaleY : ann.height,
                            text : ann.text ? ann.text : ''
                        }
                    case "rect":
                        return {
                            ...annotation,
                            x : ann.left,
                            y : ann.top,
                            w : ann.scaleX ? ann.width * ann.scaleX : ann.width,
                            h : ann.scaleY ? ann.height * ann.scaleY : ann.height,
                        }
                    default:
                        break;
                }
            }
            return annotation
        }))
    }

    //highlights object
    const higlightObject = () =>{
        if(highlightedAnnotation){
            canvasAnnotations.forEach(ann =>{
                if(ann.key === highlightedAnnotation.key){
                    ann.setStyle({style : chosenStyle})
                }
                else{
                    ann.setStyle({style : shapeStyle})
                }
            })
        }
    }

    //on object selection
    const OnObjectSelected = (e) =>{
        isSelected = true
        if(OnAnnotationSelect){
            let annotation = {
                x : e.selected[0].left,
                y : e.selected[0].top,
                w : e.selected[0].width * e.selected[0].scaleX,
                h : e.selected[0].height * e.selected[0].scaleY,
                key : e.selected[0].data.key,
                label : e.selected[0].data.label
            }
            setSelectedAnnotation(e.selected[0])
            OnAnnotationSelect(annotation)
        }
    }

    //adds canvas event listeners
    const addEventListeners = () =>{
        if(canvas) {
            canvas.setBackgroundImage(image,canvas.renderAll.bind(canvas))
            canvas.on('object:modified',OnObjectChanged)
            canvas.on('object:removed',OnObjectRemoved)
            canvas.on('mouse:move',OnMouseOver)
            canvas.on('mouse:dblclick',OnDoubleClick)
            canvas.on('selection:created', OnObjectSelected)
            canvas.on('mouse:wheel',(opt)=>{ZoomCanvas(opt)},{passive: true})
            canvas.on('selection:cleared', () => {isSelected = false; setSelectedAnnotation(null)})
        }
    }

    //initialize objects on canvas
    const initializeObjects = () =>{
        if(annotationsData && annotations[0] === -1 && canvas){
            setCanvasAnnotations(annotationsData.map((annotation,i) =>{
                let data = getAnnotationData(annotation)
                if(chosenAnnotations && isInArray(annotation,chosenAnnotations)){
                    return createObject(data.type,data)
                }
                data.style = shapeStyle
                return createObject(data.type,data)
            ;}))
            setAnnotations(annotationsData)
        }
    }

    //changes label of annotation
    const updateLabel = () =>{
        if(modifiedLabel){
            canvasAnnotations.forEach((canvasAnnotation,i) =>{
                if(canvasAnnotation.shape.data.key === modifiedLabel.key){
                    canvasAnnotation.shape.data.label = modifiedLabel.label
                }
            })
            setAnnotations(annotations => annotations.map((annotation,i) =>{
                    if(annotation.key === modifiedLabel.key){
                        return {...annotation, label : modifiedLabel.label}
                    }
                    return annotation
            }))
        }
    }

    //returns annotation data object
    const getAnnotationData = (ann) =>{
        return {
            x : ann.x,
            y : ann.y,
            w : ann.w,
            h : ann.h,
            label : ann.label,
            key : ann.key,
            canvas : canvas,
            isSelectable : isSelectable ? true : false,
            style : chosenStyle,
            type : ann.type,
            text : ann.text ? ann.text : "",
            fontSize : ann.fontSize ? ann.fontSize : 8
        }
    }

    //sets active annotation
    const activateObjects = () =>{
        if(canvas && activeAnnotation){
            canvas.getObjects().forEach((o) =>{
                if(o.data.key === activeAnnotation.key){
                    canvas.setActiveObject(o)
                }
            })
        }
    }

    //updates annotations
    const updateAnnotations = () =>{
        if(canvas){
            canvas.getObjects().forEach(o =>{
                canvas.remove(o)
            })
            setCanvasAnnotations(annotationsData.map((ann,i) =>{
                let data = getAnnotationData(ann)
                if(isInArray(ann,chosenAnnotations)){
                    return createObject(data.type,data)
                }
                else{
                    data.style = shapeStyle
                    return createObject(data.type,data)
                }
            }))
            setAnnotations(annotationsData)
        }
    }

    const updateCanvas = () =>{
        if(!canvas){
            let temp_canvas = new fabric.Canvas('c',{
                height: h,
                width: w,
                selection : false,
             })
             temp_canvas.setBackgroundImage(image,temp_canvas.renderAll.bind(temp_canvas))
            setCanvas(temp_canvas)
        }
        else{
            canvas.setHeight(h)
            canvas.setWidth(w)
            canvas.setBackgroundImage(image,canvas.renderAll.bind(canvas))
        }
    }

    const updateAnnotationsCallback = () =>{
        if(OnAnnotationsChange && annotations[0] !== -1 && isExpired){
            OnAnnotationsChange(annotations)
            isExpired = false
        }
    }

    //on image change
    useEffect(updateCanvas,[image])

    //on highlighted object change
    useEffect(higlightObject,[highlightedAnnotation])

    //on annotationsData adn chosen annotations change
    useEffect(updateAnnotations,[annotationsData, chosenAnnotations])

    //on canvas change
    useEffect(addEventListeners,[canvas])

    //on annotationsData change
    useEffect(initializeObjects,[annotationsData,canvas])

    //on modified label change
    useEffect(updateLabel,[modifiedLabel])

    //on active annotation change
    useEffect(activateObjects,[activeAnnotation])

    //callback on annotations change
    useEffect(updateAnnotationsCallback,[annotations])

    //add window event listeners on start
    useEffect(() =>{
        window.addEventListener('keyup',OnButtonUp)
        return () =>{
            window.removeEventListener('keyup',OnButtonUp)
        }
    })
    return (
        <div className="pageWrapper">
            <canvas id="c"
            width={w}
            height={h}>
            </canvas>
        <div className="toolTip" style={{
            display : `${onHover ? "block" : 'none'}`,
            top: currentTooltip.top,
            left: currentTooltip.left
        }}>{currentTooltip.label}</div>
        </div>
    )
}
export default AnnotationCanvas