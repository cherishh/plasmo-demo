import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const messageRes = await fetch(`http://localhost:3000/chat`, {
    method: "POST",
    headers: {
      "Content-Type": 'application/json',
      "Cache-Control": "no-cache",
      "Authorization": "Bearer " + "E-08Q~DfuzIqdTW4-spyUn3Rtum9fynNe18O0bID",
      Connection: "keep-alive",
    },
    body: JSON.stringify(req.body)
  });

  
  const reader = messageRes.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.send(value);
    console.log(value, 'received');
  }
}
 
export default handler