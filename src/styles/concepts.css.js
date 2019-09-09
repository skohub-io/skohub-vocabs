import { css } from '@emotion/core'

export const style = css`
  display: flex;
  overflow: hidden;
  height: 100%;

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
    display: flex;
    flex-direction: column;
    overflow: hidden;

    input[type=text] {
      width: 100%;
      border: none;
      border-left: none;
      border-right: none;
      padding: 10px 20px;
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
    overflow: auto;
  }

  .markdown {
    padding-top: 10px;
  }
`

export default style