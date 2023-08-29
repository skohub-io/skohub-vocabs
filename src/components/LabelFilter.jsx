const LabelFilter = ({ labels, toggleClick }) => {
  console.log(labels)
  const handleClick = (e) => {
    toggleClick(e)
  }
  const labelBoxes = Object.entries(labels).map((label) => (
    <label>
      <input type="checkbox" checked={label[1]} onClick={() => handleClick(label[0])} />
      {label[0]}
    </label>
  ))


  return (
    <div>
      {labelBoxes}
    </div>
  )
}

export default LabelFilter
