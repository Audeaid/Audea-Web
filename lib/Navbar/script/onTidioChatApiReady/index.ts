// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

export const onTidioChatApiReady = () => {
  window.tidioChatApi.on('close', function () {
    window.tidioChatApi.hide()
  })

  window.tidioChatApi.show()
  window.tidioChatApi.open()

  window.tidioChatApi.messageFromOperator('What can we help you today?')
}
