import React from 'react'
import {useEffect,useState} from "react"
import {fabric} from 'fabric'
import Rectangle from '../Rect'
import {FaPlusSquare,FaSearchPlus,FaSearchMinus} from 'react-icons/fa'
import {ImPlus} from 'react-icons/im'
import { AddObjectButton, Tooltip, UtilsWrapper, PageWrapper } from './StyledCanvas'
const AnnotationCanvas = ({w, h, image, annotationsData, OnAnnotationsChange, OnAnnotationSelect}) =>{
    const [canvas,setCanvas] = useState()
    const [isSelected, setSelected] = useState(false)
    const [currentTooltip,setCurrentTooltip] = useState({label : "test", top : 0, left: 0})
    const [onHover,setOnHover] = useState(false)
    const [annotations, setAnnotations] = useState([])
    const [changedAnnotation, setChangedAnnotation] = useState(null)
    var ctrlClicked = false

    const OnButtonClicked = (e) =>{
        if(e.code === "AltLeft" && !ctrlClicked){
            ctrlClicked = true
        }
    }
    const OnButtonUp = (e) =>{
        e.preventDefault()
        if(e.code === "AltLeft" && ctrlClicked){
            ctrlClicked = false
        }
    }
    const ZoomCanvas = (opt) =>{
        if(ctrlClicked){
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
        let rect = new Rectangle(e.pointer.x,e.pointer.y,100,100,"no label",annotations.length,canvas)
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
    const AddAnnotation = () =>{
        let rect = new Rectangle(0,0,100,100,"no label",annotations.length,canvas)
        setAnnotations(annotations => [...annotations,{
            x : rect.rect.left,
            y : rect.rect.top,
            h : rect.rect.height,
            w : rect.rect.width,
            key : rect.rect.data.key,
            label : rect.rect.data.label
        }])
        canvas.setActiveObject(rect.rect)
    }

    const OnObjectChanged = (e) =>{
        setChangedAnnotation(e.target)
    }

    const OnMouseOver = (e) =>{
        if(e.target && !onHover && !isSelected){
            setOnHover(true)
            setCurrentTooltip({top : e.e.clientY, left : e.e.clientX, label : e.target.data.label})
        }
        else{
            setOnHover(false)
        }
    }

    const OnObjectRemoved = (e) =>{
        setAnnotations(annotations => annotations.filter(annotation => annotation.key !== e.target.data.key))
        setChangedAnnotation(null)
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
        setSelected(true)
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
                annotationsData.map((annotation,i) =>{
                    return new Rectangle(annotation.x,annotation.y,annotation.w,annotation.h,"test " + i,i,canvas)
                ;})
                setAnnotations(annotationsData)
            }
            canvas.on('object:modified',OnObjectChanged)
            canvas.on('object:removed',OnObjectRemoved)
            canvas.on('mouse:move',OnMouseOver)
            canvas.on('mouse:dblclick',OnDoubleClick)
            canvas.on('selection:created', OnObjectSelected)
            canvas.on('mouse:wheel',ZoomCanvas)
    }
},[canvas])
    window.addEventListener('keydown',OnButtonClicked)
    window.addEventListener('keyup',OnButtonUp)
    return (
        <PageWrapper>
            <canvas id="c"
            width={w}
            height={h}>
                <img src={image} width={w} height={h} id="bg"/>
            </canvas>
        <Tooltip display={onHover ? "block" : "none"} top={currentTooltip.top} left={currentTooltip.left}>{currentTooltip.label}</Tooltip>
        </PageWrapper>

    )
}
export default AnnotationCanvas