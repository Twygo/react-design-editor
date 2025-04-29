import React, { useEffect, useRef, useState } from "react"
import { Canvas as LayerhubCanvas, useEditor } from "@layerhub-io/react"
import Playback from "../Playback"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ContextMenu from "../ContextMenu"
import { fabric } from "fabric"

const Canvas = () => {
  const { displayPlayback } = useDesignEditorContext()
  const [suggestions, setSuggestions] = useState(['#nome_do_aluno', '#nome_do_curso', '#carga_horaria']);
  const editor = useEditor()
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(1)
  const [offsetY, setOffsetY] = useState(1)

  function handleZoom(event) {
    const canvas = editor.canvas.canvas

    const delta: number = event.e.deltaY
    const currentZoom: number = canvas.getZoom()
    const zoomDelta: number = 0.1 //Coeficiente de zoom
    const minAllowedZoom: number = 0.1 // 10 %
    const maxAllowedZoom: number = 2.4 // 240 % o msm do Common

    let zoom: number = currentZoom

    if (delta > 0) {
      zoom -= zoomDelta
    }
    else {
      zoom += zoomDelta
    }

    const object: Object = canvas.getObjects()
      .filter((q: fabric.Object) => q.id === "background")[0]

    if ((zoom >= minAllowedZoom) && (zoom <= maxAllowedZoom)) {
      let point: fabric.Point = new fabric.Point(event.e.offsetX, event.e.offsetY) //aqui vai para o mouse
      // let point2 = new fabric.Point(canvas.getWidth()/2, canvas.getHeight() /2)//verificar como no zoom out ceder ao centro

      // if (zoom < currentZoom) { //caso seja zoomOut pega o centro
      //   point = new fabric.Point(canvas.getWidth()/2, canvas.getHeight() /2)//verificar como no zoom out ceder ao centro
      // }
      // console.log('point: ', point)
      // console.log('point2: ', point2)

      // const point: fabric.Point = new fabric.Point(event.e.offsetX, event.e.offsetY) //aqui vai para o mouse
      // const point: fabric.Point = new fabric.Point(canvas.getWidth()/2, canvas.getHeight() /2)//verificar como no zoom out ceder ao centro
      // console.log('zoom ', zoom)
      // console.log('currentZoom ', currentZoom)
      editor.zoom.zoomToPoint(point, zoom);

      // console.log('viewportTransform: ', canvas.viewportTransform)
      if (zoom < currentZoom) {//pensar em como fazer um calculo que reduza o zoom aos poucos
        // canvas.viewportTransform[4] = editor.canvas.canvas.getCenter().left
        // canvas.viewportTransform[5] = editor.canvas.canvas.getCenter().top
      }

      const isOnScreen: boolean = (object as fabric.Object).isOnScreen()
      if (!isOnScreen) {
        console.log('Fora do canva');
        zoom -= zoomDelta;
        // zoom out caso nao esteja visivel na tela
        canvas.zoomToPoint(point, zoom);
      }
    }

    event.e.preventDefault();
    event.e.stopPropagation();
  }

  React.useEffect(() => {
    if (!editor) return

    const canvas = editor.canvas.canvas
    if (!canvas.width) return

    canvas.on('mouse:wheel', handleZoom)
    return () => {canvas.off('mouse:wheel', handleZoom)}
  }, [editor])

  function zoomPraCima() {
    // console.log(editor.canvas.canvas.getCenter())
    editor.zoom.zoomToFit()
    // const localOffsetY = offsetY - 30
    // console.log(localOffsetY)
    // const localZoom = zoom - 0.001
    // setOffsetY(localOffsetY)
    // setZoom(localZoom)
    // // editor.zoom.zoomToPoint(new fabric.Point(localOffsetY, offsetX), localZoom)
    // console.log(editor.frame)
  }

  function exportHTML() {
    const html = editor.canvas.canvas.toSVG();
    console.log(html);
    // Aqui você pode fazer o que quiser com o HTML exportado,
    // como exibi-lo em uma janela pop-up ou salvá-lo em um arquivo.
  }

  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      {displayPlayback && <Playback />}
      <ContextMenu />
      <LayerhubCanvas
        config={{
          background: "#f1f2f6",
          controlsPosition: {
            rotation: "BOTTOM",
          },
          shadow: {
            blur: 4,
            color: "#fcfcfc",
            offsetX: 0,
            offsetY: 0,
          },
        }}
      />
      {/* <div>
        <button onClick={zoomPraCima}>Pra cima</button>
        <button>Pra baixo</button>
      </div> */}

      {/*<button onClick={exportHTML}>Exporta em HTML</button>*/}
      {/*<div style={{ position: 'absolute', top: '250px', left: '50px', background: 'white', border: '1px solid #ccc' }}>*/}
      {/*  {suggestions.map(suggestion => (*/}
      {/*    <div key={suggestion} onClick={() => console.log(suggestion)} style={{ padding: '10px', cursor: 'pointer' }}>*/}
      {/*      {suggestion}*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </div>
  )
}

export default Canvas
