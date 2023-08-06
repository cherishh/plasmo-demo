import { Readability } from "@mozilla/readability"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

const Main = (props) => {
  const { setShow } = props
  const [info, setInfo] = useState("")
  const [val, setVal] = useState("")
  const [content, setContent] = useStorage("content", undefined)
  const [txt, setTxt] = useState("")


  useEffect(() => {
    console.log(content, "content get")
    if (content === undefined) {
      setContent({
        content: [
          {
            role: "user",
            content: "我是kk，今年24岁。"
          },
          {
            role: "assistant",
            content:
              "你好kk！很高兴认识你。你今年24岁，那你是个年轻人呢！有什么我可以帮助你的吗？"
          }
        ],
        temperature: 0.3
      })
    } else {
      console.log(content, "content stored")
    }
  }, [])

  useEffect(() => {
    const newDocument = document.implementation.createHTMLDocument()
    newDocument.documentElement.innerHTML = document.documentElement.innerHTML
    const article = new Readability(newDocument).parse()
    console.log(article, "article")
    sendToBackground({
      name: "summarize",
      body: { content: article.textContent }
    }).then((res) => {
      // console.log(res, "res")
      setInfo(res.message.info.description)
    })
  }, [])

  const query = async () => {
    let text = ''
    setVal("")
    console.log(content, "content")

    const newContent = content.content
    newContent.push({
      role: "user",
      content: "我今年多大了？"
      // content: val
    })
    setContent({
      content: newContent,
      temperature: 0.3
    })

    const messageRes = await fetch(`http://localhost:3000/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Connection: "keep-alive",
        Authorization: `Bearer E-08Q~DfuzIqdTW4-spyUn3Rtum9fynNe18O0bID`
      },
      body: JSON.stringify({
        content: newContent,
        temperature: 0.3
      })
    })

    const reader = messageRes.body
      .pipeThrough(new TextDecoderStream())
      .getReader()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const dataStrList = value.split('\n\n')
      dataStrList.forEach(dataStr => {
        const dataJson = dataStr.replace(/^data:/, '').trim()
        try {
          const data = JSON.parse(dataJson)
          const content = data?.choices[0]?.delta?.content
          if (!content) return
  
          text += content
  
        } catch (e) {}
      })
      setTxt(text)
      console.log(text, "text")

    }
  }

  const onEnter = (e) => {
    if (e.keyCode === 13) query()
  }

  return (
    <div className="main">
      <div style={{ textAlign: "right" }} onClick={() => setShow(false)}>
        {" "}
        X{" "}
      </div>
      <div className="info">{info}</div>
      <input
        onKeyUp={onEnter}
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button onClick={query}>send</button>
      <div>{txt}</div>
    </div>
  )
}

export default Main
