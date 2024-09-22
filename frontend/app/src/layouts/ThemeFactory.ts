import { createTheme } from "@mui/material";
import { frFR } from '@mui/material/locale';

export class ThemeFactory {
    createTheme() {
        return createTheme({
            palette: {
              //mode: 'dark',
              primary: {
                main: '#556b2f',
              },
              warning: {
                main: '#ff3333'
              }
            },
            typography: {
              h1: {
                fontFamily: 'Acme',
              },
              h2: {
                fontFamily: 'Acme',
              },
              h3: {
                fontFamily: 'Acme',
              },
              h4: {
                fontFamily: 'Acme',
              },
              h5: {
                fontFamily: 'Acme',
              },
              h6: {
                fontFamily: 'Acme',
              },
              subtitle1: {
                fontWeight: 'bold'
              }
            }
          }, frFR);
    }
}