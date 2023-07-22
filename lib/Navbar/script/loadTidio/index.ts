export const loadTidio = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '//code.tidio.co/qaqhmzyxhfsct6xkbaxicly6mv91mxsq.js '
    script.setAttribute('type', 'text/javascript')

    script.onload = (e) => {
      resolve(e)
    }

    script.onerror = (e) => {
      reject(e)
    }

    document.body.appendChild(script)
  })
}
