export default function getStyle (theme) {
  return {
    title: {
      paddingBottom: '15px',
      paddingTop: '15px',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 2,
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'space-between',
      height: '54px',
      alignItems: 'center'
    },
    multiSections: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
    section: {
      flex: '1 1 0px',
      display: 'flex',
      flexDirection: 'column'
    },
    subTitle: {
      fontSize: '14px',
      fontWeight: 'bold'
    },
    subSection: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '5px'
    },
    text: {
      fontSize: '14px',
      fontWeight: 'normal',
      whiteSpace: 'pre-line'
    },
    tableTitle: {
      textTransform: 'uppercase'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      minWidth: '150px',
      direction: 'rtl'
    },
    action: {
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    disabledAction: {
      opacity: 0.4
    },
    edgeResource: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: '5px'
    },
    erIconContainer: {
      backgroundColor: `var(--color, ${theme.colors.carbon})`,
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    erIcon: {
      fontSize: 22,
      color: theme.colors.carbon
    },
    link: {
      color: theme.colors.carbon
    },
    stickyHeaderCell: {
      backgroundColor: 'white',
      paddingTop: '5px',
      paddingBottom: '5px',
      borderTop: `1px solid ${theme.colors.carbon}`,
      borderBottom: `1px solid ${theme.colors.carbon}`,
      textTransform: 'uppercase'
    }
  }
}
