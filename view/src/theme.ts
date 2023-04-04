import type { Theme } from 'theme-ui'

export const theme: Theme = {
  fonts: {
    body: '"Avenir Next", sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#33e',
  },
  buttons: {
    primary: {
      cursor: 'pointer',
    },
  },
  text: {
    heading: {
      paddingBottom: '10px',
    },
  },

  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
  },
}
