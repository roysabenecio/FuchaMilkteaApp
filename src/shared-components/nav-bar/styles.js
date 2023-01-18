import { default as color } from '../../util/color-palette';

const gray = color.sidebarColor;
const white = color.whiteBgColor;

export default {
  drawer: {
    width: 250,
    '& .MuiDrawer-paper': {
      width: 230,
      boxSizing: '',
      backgroundColor: gray,
      color: 'rgba(255,255,255, 0.7)',
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15
    },
    '& .MuiList-root': {
      p: 2
    },
    '& .MuiButtonBase-root': {
      borderRadius: '10px',
    }
  },
  logoBox: {
    textAlign: 'center',
  },
  logoImg: {
    width: 80,
    height: 70,
    mt: 4,
    mb: 2
  },
  icons: {
    color: white
  },
  selected: {
    '&& .Mui-selected': {
      backgroundColor: 'rgba(255, 255, 255, .100)'
    },
    '& .MuiListItemButton-root:hover': {
      backgroundColor: 'rgba(255, 255, 255, .100)'
    }
  }
};