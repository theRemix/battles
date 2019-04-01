import { createGlobalStyle } from "./styled-components";
import { media } from "./utils/breakpoint";
import theme from "./theme";
import fonts from "./fonts";

const GlobalStyles = createGlobalStyle`
  :root {
    font-size: 12px;
    overflow-x: hidden;
    background: #161719;
    background: ${theme.colors.darkBackground};

    ${media.small`
      font-size: 14px;
    `}
    ${media.large`
      font-size: 16px;
    `}
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    height: 100vh;
    color: ${theme.colors.text};
    font-family: ${theme.fonts.base};
    font-weight: 300;
    letter-spacing: 0.1px;
    overflow-x: hidden;
    padding-bottom: 3rem;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
  }

  ${fonts}
`;

export default GlobalStyles;
