import React from 'react'
import {useEffect,useState} from "react"
import {fabric} from 'fabric'
import Rectangle from '../Rect'
import {Tooltip, PageWrapper } from './StyledCanvas'
const AnnotationCanvas = ({w, h, image, annotationsData, OnAnnotationsChange, OnAnnotationSelect, modifiedLabel, isSelectable}) =>{
    const [canvas,setCanvas] = useState()
    const [currentTooltip,setCurrentTooltip] = useState({label : "test", top : 0, left: 0})
    const [onHover,setOnHover] = useState(false)
    const [annotations, setAnnotations] = useState([-1])
    const [canvasAnnotations, setCanvasAnnotations] = useState([])
    const [changedAnnotation, setChangedAnnotation] = useState(null)
    var altClicked = false

    const OnButtonClicked = (e) =>{
        if(e.code === "AltLeft" && !altClicked){
            altClicked = true
        }
    }

    const OnButtonUp = (e) =>{
        e.preventDefault()
        if(e.code === "AltLeft" && altClicked){
            altClicked = false
        }
    }

    const ZoomCanvas = (opt) =>{
        if(altClicked){
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

    const OnDoubleClick = (e) =>{
        var highest = 0
        canvas.getObjects().forEach((o, i) =>{
            if(highest < o.data.key){
                highest = o.data.key
            }
        })
        let key = highest + 1
        let rect = new Rectangle(e.pointer.x,e.pointer.y,100,100,"no label",key,canvas, isSelectable ? true : false)
        setCanvasAnnotations(canvasAnnotations => [...canvasAnnotations,rect])
        setAnnotations(annotations => [...annotations,{
            x : e.pointer.x,
            y : e.pointer.y,
            h : rect.rect.height,
            w : rect.rect.width,
            key : rect.rect.data.key,
            label : rect.rect.data.label
        }])
        canvas.setActiveObject(rect.rect)
    }

    const OnMouseOver = (e) =>{
        if(e.target){
            setOnHover(true)
            setCurrentTooltip({top : e.e.clientY + 15, left : e.e.clientX, label : e.target.data.label})
        }
        else{
            setOnHover(false)
        }
    }

    const OnObjectRemoved = (e) =>{
        setCanvasAnnotations(canvasAnnotations => canvasAnnotations.filter(canvasAnnotation => canvasAnnotation.rect.data.key !== e.target.data.key))
        setAnnotations(annotations => annotations.filter(annotation => annotation.key !== e.target.data.key))
    }

    const OnObjectChanged = (e) =>{
        setChangedAnnotation(e.target)
    }

    const OnObjectSelected = (e) =>{
        if(OnAnnotationSelect){
            let annotation = {
                x : e.selected[0].left,
                y : e.selected[0].top,
                w : e.selected[0].width * e.selected[0].scaleX,
                h : e.selected[0].height * e.selected[0].scaleY,
                key : e.selected[0].data.key,
                label : e.selected[0].data.label
            }
            OnAnnotationSelect(annotation)
        }
    }

    useEffect(() =>{
        if(!canvas){
            let temp_canvas = new fabric.Canvas('c',{
                height: h,
                width: w,
             })
             temp_canvas.setBackgroundImage(image,temp_canvas.renderAll.bind(temp_canvas))
            setCanvas(temp_canvas)
        }
        else{
            canvas.setHeight(h)
            canvas.setWidth(w)
            canvas.setBackgroundImage(image,canvas.renderAll.bind(canvas))
        }
    },[image])
    useEffect(() =>{
        if(canvas){
            canvasAnnotations.map((ann) =>{
                canvas.remove(ann.rect)
            })
            setCanvasAnnotations(annotationsData.map((annotation,i) =>{
                return new Rectangle(annotation.x,annotation.y,annotation.w,annotation.h,annotation.label,annotation.key,canvas,isSelectable ? true : false)
            ;}))
            setAnnotations(annotationsData)
        }
    },[annotationsData])
    useEffect(()=>{
        if(annotations && changedAnnotation){
        setAnnotations(annotations => annotations.map((annotation,i) =>{
            if(changedAnnotation.data.key === annotation.key){
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
        if(OnAnnotationsChange && annotations[0] !== -1){
            OnAnnotationsChange(annotations)
        }
    },[annotations])

    useEffect(() =>{
        if(canvas) {
            canvas.setBackgroundImage(image,canvas.renderAll.bind(canvas))
            canvas.on('object:modified',OnObjectChanged)
            canvas.on('object:removed',OnObjectRemoved)
            canvas.on('mouse:move',OnMouseOver)
            canvas.on('mouse:dblclick',OnDoubleClick)
            canvas.on('selection:created', OnObjectSelected)
            canvas.on('mouse:wheel',ZoomCanvas)
        }
    },[canvas])

    useEffect(() =>{
        if(annotationsData && annotations[0] === -1 && canvas){
            setCanvasAnnotations(annotationsData.map((annotation,i) =>{
                return new Rectangle(annotation.x,annotation.y,annotation.w,annotation.h,annotation.label,annotation.key,canvas,isSelectable ? true : false)
            ;}))
            setAnnotations(annotationsData)
        }
    },[annotationsData,canvas])

    useEffect(() =>{
        if(modifiedLabel){

            canvasAnnotations.map((canvasAnnotation,i) =>{
                if(canvasAnnotation.rect.data.key === modifiedLabel.key){
                    canvasAnnotation.rect.data.label = modifiedLabel.label
                }
            })
            setAnnotations(
                annotations.map((annotation,i) =>{
                    if(annotation.key === modifiedLabel.key){
                        return {...annotation, label : modifiedLabel.label}
                    }
                    return annotation
            }))
        }
    },[modifiedLabel])
    window.addEventListener('keydown',OnButtonClicked)
    window.addEventListener('keyup',OnButtonUp)
    return (
        <PageWrapper>
            <canvas id="c"
            width={w}
            height={h}>
            </canvas>
        <Tooltip display={onHover ? "block" : "none"} top={currentTooltip.top} left={currentTooltip.left}>{currentTooltip.label}</Tooltip>
        </PageWrapper>

    )
}
export default AnnotationCanvas