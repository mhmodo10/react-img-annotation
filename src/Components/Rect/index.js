import { fabric } from "fabric";
import {deleteIcon} from "../../Images/images_exports"
class Rectangle{
    constructor(data){
        this.label = data.label
        this.canvas = data.canvas;
        this.key = data.key;
        this.x = data.x
        this.y = data.y
        this.w = data.w
        this.h = data.h
        this.text = data.text
        this.type = data.type
        this.style = {
            stroke: data.style.stroke ? data.style.stroke : "black",
            fill : data.style.fill ? data.style.fill : "transparent",
            strokeWidth: data.style.strokeWidth ? data.style.strokeWidth : 2,
            borderColor: data.style.borderColor ? data.style.borderColor : 'red',
            cornerColor: data.style.cornerColor ? data.style.cornerColor : 'green',
            cornerSize: data.style.cornerSize ? data.style.cornerSize :6,
            transparentCorners: data.style.transparentCorners ? data.style.transparentCorners :false,
        }
        this.options = {
            ...this.style,
            left: data.x,
            top: data.y,
            width: data.w,
            height: data.h,
            objectCaching: false,
            label: this.label,
            data : {
                key : data.key,
                label: data.label,
            },
            selectable : data.isSelectable,
        }
        this.shape = new fabric.Rect(this.options)
        var img = document.createElement('img');
        img.src = deleteIcon;

        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: 0.5,
            offsetY: 16,
            cursorStyle: 'pointer',
            mouseUpHandler: deleteObject,
            render: renderIcon,
            cornerSize: 24
          });
        

        function deleteObject(eventData, transform) {
            var target = transform.target;
            var canvas = target.canvas;
            canvas.remove(target);
            canvas.requestRenderAll();
        }
    
        function renderIcon(ctx, left, top, styleOverride, fabricObject) {
            var size = this.cornerSize;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(img, -size/2, -size/2, size, size);
            ctx.restore();
        }
        this.canvas.add(this.shape)
    }
    setProperties(data) {
        this.shape.set({...data})
        this.canvas.renderAll()
    }
    getAnnotation(){
        return {
            key : this.key,
            label : this.label,
            x : this.x,
            y : this.y,
            w : this.w,
            h : this.h,
            text : this.text,
            type : this.type
        }
    }
    setStyle(data){
        let style = {
            ...data.style
        }
        this.shape.set({
            ...style
        })
        this.canvas.renderAll()
    }
}
export default Rectangle