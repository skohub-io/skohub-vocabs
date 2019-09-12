import { css } from '@emotion/core'

import { colors as c } from '../styles/variables'

export const style = css`
  display: flex;
  overflow: hidden;
  height: 100%;

  a.current {
    color: ${c.accent};
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

  .content {
    padding: 20px;
    flex: 3;
    overflow: auto;
    margin-left: 20px;

    button {
      padding: 10px 20px;
    }

    > h1 {
      margin: 0;
    }
  }

  .markdown {
    padding-top: 10px;
  }
`

export default style