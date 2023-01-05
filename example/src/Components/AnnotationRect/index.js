import { fabric } from 'fabric'

class AnnotationRect{
    constructor(data) {
        this.label = data?.annotation?.label
        this.field_name = data?.annotation?.field_name
        this.parent = data?.annotation?.parent
        this.canvas = data?.canvas
        this.key = data?.annotation?.key
        this.x = data?.annotation?.x
        this.y = data?.annotation?.y
        this.w = data?.annotation?.w
        this.h = data?.annotation?.h
        this.text = data?.annotation?.text
        this.confidence = data?.annotation?.confidence
        this.isSelectable = data?.selectable ?? true
        this.fontSize = data?.style?.fontSize ?? 18
        this.confidenceFontSize = data?.style?.confidenceFontSize ?? 18
        this.showTextBoxBorder = true
        this.page_num = data?.annotation?.page_num
        this.editable = data?.isEditable
        this.style = {
            stroke: data?.style?.stroke ?? this.calcBorderColor(this.confidence),
            fill : data?.style?.fill ?? "transparent",
            strokeWidth: data?.style?.strokeWidth ?? 2,
            borderColor: data?.style?.borderColor ?? this.calcBorderColor(this.confidence),
            cornerColor: data?.style?.cornerColor ?? 'green',
            cornerSize: data?.style?.cornerSize ?? 6,
            transparentCorners: data?.style?.transparentCorners ?? false,
        }
        this.commonOptions = {
            ...this.style,
            lockMovementX : true,
            lockMovementY : true,
            lockScalingY : true,
            lockScalingX : true,
            lockRotation : true,
            hasControls : false,
            data : {
                ...data?.annotation
            },
            selectable : this.isSelectable,
        }
        this.rectOptions = {
            ...this.commonOptions,
            left : this.x,
            top : this.y,
            width: this.w,
            height: this.h,
            label : this.label,
            type : 'rect'
        }
        const widthSize = (fabric.Textbox.prototype.fontSize - ((this.w) / (this.text.split('\n')[0].length)))
        const heightSize = fabric.Textbox.prototype.fontSize - (this.h / (widthSize * this.text.split('\n').length))
        this.coords = this.calcTextPosition(this.canvas, this.x,this.y, this.w, this.h,  ((widthSize + heightSize) / 2) + 2, this.style.strokeWidth)
        this.textBoxOptions = {
            ...this.commonOptions,
            ...this.coords,
            objectCaching: false,
            editingBorderColor: 'transparent',
            stroke : 'transparent',
            fill : "black",
            fontSize : this.calcTextBoxFontSize(this.coords.width, this.coords.height, this.text),
            // lineHeight: 1 / fabric.Textbox.prototype._fontSizeMult,
            textAlign : 'left',
            label: this.label,
            // lockScalingY : true,
            backgroundColor: "#F5FEFD",
            visible : false,
            type : 'textBox',
            editable : this.editable,
            cursorDelay : 100,
            selectionStart : this.text.length,
            selectionEnd : this.text.length,
            splitByGrapheme : true,
            // fontWeight : 'bold',
            borderColor : 'transparent',
            rx : 5,
        }
        
        this.confidenceOptions = {
            ...this.commonOptions,
            left : this.x + this.w - this.fontSize,
            top : this.y - this.confidenceFontSize - this.style.strokeWidth,
            fontSize : this.confidenceFontSize,
            stroke: 'transparent',
            fill : "black",
        }
        
        this.labelOptions = {
            ...this.commonOptions,
            left : this.x,
            top : this.y - this.confidenceFontSize - this.style.strokeWidth,
            width : this.w,
            // splitByGrapheme : true,
            fontSize : this.confidenceFontSize,
            stroke : 'transparent',
            backgroundColor : this.calcBorderColor(this.confidence),
            fill : 'white',
            textAlign : 'center',
            editable : false
        }
        this.groupOptions = {
            ...this.commonOptions,
            hasBorders : false,
            left : this.x,
            top : this.y - this.confidenceFontSize - this.style.strokeWidth,
            subTargetCheck : true,
            type : "annotationGroup"
        }

        var originalRender = fabric.Textbox.prototype._render;
            fabric.Textbox.prototype._render = function(ctx) {
            originalRender.call(this, ctx);
            //Don't draw border if it is active(selected/ editing mode)
            if (this.active) return;
            
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
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
            ctx.strokeStyle = stroke;
        }

        fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');

        this.textBox = new fabric.Textbox(this.text, this.textBoxOptions)
        this.rect = new fabric.Rect(this.rectOptions)
        // this.confidenceText = new fabric.Text(`${this.confidence ? this.confidence * 100 : 0}%`, this.confidenceOptions)
        this.labelText = new fabric.Text(this.generateLabelText(this.parent, this.field_name, this.confidence), this.labelOptions)
        // this.group = new fabric.Group([this.confidenceText, this.labelText, this.rect], this.groupOptions)
        // this.canvas.add(this.group)
        // this.canvas.add(this.confidenceText)
        this.canvas.add(this.labelText)
        this.canvas.add(this.rect)
        this.canvas.add(this.textBox)
        // this.rect.moveTo(1)
        // this.textBox.moveTo(0)
        // this.group.moveTo(1)
        this.canvas.renderAll()
    }
    calcBorderColor(conf)
    {
        const g = conf * 255
        const r = (1 - conf) * 255
        return `rgb(${r},${g},0)`
    }
    calcTextBoxFontSize(w,h,text){
        let widthSize = (fabric.Textbox.prototype.fontSize - ((w) / (text.split('\n')[0].length)))
        widthSize = widthSize < 12 ? 12 : widthSize
        let heightSize = fabric.Textbox.prototype.fontSize - (h / (widthSize * text.split('\n').length))
        heightSize = heightSize < 12 ? 12 : heightSize
        return ((widthSize + heightSize) / 2)
    }
    generateLabelText(groupName, fieldName, confidence){
        groupName = this.truncateText(groupName, 11)
        fieldName = this.truncateText(fieldName,11)
        return `${groupName}.${fieldName}\t|\t${this.confidence ? this.confidence * 100 : 0}%`
    }
    truncateText(text, size){
        if(text.length > size){
            const halfWay = Math.ceil(size / 2)
            text = text.substring(0, halfWay-1) + "..." + text.substring(size - halfWay + 2,size);
        }
        return text
    }
    calcTextPosition(canvas,x,y,w,h, fontSize,strokeWidth) {
        let canvasHeight = canvas.height
        let textBottomLeftY = y + h
        return {
            left : x + strokeWidth,
            top : y + (fontSize / 4),
            width : w - (strokeWidth * 2),
            fixedWidth : w,
            height : h
        }
        if(textBottomLeftY >= canvasHeight){
            return {
                left : x,
                top : y - fontSize,
                width : w,
    
            }
        }
        return {
            left : x,
            top : y + h + fontSize,
            width : w
        }

    }
}

export default AnnotationRect