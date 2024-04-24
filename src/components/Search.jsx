import React, { useState } from "react"
import { css } from "@emotion/react"
import GearIcon from "../icons/Gear"
import Modal from "./Modal"
import LabelFilter from "../components/LabelFilter"

const Search = ({ handleQueryInput, labels, onLabelClick }) => {
  const style = css`
    .search {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      input[type="text"] {
        width: 100%;
        padding: 10px;
        margin-right: 10px;
      }
      button {
        border: none;
        background: transparent;
        cursor: pointer;
      }
      dialog {
        button.close {
          background: lightgrey;
          border-width: 2px;
          border-radius: 10px;
          padding: 5px 15px;
          margin: 5px;
        }
      }
    }
  `
  const [modal, setModal] = useState(false)

  return (
    <div css={style}>
      <div className="search">
        <input
          id="searchInput"
          type="text"
          className="inputStyle"
          onChange={handleQueryInput}
          placeholder="Search"
          autoFocus
        />
        <button id="settings" onClick={() => setModal(true)}>
          <GearIcon />
        </button>
        <Modal
          openModal={modal}
          closeModal={() => setModal(false)}
          id="settingsModal"
        >
          <p>Which fields do you want to include in the search?</p>
          <LabelFilter labels={labels} toggleClick={onLabelClick} />
        </Modal>
      </div>
    </div>
  )
}

export default Search
