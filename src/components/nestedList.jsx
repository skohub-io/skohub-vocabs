import React, { useEffect, useState } from "react"
import { css } from "@emotion/react"
import { i18n, getFilePath, getFragment } from "../common"
import { Link as GatsbyLink } from "gatsby"

import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { useSkoHubContext } from "../context/Context"

const getNestedItems = (item) => {
  let ids = [item.id]
  if (item.narrower) {
    item.narrower.forEach((narrower) => {
      ids = ids.concat(getNestedItems(narrower))
    })
  }
  return ids
}

/**
 * Building the tree view for the vocabs
 * @param {Array} items - list of concepts
 * @param {string} current - current concept id
 * @param {Object|null} queryFilter
 * @param {string} queryFilter.field
 * @param {Array} queryFilter.result
 * @param {RegExp|null} highlight - RegExp of the search term
 * @param {string} language
 * @returns
 */
const NestedList = ({
  items,
  current,
  queryFilter,
  highlight,
  language,
  topLevel = false,
  customDomain,
}) => {
  const { config } = getConfigAndConceptSchemes()

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
      background-color: ${config.colors.skoHubMiddleGrey};
      width: 1px;
      left: -16px;
    }

    .notation {
      font-weight: bold;
    }

    span {
      word-break: normal;
    }

    span > strong {
      display: inline-flex;
      color: ${config.colors.skoHubDarkColor};
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
        background-color: ${config.colors.skoHubDarkColor};
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
          background-color: ${config.colors.skoHubDarkColor};
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
  const { data, _ } = useSkoHubContext()
  useEffect(() => {
    if (!language) {
      language = data.selectedLanguage
    }
  }, [data?.selectedLanguage])

  const filteredIds =
    queryFilter && queryFilter.length
      ? queryFilter.flatMap((f) => f.result)
      : []

  const getFilteredItems = () => {
    if (!queryFilter) {
      return items
    } else if (filteredIds.length) {
      return items.filter(
        (item) =>
          !queryFilter ||
          filteredIds.some((filter) => getNestedItems(item).includes(filter))
      )
    } else {
      return []
    }
  }

  const filteredItems = getFilteredItems()
  const t = i18n(language)

  const isExpanded = (item, truthy, falsy) => {
    return queryFilter || getNestedItems(item).some((id) => id === current)
      ? truthy
      : falsy
  }

  function associateLabelsByIds(queryFilter) {
    const labelsByIds = {}

    queryFilter &&
      queryFilter.forEach((item) => {
        item.result.forEach((id) => {
          if (!labelsByIds[id]) {
            labelsByIds[id] = []
          }
          if (item.field !== "prefLabel") labelsByIds[id].push(item.field)
        })
      })
    return labelsByIds
  }
  const labelsByIds = associateLabelsByIds(queryFilter)

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  const renderItemLink = (item) => {
    // checks if current item is a hash-uri */
    // Gatsby Link Component can't handle hash URIs so we use an anchor-tag instead
    const LinkTag = getFragment(item.id) ? "a" : GatsbyLink

    const notation = item.notation && (
      <span className="notation">{item.notation.join(",")}&nbsp;</span>
    )
    const renderPrefLabel = () => {
      // Function for handling highlighting
      function handleHighlight(text, highlight) {
        text = item.deprecated
          ? `<span style="color: ${config.colors.skoHubAction} ">(DEPRECATED)</span> ${text}`
          : text
        if (highlight) {
          return text.replace(highlight, (str) => `<strong>${str}</strong>`)
        } else {
          return text
        }
      }
      const matchingLabels = labelsByIds[item.id]

      const matchHint = () => {
        const hints = []
        const testLabelAndPush = (label, labelAttribute) => {
          if (highlight.test(label)) {
            hints.push(
              `${capitalize(labelAttribute)}: ${handleHighlight(
                label,
                highlight
              )}`
            )
          }
        }

        matchingLabels.forEach((labelAttribute) => {
          // for attributes that are languageMapsArrays, e.g. skos:altLabel
          if (Array.isArray(item[labelAttribute][language])) {
            item[labelAttribute][language].forEach((label) =>
              testLabelAndPush(label, labelAttribute)
            )
            // for attributes that are arrays, e.g. skos:notation
          } else if (Array.isArray(item[labelAttribute])) {
            item[labelAttribute].forEach((label) =>
              testLabelAndPush(label, labelAttribute)
            )
            // for attributes that are LanguageMaps, e.g. skos:definition
          } else {
            testLabelAndPush(item[labelAttribute][language], labelAttribute)
          }
        })
        return hints
      }
      matchingLabels && matchHint()
      // Function for rendering HTML
      function renderHtml(text) {
        // add info about other matching labels
        // if its not the prefLabel that matches
        return matchingLabels?.length ? (
          <>
            <span dangerouslySetInnerHTML={{ __html: text }} />
            <span> (</span>
            <span
              dangerouslySetInnerHTML={{ __html: matchHint().join(", ") }}
            />
            <span> )</span>
          </>
        ) : (
          <>
            <span dangerouslySetInnerHTML={{ __html: text }} />
          </>
        )
      }

      // give a warning if no prefLabel in selected language is provided
      if (!t(item.prefLabel)) {
        return (
          <i style={{ color: "red" }}>
            No label for language "{language}" provided
          </i>
        )
      } else {
        const htmlText = handleHighlight(t(item.prefLabel), highlight)
        return renderHtml(htmlText)
      }
    }
    const children = (
      <>
        {notation}
        {renderPrefLabel()}
      </>
    )
    const Link = React.createElement(
      LinkTag,
      {
        className: item.id === current ? "current" : "",
        "aria-current": item.id === current ? "true" : "false",
        ...(LinkTag === "a"
          ? { href: getFragment(item.id) }
          : { to: getFilePath(item.id, `html`, customDomain) }),
      },
      children
    )
    return Link
  }

  // only return nothing found for topLevel nestedList
  if (!filteredItems.length && topLevel) return <p>Nothing found!</p>

  return (
    <ul css={style}>
      {(filteredItems || []).map((item) => (
        <li key={item.id}>
          {item.narrower && item.narrower.length > 0 && (
            <button
              aria-expanded={isExpanded(item, "true", "false")}
              className={`treeItemIcon inputStyle${isExpanded(
                item,
                "",
                " collapsed"
              )}`}
              onClick={(e) => {
                e.target.classList.toggle("collapsed")
                e.target.setAttribute(
                  "aria-expanded",
                  e.target.classList.contains("collapsed") ? "false" : "true"
                )
              }}
            ></button>
          )}
          <div>
            {renderItemLink(item)}
            {item.narrower && item.narrower.length > 0 && (
              <NestedList
                items={item.narrower}
                current={current}
                queryFilter={queryFilter}
                highlight={highlight}
                language={language}
                customDomain={customDomain}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NestedList
