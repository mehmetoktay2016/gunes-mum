import { useEffect, useRef } from 'react'

// Ortak pencere kabuğu (native <dialog>). `acik` prop'una göre açılır/kapanır.
// Esc ile kapatılınca onKapat çağrılır. Program kapattığında (acik=false) tekrar çağrılmaz,
// böylece bir pencereden diğerine geçerken yeni pencere yanlışlıkla kapanmaz.
function Modal({ acik, onKapat, baslikId, children }) {
  const pencere = useRef(null)

  useEffect(() => {
    const d = pencere.current
    if (acik && !d.open) d.showModal()
    if (!acik && d.open) d.close()
  }, [acik])

  return (
    <dialog
      ref={pencere}
      className="giris-pencere"
      aria-labelledby={baslikId}
      onClose={() => acik && onKapat()}
    >
      {children}
    </dialog>
  )
}

export default Modal
