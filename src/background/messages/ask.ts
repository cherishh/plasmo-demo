import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await fetch(`https://fakestoreapi.com/products/${req.body.idx}`)
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
}
 
export default handler