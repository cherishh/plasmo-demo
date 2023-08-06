import { Readability } from "@mozilla/readability"
import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { sendToBackground } from "@plasmohq/messaging"

const Main = (props) => {
  const { setShow } = props
  const [info, setInfo] = useState("")
  const [val, setVal] = useState("")
  const [answer, setAnswer] = useState("")
  const [content, setContent] = useStorage("content", undefined)

  useEffect(() => {
    console.log(content, "content get");
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
          },
        ],
        temperature: 0.3
      })
    } else {
      console.log(content, "content stored");
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

  const query = () => {
    setVal("")
    setAnswer('set answer')
    console.log(content, "content");

    const newContent = content.content;
    newContent.push({
      role: "user",
      content: '我今年多大了？'
      // content: val
    });
    setContent({
      content: newContent,
      temperature: 0.3
    });

    sendToBackground({
      name: "ask",
      body: { content: newContent, temperature: content.temperature }
    }).then((res) => {
      console.log(res, "res")
    })
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
      <div>{answer}</div>
    </div>
  )
}

export default Main
