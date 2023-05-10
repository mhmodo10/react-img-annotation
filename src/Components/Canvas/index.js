import React, { useEffect, useState, useCallback } from 'react'
import { fabric } from 'fabric'
import Rectangle from '../Rect'
import TextInput from '../TextInput'
import './style.css'
const AnnotationCanvas = ({
  w,
  h,
  image,
  annotationsData,
  OnAnnotationsChange,
  OnAnnotationsDelete,
  OnAnnotationSelect,
  modifiedLabel,
  isSelectable,
  shapeStyle,
  chosenAnnotations,
  chosenStyle,
  activeAnnotation,
  highlightedAnnotation,
  page_num: pageNum,
  isEditable = true
}) => {
  const [canvas, setCanvas] = useState()
  const [currentTooltip, setCurrentTooltip] = useState({
    label: 'test',
    top: 0,
    left: 0
  })
  const [onHover, setOnHover] = useState(false)
  const [canvasAnnotations, setCanvasAnnotations] = useState([])
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const [currentPageNum, setCurrentPageNum] = useState(pageNum)

  // find target in array
  const isInArray = (target, arr) => {
    const match = arr.filter((ann) => ann.key === target.key)
    return match.length > 0
  }
  const createObject = (type, data) => {
    switch (type) {
      case 'RECT':
        return new Rectangle(data)
      case 'INPUT':
        return new TextInput(data)
      default:
        return new Rectangle(data)
    }
  }
  const OnBoxesUpdate = () => {
    OnBoxesChange(
      canvas.getObjects().map((annotation, i) => {
        if (annotation.group) {
          return {
            x:
              annotation.left +
              annotation.group.left +
              annotation.group.width / 2,
            y:
              annotation.top +
              annotation.group.top +
              annotation.group.height / 2,
            w: annotation.group.scaleX
              ? annotation.width * annotation.group.scaleX
              : annotation.width,
            h: annotation.group.scaleY
              ? annotation.height * annotation.group.scaleY
              : annotation.height,
            page_num: canvas.page_num,
            ...annotation.data
          }
        } else {
          // annotation.set({
          //     'width' : annotation.width * annotation.scaleX,
          //     'height' : annotation.height * annotation.scaleY,
          //     'scaleX' : 1,
          //     'scaleY' : 1
          // })
          return {
            x: annotation.aCoords.tl.x,
            y: annotation.aCoords.tl.y,
            w: annotation.scaleX
              ? annotation.width * annotation.scaleX
              : annotation.width,
            h: annotation.scaleY
              ? annotation.height * annotation.scaleY
              : annotation.height,
            page_num: canvas.page_num,
            ...annotation.data
          }
        }
      })
    )
  }
  const OnBoxesChange = useCallback(
    (anns) => {
      if (OnAnnotationsChange) OnAnnotationsChange(anns)
    },
    [OnAnnotationsChange]
  )

  const OnButtonUp = (e) => {
    if (!isEditable) {
      return
    }
    e.preventDefault()
    if (e.code === 'KeyD' && selectedAnnotation) {
      if (selectedAnnotation.get('type') === 'textbox') {
        if (!selectedAnnotation.isEditing) {
          setSelectedAnnotation(null)
        }
      } else {
        canvas.remove(selectedAnnotation)
        setSelectedAnnotation(null)
      }
    }
  }

  // handles canvas zoom
  const ZoomCanvas = (opt) => {
    if (opt.e.altKey) {
      var delta = opt.e.deltaY
      var zoom = canvas.getZoom()
      zoom *= 0.999 ** delta
      if (zoom > 2) zoom = 2
      if (zoom < 1) zoom = 1
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
      opt.e.preventDefault()
      opt.e.stopPropagation()
      canvas.setZoom(zoom)
    }
  }

  // creates new rectangle
  const OnDoubleClick = (e) => {
    if (!isEditable) {
      return
    }
    if (canvas.getActiveObjects()) {
      const key = new Date().getTime()
      const data = {
        x: e.pointer.x,
        y: e.pointer.y,
        w: 100,
        h: 100,
        label: `box ${annotationsData.length}`,
        page_num: canvas.page_num,
        key: key,
        canvas: canvas,
        type: 'RECT',
        isSelectable: !!isSelectable,
        style: shapeStyle
      }
      const rect = createObject(data.type, data)
      setCanvasAnnotations((canvasAnnotations) => [...canvasAnnotations, rect])
      OnBoxesUpdate()
      canvas.setActiveObject(rect.shape)
    }
  }

  // shows tooltip
  const OnMouseOver = (e) => {
    if (e.target && canvas.getActiveObjects().length === 0) {
      setOnHover(true)
      setCurrentTooltip({
        top: e.e.clientY,
        left: e.e.clientX,
        label: e.target.data.label
      })
    } else {
      setOnHover(false)
    }
  }

  // on remove object
  const OnObjectRemoved = (e) => {
    setCanvasAnnotations((canvasAnnotations) =>
      canvasAnnotations.filter(
        (canvasAnnotation) =>
          canvasAnnotation.shape.data.key !== e.target.data.key &&
          canvasAnnotation.shape.data.page_num !== e.target.data.page_num
      )
    )
    if (OnAnnotationsDelete && canvas.page_num === e.target.data.page_num) {
      OnAnnotationsDelete(e.target.data)
    }
  }

  // detects change in objects
  const OnObjectChanged = (e) => {
    OnBoxesUpdate()
  }

  // highlights object
  const higlightObject = () => {
    if (highlightedAnnotation) {
      canvasAnnotations.forEach((ann) => {
        if (ann.key === highlightedAnnotation.key) {
          ann.setStyle({ style: chosenStyle })
        } else {
          ann.setStyle({ style: shapeStyle })
        }
      })
    }
  }

  // on object selection
  const OnObjectSelected = (e) => {
    if (OnAnnotationSelect && e.selected.length === 1) {
      const annotation = {
        x: e.selected[0].left,
        y: e.selected[0].top,
        w: e.selected[0].width * e.selected[0].scaleX,
        h: e.selected[0].height * e.selected[0].scaleY,
        key: e.selected[0].data.key,
        label: e.selected[0].data.label
      }
      setSelectedAnnotation(e.selected[0])
      OnAnnotationSelect(annotation)
    }
  }

  // adds canvas event listeners
  const addEventListeners = () => {
    if (canvas) {
      canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas))
      canvas.on('object:modified', OnObjectChanged)
      canvas.on('object:scaling', () => {
        canvas.getObjects().forEach((annotation) => {
          annotation.set({
            width: annotation.width * annotation.scaleX,
            height: annotation.height * annotation.scaleY,
            scaleX: 1,
            scaleY: 1
          })
        })
      })
      canvas.on('object:removed', OnObjectRemoved)
      canvas.on('mouse:move', OnMouseOver)
      canvas.on('mouse:dblclick', OnDoubleClick)
      canvas.on('selection:created', OnObjectSelected)
      canvas.on('mouse:wheel', (opt) => {
        ZoomCanvas(opt)
      })
      canvas.on('selection:cleared', () => {
        setSelectedAnnotation(null)
      })
    }
  }

  // initialize objects on canvas
  const initializeObjects = () => {
    if (annotationsData && canvas) {
      canvas.set('page_num', currentPageNum)
      canvas.getObjects().forEach((o) => {
        canvas.remove(o)
      })

      setCanvasAnnotations(
        annotationsData.map((annotation, i) => {
          const data = getAnnotationData(annotation, currentPageNum)
          if (chosenAnnotations && isInArray(annotation, chosenAnnotations)) {
            data.style = chosenStyle
            return createObject(data.type, data)
          }
          return createObject(data.type, data)
        })
      )
    }
  }

  // changes label of annotation
  const updateLabel = () => {
    if (modifiedLabel) {
      canvasAnnotations.forEach((canvasAnnotation, i) => {
        if (canvasAnnotation.shape.data.key === modifiedLabel.key) {
          canvasAnnotation.shape.data.label = modifiedLabel.label
        }
      })
      OnBoxesChange(
        annotationsData.map((annotation, i) => {
          if (annotation.key === modifiedLabel.key) {
            return { ...annotation, label: modifiedLabel.label }
          }
          return annotation
        })
      )
    }
  }

  // returns annotation data object
  const getAnnotationData = (ann, pageIndex) => {
    return {
      x: ann.x,
      y: ann.y,
      w: ann.w,
      h: ann.h,
      label: ann.label,
      key: ann.key,
      page_num: pageIndex,
      canvas: canvas,
      isSelectable: isEditable,
      style: shapeStyle,
      type: ann.type,
      text: ann.text ? ann.text : '',
      fontSize: ann.fontSize ? ann.fontSize : 8
    }
  }

  // sets active annotation
  const activateObjects = () => {
    if (canvas && activeAnnotation) {
      canvas.getObjects().forEach((o) => {
        if (o.data.key === activeAnnotation.key) {
          canvas.setActiveObject(o)
        }
      })
    }
  }

  const updateCanvas = () => {
    if (canvas) {
      canvas.setHeight(h)
      canvas.setWidth(w)
      canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas))
      canvas.renderAll()
    }
  }

  const updateChosenAnnotations = () => {
    if (chosenStyle && canvas && chosenAnnotations) {
      canvas.getObjects('defaultRect').forEach((o) => {
        const match = chosenAnnotations.filter((ann) => ann.key === o.data.key)
        if (match.length > 0) o.objectClass.setStyle(chosenStyle)
        else o.objectClass.setStyle(shapeStyle)
      })
    }
  }
  // on image change
  useEffect(updateCanvas, [image, canvas])

  // on highlighted object change
  useEffect(higlightObject, [highlightedAnnotation])

  // on canvas change
  useEffect(addEventListeners, [canvas])

  // on annotationsData change
  useEffect(initializeObjects, [currentPageNum, canvas])

  // on modified label change
  useEffect(updateLabel, [modifiedLabel])

  // on active annotation change
  useEffect(activateObjects, [activeAnnotation])

  useEffect(updateChosenAnnotations, [chosenAnnotations, canvas])

  useEffect(() => {
    setCurrentPageNum(pageNum)
  }, [pageNum])

  useEffect(() => {
    if (!canvas && w && h) {
      const tempCanvas = new fabric.Canvas('c', {
        selection: true
      })
      setCanvas(tempCanvas)
    }
  }, [canvas])

  // add window event listeners on start
  useEffect(() => {
    window.addEventListener('keyup', OnButtonUp)
    return () => {
      window.removeEventListener('keyup', OnButtonUp)
    }
  })
  return (
    <div>
      <canvas id='c' width={w} height={h} />

      <div
        className='toolTip'
        style={{
          display: `${onHover ? 'block' : 'none'}`,
          top: currentTooltip.top,
          left: currentTooltip.left
        }}
      >
        {currentTooltip.label}
      </div>
    </div>
  )
}
export default AnnotationCanvas
