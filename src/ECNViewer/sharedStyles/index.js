export default function getStyle (theme) {
  return {
    title: {
      paddingBottom: '15px',
      paddingTop: '15px',
      position: 'sticky',
      fontSize: '17px',
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
      fontWeight: '500',
      textTransform: 'uppercase'
    },
    subSection: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '15px'
    },
    text: {
      fontSize: '13px',
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
      direction: 'rtl',
      color: theme.colors.neutral_2,
      '& .MuiSvgIcon-root:hover': {
        color: theme.colors.carbon
      }
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
      fontSize: '14px',
      fontWeight: '500',
      color: theme.colors.neutral_3,
      borderTop: `1px solid ${theme.colors.neutral_2}`,
      borderBottom: `1px solid ${theme.colors.neutral_2}`,
      zIndex: 6,
      textTransform: 'uppercase'
    },
    tableCell: {
      fontSize: '16px',
      color: theme.colors.neutral
    },
    headerCell: {
      fontSize: '14px',
      fontWeight: '500',
      color: theme.colors.neutral_3
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: '#f4f5f6!important'
      }
    },
    cardTitle: {
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 6
    }
  }
}
