import { Readability } from "@mozilla/readability"
import styleText from "data-text:./test.css"
import type { PlasmoCSConfig, PlasmoGetStyle, PlasmoRender } from "plasmo"
import { useState, useEffect } from "react"
import  ReactDOM from "react-dom"
import { sendToBackground } from "@plasmohq/messaging"

const container = document.createElement('div')
container.id = "myRoot"
document.body.appendChild(container);
export const getRootContainer = () => document.getElementById("myRoot")

const Test = () => {
  const [info, setInfo] = useState("")

  useEffect(() => {
    window.addEventListener("load", () => {
      console.log("test")
      const newDocument = document.implementation.createHTMLDocument()
      newDocument.documentElement.innerHTML = document.documentElement.innerHTML
      const article = new Readability(newDocument).parse()
      console.log(article, "article")
      sendToBackground({
        name: "summarize",
        body: { content: article.textContent }
      }).then((res) => {
        console.log(res, "res")
        setInfo(res.message.info.description)
      })
    })
  }, [])

  return (
    <div className="test">
      <div className="info">
        {info}
      </div>
      <button>Custom button1</button>
    </div>
  )
}

export default Test
