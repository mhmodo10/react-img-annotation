import { fabric } from "fabric";
class Rectangle{
    constructor(x,y,w,h,label,key,canvas){
        this.label = label
        this.canvas = canvas;
        var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

        var img = document.createElement('img');
        img.src = deleteIcon;
        this.rect = new fabric.Rect({
            left: x,
            top: y,
            width: w,
            height: h,
            objectCaching: false,
            stroke: 'black',
            fill : "transparent",
            strokeWidth: 1,
            label: this.label,
            data : {key : key,label: label},
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 6,
            transparentCorners: false,
        })
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
        this.canvas.add(this.rect)
    }
    // setSelected = (selected) =>{
    //     this.isSelected = selected;
    // }
    // clear = () => {
    //     this.ctx.clearRect(this.x-10,this.y-5,this.x+this.w + 10,this.y+this.h + 5)
    //     // this.ctx.clearRect(0,0,900,900)
    // }
    // draw = () => {
    //     this.clear()
    //     if(this.isSelected){
    //         this.ctx.strokeStyle= "red"
    //     }
    //     else{
    //         this.ctx.strokeStyle = "black"
    //     }
    //     this.ctx.moveTo(this.x, this.y);
    //     this.ctx.beginPath();
    //     this.ctx.lineTo(this.x+this.w, this.y);
    //     this.ctx.lineTo(this.x+this.w, this.y+this.h);
    //     this.ctx.lineTo(this.x,this.y+this.h)
    //     this.ctx.lineTo(this.x,this.y)
    //     this.ctx.closePath();
    //     this.ctx.stroke()

    // }
    // checkCloseEnough = (p1,p2) =>{
    //     return Math.abs(p2 - p1) < this.errorMargin
    // }
    // resize = (x,y,w,h) => {
    //     if(w > 10 && h > 10
    //         && x > 0 && x < this.canvasW
    //         && h > 0 && h < this.canvasH
    //         && w + x < this.canvasW
    //         && h + y < this.canvasH){
    //         this.clear()
    //         this.x = x;
    //         this.y = y;
    //         this.w = w;
    //         this.h = h;
    //         this.draw()
    //     }
    // }
    // isInBox = (currentCoords) => {
    //     return (currentCoords.x > this.x
    //         && currentCoords.x < (this.x + this.w)
    //         && currentCoords.y > this.y
    //         && currentCoords.y < (this.y + this.h))
    // }
    // isTopSide = (currentCoords) =>{
    //     return (this.checkCloseEnough(currentCoords.y, this.y)
    //         && currentCoords.x > this.x
    //         && currentCoords.x < (this.x + this.w))
    // }
    // isBottomSide = (currentCoords) =>{
    //     return (this.checkCloseEnough(currentCoords.y , (this.y + this.h))
    //         && currentCoords.x > this.x
    //         && currentCoords.x < (this.x + this.w))
    // }
    // isLeftSide = (currentCoords) =>{
    //     return (this.checkCloseEnough(currentCoords.x, this.x)
    //     && currentCoords.y > this.y
    //     && currentCoords.y < (this.y + this.h))
    // }
    // isRightSide = (currentCoords) =>{
    //     return (this.checkCloseEnough(currentCoords.x , (this.x + this.w))
    //             && currentCoords.y > this.y
    //             && currentCoords.y < (this.y + this.h))
    // }
}
export default Rectangle