import { useEffect, useRef } from "react"
import { css } from "@emotion/react"

const Modal = ({ openModal, closeModal, children }) => {
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

  return (
    <div css={style}>
      <dialog ref={ref} onCancel={closeModal}>
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
