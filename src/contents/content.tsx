import { Readability } from "@mozilla/readability"
import styleText from "data-text:./test.css"
import type { PlasmoCSConfig, PlasmoGetStyle, PlasmoRender } from "plasmo"
import { useState, useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"
import store from '../store';
import Main from '../csui/index'

export const config: PlasmoCSConfig = {
  all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const Container = (props) => {
  const [show, setShow] = useState(false)
  const { data } = useMessage<string, string>(async (req, res) => {
    setShow(true)
  })

  useEffect(() => {

  }, [])

  return (
    <div className="container">
      {show ? <Main setShow={setShow} /> : null}
    </div>
  )
}

export default Container
