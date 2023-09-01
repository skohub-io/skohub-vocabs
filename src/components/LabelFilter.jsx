import { css } from "@emotion/react"

function UnderlinedText(props) {
  return <span style={{ textDecoration: "underline" }}>{props.children}</span>
}

const LabelFilter = ({ labels, toggleClick }) => {
  const style = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px 30px;
    padding: 2px;
  `
  const handleClick = (e) => {
    toggleClick(e)
  }
  const labelBoxes = Object.entries(labels).map((label) => (
    <label className="item" key={label[0]}>
      <input
        type="checkbox"
        id={label[0] + "CheckBox"}
        checked={label[1]}
        onChange={() => handleClick(label[0])}
      />
      <UnderlinedText>{label[0][0]}</UnderlinedText>
      {label[0].slice(1)}
    </label>
  ))

  return <div css={style}>{labelBoxes}</div>
}

export default LabelFilter
