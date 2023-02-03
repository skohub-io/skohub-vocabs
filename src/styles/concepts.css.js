import { css } from "@emotion/react"

import { colors as c } from "../styles/variables"

export const style = css`
  display: flex;
  height: 100%;

  @media only screen and (max-width: 800px) {
    display: block;
    flex-direction: column;
    height: auto;
  }

  a.current {
    color: ${c.skoHubMiddleGreen};
    font-weight: 700;
  }

  .block {
    background-color: ${c.skoHubWhite};
    box-shadow: 0px 10px 20px ${c.skoHubMiddleGrey};
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

    input[type="text"] {
      margin-bottom: 10px;
      width: 100%;
      padding: 10px;
    }

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

  .concept .content:not(:target) {
    display: none;
  }

  .concept .content:target ~ div {
    display: none;
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
      padding: 0 0 15px 0;
      font-size: 24px;
      line-height: 28px;
      font-weight: 700;

      @media only screen and (max-width: 800px) {
        font-size: 20px;
        line-height: 26px;
      }
    }

    a {
      color: ${c.skoHubAction};
      text-decoration: underline;

      &:hover {
        color: ${c.skoHubMiddleGreen};
      }
    }
  }

  .markdown {
    padding-top: 10px;
  }
`

export default style
