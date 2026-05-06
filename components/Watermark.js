import { useEffect } from 'react'

export default function Watermark() {
  const 昵称 = '不惑X'
  const 域名 = 'nitama.de'
  const 水印文字 = `© ${昵称}  ${域名}`

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 180
    const ctx = canvas.getContext('2d')
    ctx.translate(160, 90)
    ctx.rotate(-22 * Math.PI / 180)
    ctx.font = '14px Arial'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.07)'
    ctx.textAlign = 'center'
    ctx.fillText(水印文字, 0, 0)

    const div = document.createElement('div')
    div.id = '__watermark__'
    div.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      `background-image:url(${canvas.toDataURL()})`,
      'pointer-events:none', 'z-index:99999', 'user-select:none'
    ].join(';')
    document.body.appendChild(div)

    const observer = new MutationObserver(() => {
      if (!document.getElementById('__watermark__')) {
        document.body.appendChild(div)
      }
    })
    observer.observe(document.body, { childList: true })

    const handleCopy = () => {
      const selected = window.getSelection()?.toString() || ''
      if (selected.length > 15) {
        const notice = `\n\n---\n原文作者：${昵称}\n原文地址：https://${域名}\n转载请注明出处`
        navigator.clipboard.writeText(selected + notice).catch(() => {})
      }
    }
    document.addEventListener('copy', handleCopy)

    return () => {
      document.getElementById('__watermark__')?.remove()
      observer.disconnect()
      document.removeEventListener('copy', handleCopy)
    }
  }, [])

  return null
}
