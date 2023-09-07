import { css } from "@emotion/react"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"

function UnderlinedText(props) {
  return <span style={{ textDecoration: "underline" }}>{props.children}</span>
}

const LabelFilter = ({ labels, toggleClick }) => {
  const { config } = getConfigAndConceptSchemes()
  const style = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px 30px;
    padding: 2px;

    .slider-wrapper {
      display: flex;
      align-items: center;
    }
    /* The switch - the box around the slider */
    .switch {
      position: relative;
      display: block;
      width: 2.5rem;
      height: 1.5rem;
      margin: 0 0.5rem 0 0;
    }

    /* Hide default HTML checkbox */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 1rem;
      width: 1rem;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    input:checked + .slider {
      background-color: ${config.colors.skoHubMiddleColor};
    }

    input:focus + .slider {
      box-shadow: 0 0 1px ${config.colors.skoHubMiddleColor};
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(1rem);
      -ms-transform: translateX(1rem);
      transform: translateX(1rem);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 1.5rem;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  `
  const handleClick = (e) => {
    toggleClick(e)
  }
  const labelBoxes = Object.entries(labels).map((label) => (
    <div className="slider-wrapper" key={label[0]}>
      <label className="switch" id={label[0] + "CheckBox"}>
        <input
          type="checkbox"
          checked={label[1]}
          onChange={() => handleClick(label[0])}
        />
        <span className="slider round"></span>
      </label>
      <UnderlinedText>{label[0][0]}</UnderlinedText>
      {label[0].slice(1)}
    </div>
  ))

  return <div css={style}>{labelBoxes}</div>
}

export default LabelFilter
