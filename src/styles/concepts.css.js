import { css } from "@emotion/react"

export const conceptStyle = (colors) => css`
  display: flex;
  height: 100%;

  @media only screen and (max-width: 800px) {
    display: block;
    flex-direction: column;
    height: auto;
  }

  a.current {
    color: ${colors.skoHubMiddleColor};
    font-weight: 700;
  }

  .block {
    background-color: ${colors.skoHubWhite};
    box-shadow: 0px 10px 20px ${colors.skoHubMiddleGrey};
    padding: 30px;
    border-radius: 30px;

    @media only screen and (max-width: 1024px) {
      padding: 15px;
    }
  }

  .concepts {
    overflow: auto;
  }

  .nav-block {
    flex: 1;

    @media only screen and (max-width: 800px) {
      display: block;
      height: 45vh;
      padding: 15px 15px 30px 15px;
      width: 100%;
    }
  }

  .main-block {
    flex: 2;

    @media only screen and (max-width: 800px) {
      display: block;
      width: 100%;
    }
  }

  & > nav {
    display: flex;
    flex-direction: column;
    overflow: auto;

    & > ul {
      overflow: auto;
      margin: 0;
      padding: 10px;
      height: 100%;

      @media only screen and (max-width: 800px) {
        overflow: visible;
        height: auto;
      }
    }

    & > ul:before {
      content: none;
    }
  }

  .content {
    position: relative;
    overflow: auto;
    margin-left: 20px;

    @media only screen and (max-width: 800px) {
      margin: 20px 0 0 0;
    }

    button {
      padding: 10px 20px;
    }

    .json-png {
      position: absolute;
      right: 30px;
      top: 30px;

      @media only screen and (max-width: 1024px) {
        position: relative;
        left: 0;
        right: 0;
        top: 0;
      }
    }

    h1 {
      margin: 0;
      padding: 0 0 15px 0;
      font-size: 30px;
      line-height: 32px;
      font-weight: 700;

      @media only screen and (max-width: 800px) {
        font-size: 24px;
        line-height: 26px;
      }
    }

    h2 {
      margin: 0;
      padding: 0 0 0 0;
      font-size: 24px;
      line-height: 28px;
      font-weight: 700;

      @media only screen and (max-width: 800px) {
        font-size: 20px;
        line-height: 26px;
      }
    }

    a {
      color: ${colors.skoHubAction};
      text-decoration: underline;

      &:hover {
        color: ${colors.skoHubMiddleColor};
      }
    }
  }

  .markdown {
    padding-top: 10px;
  }

  .conceptURI {
    display: flex;
    flex-direction: row;
    align-items: center;

    button {
      border: 2px solid transparent;
      border-radius: 5px;
      padding: 5px;
      margin: 5px;
      background-color: transparent;
      cursor: pointer;
    }
    button:hover {
      border: 2px solid ${colors.skoHubMiddleColor};
    }
  }
  /* Tooltip container */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text */
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;

    /* Fade in tooltip */
    opacity: 0;
    transition: opacity 0.3s;
  }

  /* Tooltip arrow */
  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
`

export default conceptStyle
