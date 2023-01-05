import React, { useEffect, useState } from "react"
import AnnotationRect from "../AnnotationRect"
import { fabric } from "fabric"
const AnnotationsEditor = ({w, h, image, annotationsData, OnTextChange, shapeStyle, page_num, showAnnotations, isEditable = true}) =>{
    const [canvas, setCanvas] = useState()
    const initCanvas = () => {
        if(!canvas){
            let temp_canvas = new fabric.Canvas("c", {
                passive: true,
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
                    style : shapeStyle,
                    isEditable,
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
        if((e.selected[0].type === "rect" || e.selected[0].type === 'textBox') && isEditable){
            // canvas.getObjects('annotationGroup').forEach(o => {
            //     if(o.data.key !== e.selected[0].data.key){
            //         o._objects.map(i => {
            //             if(i.type === 'rect')
            //                 i.set('fill', 'transparent')
            //         })
            //     }
            // })
            canvas.getObjects('rect').forEach(o => {
                if(o.data.key !== e.selected[0].data.key){
                    o.set('fill', 'transparent')
                }
            })
            canvas.getObjects("textBox").forEach(o =>{
                if(o.data.key !== e.selected[0].data.key)
                {
                    o.set('visible', false)
                    // o.exitEditing()
                }
            })
            canvas.getObjects().forEach(o =>{
                if(o.data.key === e.selected[0].data.key && o.type === "textBox"){
                    canvas.setActiveObject(o)
                    o.bringToFront()
                    o.set('visible', true)
                    o.set('selectionStart', o.text.length)
                    o.set('selectionEnd', o.text.length)
                    o.enterEditing()
                }
            })
        }

    }

    const OnObjectDeselected = (e) =>{
        if(!e.deselected || e.deselected.length === 0){
            return
        }
        // canvas.getObjects('annotationGroup').forEach(o => {
        //     if(o.data.key === e.deselected[0].data.key){
        //         o._objects.map(i => {
        //             if(i.type === 'rect')
        //                 i.set('fill', 'transparent')
        //         })
        //     }
        // })
        canvas.getObjects('rect').forEach(o => {
            if(o.data.key !== e.deselected[0].data.key){
                o.set('fill', 'transparent')
            }
        })
        canvas.getObjects().forEach(o =>{
            if(o.data.key === e.deselected[0].data.key && o.type === "textBox"){
                o.set('visible', false)
                o.exitEditing()
            }
        })
    }

    const OnCanvasScroll = (e) =>{
        if(e.e.altKey){
            e.e.preventDefault();
            var delta = e.e.deltaY;
            var zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 2) zoom = 2;
            if (zoom < 1) zoom = 1;
            canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, zoom);
            e.e.preventDefault();
            e.e.stopPropagation();
            canvas.setZoom(zoom)
            if(zoom === 1) canvas.setViewportTransform([1,0,0,1,0,0]); 
        }
    }

    const initListeners = () => {
        if(canvas){
            canvas.on("text:editing:exited", OnObjectChange)
            canvas.on("selection:created",OnObjectSelected)
            canvas.on("selection:cleared",OnObjectDeselected)
            canvas.on("selection:updated",OnObjectSelected)
            canvas.on('mouse:wheel',OnCanvasScroll,{passive : true})
            canvas.on('text:changed', function(opt) {
                var t1 = opt.target;
                if (t1.width > t1.fixedWidth) {
                  t1.fontSize *= t1.fixedWidth / (t1.width + 1);
                  t1.width = t1.fixedWidth;
                }
              });
        }
    }

    const drawImage = () =>{
        if(canvas && image) {
            canvas.setBackgroundImage(image,canvas.renderAll.bind(canvas))
            canvas.renderAll()
        }
    }

    const hideAnnotations = () =>{
        if(canvas){
            // canvas.getObjects('textBox').forEach(o =>{
            //     o.set('visible', showAnnotations ?? true)
            // })
            canvas.discardActiveObject().renderAll()
            canvas.getObjects('rect').forEach(o =>{
                o.set('visible', showAnnotations ?? true)
            })
            canvas.getObjects('text').forEach(o =>{
                o.set('visible', showAnnotations ?? true)
            })
            canvas.renderAll()
        }
    }

    useEffect(initListeners,[canvas])
    useEffect(initCanvas,[canvas])
    useEffect(drawAnnotations,[canvas,annotationsData])
    useEffect(drawImage,[canvas,image])
    useEffect(hideAnnotations,[showAnnotations,canvas])

    return (
    <div>
        <canvas id="c"
                width={w}
                height={h}></canvas>
    </div>)
}
export default AnnotationsEditor