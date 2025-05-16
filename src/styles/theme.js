import { darken, lighten } from 'polished';

const primaryColor = 'rgb(19, 152, 185)';

const theme = {
    colors: {
        primary: primaryColor,
        primaryDark: darken(0.15, primaryColor),     
        primaryDarkTwo: darken(0.3, primaryColor),
        primaryTransparent2: lighten(0.5, primaryColor),

        background: 'rgba(19, 152, 185, 0.66)',
        text: 'rgb(252, 252, 252)',        
        inputBg: '#121212',  
        inputBorder: darken(0.1, primaryColor),
        placeholder: '#AAAAAA', 
        linkPlaceholder: '#FFFFFF',

        disabledBg: '#1F1F1F',  
        disabledBorder: '#333333',
        disabledText: '#777777',
    },
};

export default theme;
