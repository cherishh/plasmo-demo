import { Readability } from "@mozilla/readability";
import { useEffect, useState } from "react";
import { sendToBackground } from "@plasmohq/messaging";
import { useStorage } from "@plasmohq/storage/hook";
import { Storage } from "@plasmohq/storage";

const st = new Storage();

const Main = (props) => {
  const { setShow } = props
  const [val, setVal] = useState("")
  // const [storage, setStorage] = useStorage("content", undefined)
  const [txt, setTxt] = useState("")

  useEffect(() => {
    const init = async () => {
      const newDocument = document.implementation.createHTMLDocument()
      newDocument.documentElement.innerHTML = document.documentElement.innerHTML
      const article = new Readability(newDocument).parse()
      console.log(article, "article")
      const initContent = [
          {
            role: "system",
            content: `你是一个阅读专家。你将会获得一份由"""分隔的文本，请仅根据该文本内容，以合适的方式回答用户关于文本的提问。如果文章中没有出现某个信息，请如实回答："文章没有提到该内容。文章内容:\n"""${article.textContent}""""\n【IMPORTANT】再次提醒，你应该只根据文章内容对用户的问题做出回答，如果文章中没有相关信息，请如实回答不知道。`
          },
          {
            role: "user",
            content: `请总结文章的主要内容，直接输入总结的内容即可。`
          }
        ];
      // setStorage(initContent)
      await st.set("ct", initContent)
      query(initContent, true)
    }
    init();
  }, [])

  const query = async (msg, isInit = false) => {
    let text = ""
    setVal("")
    await updateStorage(msg, "user");
    let newContent;
    if (isInit) {
      newContent = msg;
    } else {
      newContent = await st.get('ct');
      console.log(newContent, 'get ct');
    }

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

    console.log(
      {
        content: newContent,
        temperature: 0.3
      },
      "params"
    )

    const reader = messageRes.body
      .pipeThrough(new TextDecoderStream())
      .getReader()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const dataStrList = value.split("\n\n")
      dataStrList.forEach((dataStr) => {
        const dataJson = dataStr.replace(/^data:/, "").trim()
        try {
          const data = JSON.parse(dataJson)
          const content = data?.choices[0]?.delta?.content
          if (!content) return

          text += content
        } catch (e) {}
      })
      setTxt(text)

      // console.log(text, "text")
    }
    updateStorage(text, "assistant")
  }

  const updateStorage = async (content, role) => {
    // const cp = storage || [];
    const cp: any[] = await st.get('ct') || [];
    console.log(cp, 'get ct');
    cp.push({
      role,
      content
    })
    // setStorage(cp)
    st.set("ct", cp);

    console.log(cp, 'updated');
    return cp
  }

  const onEnter = (e) => {
    if (e.keyCode === 13) query(val)
  }

  return (
    <div className="main">
      <div style={{ textAlign: "right" }} onClick={() => setShow(false)}>
        {" "}
        X{" "}
      </div>
      <input
        onKeyUp={onEnter}
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button onClick={query}>send</button>
      <div className="px-5 py-2.5">{txt}</div>
    </div>
  )
}

export default Main