import { useState } from "react"

import "./style.css"

function IndexNewtab() {
  const [data, setData] = useState("")

  return (
    <div
      className="px-5 py-10">
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <footer>Crafted by @PlamoHQ</footer>
    </div>
  )
}

export default IndexNewtab
