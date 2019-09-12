/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { t, getPath } from '../common'

import { colors as c } from '../styles/variables'

const style = css`
  list-style-type: none;
  padding: 0;
  word-wrap: break-word;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    background-color: ${c.primary};
    width: 1px;
    left: -17px;
  }

  span > strong {
    display: inline-flex;
  }

  .treeItemIcon {
    display: inline-flex;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    font-weight: bold;
    position: relative;
    top: 4px;

    &:before {
      content: "";
      background-color: ${c.primary};
      position: absolute;
      width: 60%;
      height: 3px;
      left: 50%;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
    }

    &.collapsed {
      &:after {
        content: "";
        background-color: ${c.primary};
        position: absolute;
        width: 3px;
        height: 60%;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
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
            <button
              className={`treeItemIcon inputStyle${(filter || getNestedItems(item).some( id => id === current))
                ?  '' : ' collapsed'}`}
              onClick={(e) => {
                e.target.classList.toggle("collapsed")
              }}
            >
            </button>
          )}
          <a
            className={item.id === current ? 'current' : ''}
            href={baseURL + getPath(item.id, 'html')}
          >
            {item.notation &&
              <span>{item.notation.join(',')}&nbsp;</span>
            }
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
