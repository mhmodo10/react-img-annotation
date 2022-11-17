import React, { useEffect, useState } from "react"
import AnnotationRect from "../AnnotationRect"
import { fabric } from "fabric"
import TextInput from "../TextInput"
const AnnotationsEditor = ({w, h, image, annotationsData, OnTextChange, OnAnnotationsChange, shapeStyle, page_num}) =>{
    //TODO: add zoom in functionality
    //TODO: pass style to rect object
    //TODO: test final product
    const [canvas, setCanvas] = useState()
    const initCanvas = () => {
        if(!canvas){
            let temp_canvas = new fabric.Canvas("c", {
                selection : false,
            })
            setCanvas(temp_canvas)
        }
    }

    const drawAnnotations = () => {
        if(canvas && annotationsData){
            canvas.getObjects().forEach(o =>{
                canvas.remove(o)
            })
            annotationsData.forEach(annotation => {
                let data = {
                    annotation,
                    canvas : canvas,
                }
                new AnnotationRect(data)
            })
        }
    }
    
    const OnObjectChange = (e) => {
        let updatedAnn = {
            ...e.target.data,
            text : e.target.text
        }
        if(OnTextChange)
            OnTextChange(updatedAnn)
    }

    const OnObjectSelected = (e) =>{
        if(e.selected[0].type === "annotationGroup"){
            canvas.getObjects("textBox").forEach(o =>{
                o.set('visible', false)
            })
            canvas.getObjects().forEach(o =>{
                if(o.data.key === e.selected[0].data.key && o.type === "textBox"){
                    o.set('visible', true)
                }
            })
        }

    }

    const OnObjectDeselected = (e) =>{
        canvas.getObjects().forEach(o =>{
            if(o.data.key === e.deselected[0].data.key && o.type === "textBox"){
                o.set('visible', false)
            }
        })
    }

    const initListeners = () => {
        if(canvas){
            canvas.on("object:modified", OnObjectChange)
            canvas.on("selection:created",OnObjectSelected)
            canvas.on("selection:cleared",OnObjectDeselected)
            canvas.on("selection:updated",OnObjectSelected)
        }
    }

    const drawImage = () =>{
        if(canvas && image) {
            canvas.setBackgroundImage(image,canvas.renderAll.bind(canvas))
            canvas.renderAll()
        }
    }
    useEffect(initListeners,[canvas])
    useEffect(initCanvas,[canvas])
    useEffect(drawAnnotations,[canvas,annotationsData])
    useEffect(drawImage,[canvas,image])
    return (
    <div>
        <canvas id="c"
                width={w ?? 1920}
                height={h ?? 1080}></canvas>
    </div>)
}
export default AnnotationsEditor