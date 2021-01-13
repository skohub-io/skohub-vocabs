/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { i18n, getFilePath, getFragment } from '../common'
import { Link } from "gatsby"

import { colors as c } from '../styles/variables'

const style = css`
  list-style-type: none;
  padding: 0;
  word-wrap: break-word;
  position: relative;

  li {
    display: flex;
    margin-bottom: 0;

    & a {
      display: block;
      padding-bottom: 10px;
    }

    > button + div {
      margin-bottom: 10px;
    }

    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    background-color: ${c.primary};
    width: 1px;
    left: -17px;
  }

  .notation {
    font-weight: bold;
  }

  span {
    word-break: normal;
  }

  span > strong {
    display: inline-flex;
    color: ${c.accent};
  }

  .treeItemIcon {
    display: inline-flex;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    font-weight: bold;
    position: relative;
    top: -1px;

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

      & + div > a + ul {
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

const NestedList = ({ items, current, filter, highlight, language }) => {
  const filteredItems = filter
    ? items.filter(item => !filter || filter.some(filter => getNestedItems(item).includes(filter)))
    : items
  const t = i18n(language)

  return (
    <ul css={style}>
      {(filteredItems || []).map(item => (
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
          <div>
            {getFragment(item.id) ? (
              <a
                className={item.id === current ? 'current' : ''}
                href={getFragment(item.id)}
              >
                {item.notation &&
                  <span className="notation">{item.notation.join(',')}&nbsp;</span>
                }
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight
                      ? t(item.prefLabel).replace(highlight, str => `<strong>${str}</strong>`)
                      : t(item.prefLabel)
                  }}
                />
              </a>
            ) : (
              <Link
                className={item.id === current ? 'current' : ''}
                to={getFilePath(item.id, `${language}.html`)}
              >
                {item.notation &&
                  <span className="notation">{item.notation.join(',')}&nbsp;</span>
                }
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight
                      ? t(item.prefLabel).replace(highlight, str => `<strong>${str}</strong>`)
                      : t(item.prefLabel)
                  }}
                />
              </Link>
            )}

            {(item.narrower && item.narrower.length > 0) &&
              <NestedList
                items={item.narrower}
                current={current}
                filter={filter}
                highlight={highlight}
                language={language}
              />
            }
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NestedList
