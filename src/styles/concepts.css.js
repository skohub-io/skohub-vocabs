import { css } from '@emotion/core'

export const style = css`
  display: flex;
  max-height: 100vh;
  font-size: 16px;
  font-family: futura-pt,sans-serif,sans-serif;
  color: hsl(0, 0%, 24%);

  a {
    text-decoration: none;
    color: hsl(0, 0%, 24%);
  }

  a.current {
    color: tomato;
    font-weight: bold;
  }

  .btn {
    background-color: hsl(0, 0%, 24%);
    color: white;
    border: none;
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: hsl(0, 0%, 40%);
    }
  }

  & > nav {
    flex: 1;
    border-right: 1px solid black;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    input[type=text] {
      width: 100%;
      border: 1px solid black;
      border-left: none;
      border-right: none;
      padding: 5px 10px;
    }

    & > ul {
      overflow: auto;
      margin: 0;
      padding: 10px;
      height: 100%;
    }

    & > ul:before {
      content: none;
    }
  }

  .content {
    padding: 20px;
    flex: 3;
  }

  .markdown {
    padding-top: 10px;
  }
`

export default style