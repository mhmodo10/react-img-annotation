import { fabric } from "fabric";
import {deleteIcon} from "../../Images/images_exports"
class TextInput{
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
        this.scaleX =  1
        this.scaleY = 1
        this.options = {
            left: data.x,
            top: data.y,
            width: data.w,
            height: data.h,
            scaleX : this.scaleX,
            scaleY : this.scaleY,
            objectCaching: false,
            stroke: 'transparent',
            fill : "black",
            fontSize : data.fontSize ? data.fontSize : 20,
            strokeWidth: data?.style?.strokeWidth ? data?.style?.strokeWidth :2,
            label: this.label,
            data : {
                key : data.key,
                label: data.label
            },
            showTextBoxBorder: true,
            lockScalingY : true,
            borderColor: data?.style?.borderColor ? data?.style?.borderColor : 'red',
            cornerColor: data?.style?.cornerColor ? data?.style?.cornerColor : 'green',
            cornerSize: data?.style?.cornerSize ? data?.style?.cornerSize :6,
            transparentCorners: data?.style?.transparentCorners ? data?.style?.transparentCorners :false,
            selectable : data?.isSelectable ?? true,
        }
        var originalRender = fabric.Textbox.prototype._render;
        fabric.Textbox.prototype._render = function(ctx) {
        originalRender.call(this, ctx);
        //Don't draw border if it is active(selected/ editing mode)
        if (this.canvas._activeObject === this) return;
        if(this.showTextBoxBorder){
            var w = this.width,
            h = this.height,
            x = -this.width / 2,
            y = -this.height / 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x, y);
            ctx.closePath();
            var stroke = ctx.strokeStyle;
            ctx.strokeStyle = this.textboxBorderColor;
            ctx.stroke();
            ctx.strokeStyle = stroke;
        }
        }
        fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');

        this.shape = new fabric.Textbox(this.text,this.options)
        var img = document.createElement('img');
        img.src = deleteIcon;

        fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
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
        this.shape.set('options',style)
        this.canvas.renderAll()
    }
}
export default TextInput