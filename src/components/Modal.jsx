import { useEffect, useRef } from "react"
import { css } from "@emotion/react"

function isMarginClick(element, event) {
  var width = element.offsetWidth
  var height = element.offsetHeight
  var x = parseFloat(event.offsetX)
  var y = parseFloat(event.offsetY)

  return x < 0 || x > width || y < 0 || y > height
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // a dialog puts a big margin around itself
      // do nothing if it is not a margin click
      if (!isMarginClick(event.target, event)) {
        return
      }
      handler(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

const Modal = ({ openModal, closeModal, id, children }) => {
  const style = css`
    dialog {
      border: none;
      border-radius: 10px;
  `

  const ref = useRef()

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [openModal])

  useOnClickOutside(ref, closeModal)

  return (
    <div css={style}>
      <dialog id={id} ref={ref} onCancel={closeModal}>
        {children}
        <br />
        <button id="closeModal" className="close" onClick={closeModal}>
          Close
        </button>
      </dialog>
    </div>
  )
}

export default Modal
