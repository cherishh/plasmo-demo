import { Readability } from "@mozilla/readability"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetStyle, PlasmoRender } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

import Main from "../csui/index"
import store from "../store"

export const config: PlasmoCSConfig = {
  all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Container = (props) => {
  const [show, setShow] = useState(false)
  const { data } = useMessage<string, string>(async (req, res) => {
    setShow(true)
  })

  useEffect(() => {}, [])

  return (
    <div className="container">{show ? <Main setShow={setShow} /> : null}</div>
  )
}

export default Container
