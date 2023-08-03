import { Readability } from "@mozilla/readability"
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect } from "react"
import "./test.css"

// export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.querySelector("body")

window.addEventListener("load", () => {
  console.log("test")
  const newDocument = document.implementation.createHTMLDocument()
  newDocument.documentElement.innerHTML = document.documentElement.innerHTML
  const article = new Readability(newDocument).parse()
  console.log(article, "article")
})

const Test = () => {
  useEffect(() => {
    
  }, [])

  return (
    <div className="test">
      <button>Custom button</button>
    </div>
  )
}

export default Test
