import React, { useEffect } from "react"
import { css } from "@emotion/react"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { useSkoHubContext } from "../context/Context"

const style = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;

  input[type="button"] {
    flex: 1;
    padding: 5px 10px;
    min-width: 80px;
  }

  .sortControl {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 0.9em;

    select {
      padding: 4px 6px;
    }
  }
`

const TreeControls = ({ hasNesting = true }) => {
  const { config } = getConfigAndConceptSchemes()
  const { data, updateState } = useSkoHubContext()

  // Initialise sortBy from config on first render if it hasn't been set yet.
  useEffect(() => {
    if (data && data.sortBy == null) {
      updateState({ ...data, sortBy: config?.sortBy || "prefLabel" })
    }
  }, [data?.sortBy, config?.sortBy])

  const currentSort = data?.sortBy ?? config?.sortBy ?? "prefLabel"

  return (
    <div className="TreeControls" css={style}>
      {hasNesting && (
        <>
          <input
            type="button"
            className="inputStyle"
            value="Collapse"
            onClick={() => {
              ;[...document.querySelectorAll(".treeItemIcon")].forEach((el) => {
                el.classList.add("collapsed")
                el.setAttribute("aria-expanded", false)
              })
            }}
          />
          <input
            type="button"
            className="inputStyle"
            value="Expand"
            onClick={() => {
              ;[...document.querySelectorAll(".collapsed")].forEach((el) => {
                el.classList.remove("collapsed")
                el.setAttribute("aria-expanded", true)
              })
            }}
          />
        </>
      )}
      <label className="sortControl">
        Sort:
        <select
          aria-label="Sort entries by"
          value={currentSort}
          onChange={(e) =>
            updateState &&
            updateState({ ...(data || {}), sortBy: e.target.value })
          }
        >
          <option value="prefLabel">Label</option>
          <option value="notation">Notation</option>
          <option value="none">Source order</option>
        </select>
      </label>
    </div>
  )
}

export default TreeControls
