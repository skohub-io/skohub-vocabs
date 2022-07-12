/** @jsx jsx */
import { css, jsx } from '@emotion/react'

const style = css`
  display: flex;
  margin-bottom: 10px;

  input[type=button] {
    flex: 1;
    padding: 5px 10px;

    &:first-of-type {
      margin-right: 10px;
    }
  }
`

const TreeControls = () => (
  <div
    className="TreeControls"
    css={style}
  >
    <input
      type="button"
      className="inputStyle"
      value="Collapse"
      onClick={() => {
        [...document.querySelectorAll('.treeItemIcon')].forEach(el => el.classList.add("collapsed"))
      }}
    />
    <input
      type="button"
      className="inputStyle"
      value="Expand"
      onClick={() => {
        [...document.querySelectorAll('.collapsed')].forEach(el => el.classList.remove("collapsed"))
      }}
    />
  </div>
)

export default TreeControls
