import { useState } from "react"
import CopyIcon from "../icons/Copy.jsx"

const ConceptURI = ({ id }) => {
  const [isCopied, setIsCopied] = useState(false)

  async function copyToClipBoard() {
    await navigator.clipboard.writeText(id)

    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className="conceptURI">
      <h2>{id}</h2>
      <div className="tooltip">
        <span className="tooltiptext">
          {!isCopied ? "Copy URI" : "Copied!"}
        </span>
        <button onClick={() => copyToClipBoard()} type="button">
          <CopyIcon />
        </button>
      </div>
    </div>
  )
}

export default ConceptURI
