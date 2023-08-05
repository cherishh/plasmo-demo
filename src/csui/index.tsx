import { Readability } from "@mozilla/readability"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

const Main = (props) => {
  const { setShow } = props
  const [info, setInfo] = useState("")
  const [val, setVal] = useState("")
  const [answer, setAnswer] = useState("")

  useEffect(() => {
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
  }, [])

  const query = () => {
    sendToBackground({
      name: "ask",
      body: { idx: val }
    }).then((res) => {
      console.log(res, "res")
      setAnswer(res.message.info.description)
    })
  }

  return (
    <div className="main">
      <div style={{ textAlign: "right" }} onClick={() => setShow(false)}>
        {" "}
        X{" "}
      </div>
      <div className="info">{info}</div>
      <input type="text" value={val} onChange={(e) => setVal(e.target.value)} />
      <button onClick={query}>send</button>
      <div>{answer}</div>
    </div>
  )
}

export default Main
