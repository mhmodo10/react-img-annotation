import React, { useEffect, useState } from 'react'
import AnnotationRect from '../AnnotationRect'
import { fabric } from 'fabric'
const AnnotationsEditor = ({
  w,
  h,
  image,
  annotationsData,
  OnTextChange,
  shapeStyle,
  page_num,
  showAnnotations,
  isEditable = true,
  viewTextBox = true
}) => {
  const [canvas, setCanvas] = useState()
  const initCanvas = () => {
    if (!canvas) {
      let temp_canvas = new fabric.Canvas('c', {
        passive: true,
        selection: false
      })
      setCanvas(temp_canvas)
    }
  }

  const drawAnnotations = () => {
    if (canvas && annotationsData) {
      canvas.getObjects().forEach((o) => {
        canvas.remove(o)
      })
      const groupedAnnotations = annotationsData.reduce((acc, curr) => {
        if (acc.has(curr?.key)) {
          return acc.set(curr?.key, [...acc.get(curr?.key), curr])
        }
        return acc.set(curr?.key, [curr])
      }, new Map())
      annotationsData
        .reduce((acc, curr) => {
          if (!!acc.find((ann) => ann.key === curr.key)) {
            return acc
          }
          return [...acc, curr]
        }, [])
        .forEach((annotation) => {
          let data = {
            sameKeyAnnotations: groupedAnnotations.get(annotation.key),
            annotation,
            canvas: canvas,
            style: shapeStyle,
            isEditable
          }
          new AnnotationRect(data)
        })
    }
  }

  const drawImage = () => {
    if (canvas && image) {
      canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas))
      canvas.renderAll()
    }
  }

  const hideAnnotations = () => {
    if (canvas) {
      const handleHiding = {
        rect: (o, showAnnotations) => {
          o.set('visible', showAnnotations ?? true)
        },
        boxLabel: (o, showAnnotations) => {
          o.set('visible', showAnnotations ?? true)
        },
        verticalBar: (o, showAnnotations) => {},
        textBox: (o, showAnnotations) => {}
      }
      canvas.discardActiveObject().renderAll()

      canvas.getObjects().forEach((o) => {
        handleHiding[o.type](o, showAnnotations)
      })
      canvas.renderAll()
    }
  }

  useEffect(() => {
    const OnObjectChange = (e) => {
      if (e.target.data.text === e.target.text) {
        return
      }
      let updatedAnn = {
        ...e.target.data,
        text: e.target.text
      }
      if (OnTextChange) OnTextChange(updatedAnn)
    }

    const OnObjectSelected = (e) => {
      if (e.selected[0].type === 'rect' || e.selected[0].type === 'textBox') {
        const handleSelect = {
          rect: (o) => {},
          textBox: (o) => {
            if (!viewTextBox) return
            canvas.setActiveObject(o)
            o.bringToFront()
            o.set('visible', true)
          },
          verticalBar: (o) => {
            if (!viewTextBox) return
            o.set('visible', true)
          },
          boxLabel: (o) => {}
        }

        const handleOther = {
          rect: (o) => {
            o.set('visible', false)
          },
          boxLabel: (o) => {
            o.set('visible', false)
          },
          verticalBar: (o) => {
            o.set('visible', false)
          },
          textBox: (o) => {
            o.set('visible', false)
          }
        }
        canvas.getObjects().forEach((o) => {
          if (o.data.key === e.selected[0].data.key) {
            handleSelect[o.type](o)
          } else {
            handleOther[o.type](o)
          }
        })
      }
    }

    const OnObjectDeselected = (e) => {
      if (!e.deselected || e.deselected.length === 0) {
        return
      }

      const handleDeselect = {
        rect: (o) => {},
        textBox: (o) => {
          o.set('visible', false)
        },
        verticalBar: (o) => {
          o.set('visible', false)
        },
        boxLabel: (o) => {}
      }

      const handleOther = {
        rect: (o) => {
          o.set('visible', true)
        },
        boxLabel: (o) => {
          o.set('visible', true)
        },
        verticalBar: (o) => {},
        textBox: (o) => {}
      }

      canvas.getObjects().forEach((o) => {
        if (o.data.key === e.deselected[0].data.key) {
          handleDeselect[o.type](o)
        } else {
          handleOther[o.type](o)
        }
      })
    }

    const OnTextEdited = (e) => {
      const targetRect = canvas
        .getObjects('rect')
        .find((r) => e.target.data.key === r.data.key)
      const targetLabel = canvas
        .getObjects('boxLabel')
        .find((r) => e.target.data.key === r.data.key)
      const targetBar = canvas
        .getObjects('verticalBar')
        .find((vb) => e.target.data.key === vb.data.key)
      if (targetBar) {
        targetBar.set(
          'height',
          targetRect.height +
            e.target.height +
            targetLabel.height +
            e.target.fontSize / 5
        )
      }
    }
    const OnCanvasScroll = (e) => {
      if (e.e.altKey) {
        e.e.preventDefault()
        var delta = e.e.deltaY
        var zoom = canvas.getZoom()
        zoom *= 0.999 ** delta
        if (zoom > 2) zoom = 2
        if (zoom < 1) zoom = 1
        canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, zoom)
        e.e.preventDefault()
        e.e.stopPropagation()
        canvas.setZoom(zoom)
        if (zoom === 1) canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      }
    }

    const initListeners = () => {
      if (canvas) {
        canvas.on('object:modified', OnObjectChange)
        canvas.on('selection:created', OnObjectSelected)
        canvas.on('selection:cleared', OnObjectDeselected)
        canvas.on('selection:updated', OnObjectSelected)
        canvas.on('mouse:wheel', OnCanvasScroll, { passive: true })
        canvas.on('text:changed', OnTextEdited)
      }
    }
    initListeners()
  }, [canvas])

  useEffect(initCanvas, [canvas])
  useEffect(drawAnnotations, [canvas, annotationsData])
  useEffect(drawImage, [canvas, image])
  useEffect(hideAnnotations, [showAnnotations, canvas])

  return (
    <div>
      <canvas id='c' width={w} height={h}></canvas>
    </div>
  )
}
export default AnnotationsEditor
