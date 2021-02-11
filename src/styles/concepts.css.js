import { css } from '@emotion/core'

import { colors as c } from '../styles/variables'

export const style = css`
  display: flex;
  overflow: hidden;
  height: 100%;

  a.current {
    color: ${c.accentDark};
    font-weight: bold;
  }

  & > nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    input[type=text] {
      margin-bottom: 10px;
      width: 100%;
      padding: 10px;
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

  .concept .content:not(:target) {
    display: none ;
  }

  .concept .content:target ~ div {
    display: none ;
  }

  .content {
    position: relative ;
    padding: 20px;
    flex: 2;
    overflow: auto;
    margin-left: 20px;

    button {
      padding: 10px 20px;
    }

    .json-png {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    > h1 {
      margin: 0;
    }

    a {
      color: blue;
      text-decoration: underline;

      &:visited {
        color: purple;
      }
    }
  }

  .markdown {
    padding-top: 10px;
  }
`

export default style
