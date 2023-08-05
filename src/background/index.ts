import { sendToContentScript } from "@plasmohq/messaging"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.action.onClicked.addListener(() => {
  console.log(`action clicked: 11}`)
  sendToContentScript({ name: 'clickedPop' })
})