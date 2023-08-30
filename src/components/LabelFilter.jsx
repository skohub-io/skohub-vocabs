import { css } from "@emotion/react"

const LabelFilter = ({ labels, toggleClick }) => {
  const style = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px 30px;
  `
  const handleClick = (e) => {
    toggleClick(e)
  }
  const labelBoxes = Object.entries(labels).map((label) => (
    <label className="item" key={label[0]}>
      <input
        type="checkbox"
        checked={label[1]}
        onChange={() => handleClick(label[0])}
      />
      {label[0]}
    </label>
  ))

  return <div css={style}>{labelBoxes}</div>
}

export default LabelFilter
