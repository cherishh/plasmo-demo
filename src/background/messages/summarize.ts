import type { PlasmoMessaging } from "@plasmohq/messaging"
import {sendToContentScript} from '@plasmohq/messaging'

 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await fetch('https://fakestoreapi.com/products/1')
  .then(response => response.json())
  .then(json => {
    return {
      info: json,
      req: req
    }
  })
 
  res.send({
    message
  })

  // sendToContentScript("summarize", "summarize")
}
 
export default handler