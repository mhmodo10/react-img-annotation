import { fabric } from 'fabric'

class AnnotationRect{
    constructor(data) {
        this.label = data?.annotation?.label
        this.canvas = data?.canvas
        this.key = data?.annotation?.key
        this.x = data?.annotation?.x
        this.y = data?.annotation?.y
        this.w = data?.annotation?.w
        this.h = data?.annotation?.h
        this.text = data?.annotation?.text
        this.confidence = data?.annotation?.confidence
        this.isSelectable = data?.selectable ?? true
        this.fontSize = data?.fontSize ?? 18
        this.showTextBoxBorder = true
        this.page_num = data?.annotation?.page_num
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
            
        }
        
        this.textBoxOptions = {
            ...this.commonOptions,
            ...this.calcTextPosition(this.canvas, this.x,this.y, this.w, this.h, this.fontSize),
            objectCaching: false,
            stroke: 'transparent',
            fill : "black",
            fontSize : this.fontSize,
            label: this.label,
            lockScalingY : true,
            backgroundColor: "white",
            visible : false,
            type : 'textBox'
        }
        
        this.confidenceOptions = {
            ...this.commonOptions,
            left : this.x + this.w - this.fontSize,
            top : this.y - this.fontSize/2 - this.style.strokeWidth,
            fontSize : (this.fontSize / 2) >= 10 ? this.fontSize/2 : 10,
            stroke: 'transparent',
            fill : "black",
        }
        
        this.groupOptions = {
            ...this.commonOptions,
            hasBorders : false,
            left : this.x,
            top : this.y,
            subTargetCheck : true,
            type : "annotationGroup"
        }

        this.textBox = new fabric.Textbox(this.text, this.textBoxOptions)
        this.rect = new fabric.Rect(this.rectOptions)
        this.confidenceText = new fabric.Text(`${this.confidence ? this.confidence * 100 : 0}%`, this.confidenceOptions)
        this.group = new fabric.Group([this.confidenceText, this.rect], this.groupOptions)
        this.canvas.add(this.textBox)
        this.canvas.add(this.group)
        this.canvas.renderAll()
    }
    calcBorderColor(conf)
    {
        const g = conf * 255
        const r = (1 - conf) * 255
        return `rgb(${r},${g},0)`
    }
    calcTextPosition(canvas,x,y,w,h, fontSize) {
        let canvasHeight = canvas.height
        let textBottomLeftY = y + h
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