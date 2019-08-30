/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { t, getPath } from '../common'

const style = css`
  list-style-type: none;
  padding: 0;

  .treeItemIcon {
    background-color: #3C3C3C;
    color: white;
    cursor: pointer;
    display: inline-flex;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    font-weight: bold;

    &:before {
      position: relative;
      top: -1px;
      content: "˗";
    }

    &.collapsed {

      &:before {
        left: -1px;
        content: "+"
      }

      & + a + ul {
        display: none;
      }
    }
  }
`
const getNestedItems = item => {
  let ids = [item.id]
  if (item.narrower) {
    item.narrower.forEach(narrower => {
      ids = ids.concat(getNestedItems(narrower))
    })
  }
  return ids
}

const NestedList = ({ items, current, baseURL, filter, highlight }) => {
  const filteredItems = filter
    ? items.filter(item => !filter || filter.some(filter => getNestedItems(item).includes(filter)))
    : items

  return (
    <ul css={style}>
      {filteredItems.map(item => (
        <li
          key={item.id}
        >
          {(item.narrower && item.narrower.length > 0) && (
            <div
              className={`treeItemIcon${(filter || getNestedItems(item).flat().some( id => id === current))
                ?  '' : ' collapsed'}`}
              onClick={(e) => {
                e.target.classList.toggle("collapsed")
              }}
            >
            </div>
          )}
          <a
            className={item.id === current ? 'current' : ''}
            href={baseURL + getPath(item.id, 'html')}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t(item.prefLabel).replace(highlight, str => `<strong>${str}</strong>`)
              }}
            />
          </a>
          {(item.narrower && item.narrower.length > 0) &&
            <NestedList
              items={item.narrower}
              current={current}
              baseURL={baseURL}
              filter={filter}
              highlight={highlight}
            />
          }
        </li>
      ))}
    </ul>
  )
}

export default NestedList
