/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const style = css`
  display: flex;

  input[type=button] {
    flex: 1;
  }
`

const TreeControls = () => (
  <div
    className="TreeControls"
    css={style}
  >
    <input
      type="button"
      className="btn"
      value="Collapse"
      onClick={() => {
        [...document.querySelectorAll('.treeItemIcon')].forEach(el => el.classList.add("collapsed"))
      }}
    />
    <input
      type="button"
      className="btn"
      value="Expand"
      onClick={() => {
        [...document.querySelectorAll('.collapsed')].forEach(el => el.classList.remove("collapsed"))
      }}
    />
  </div>
)

export default TreeControls