export default function getStyle (theme) {
  return {
    title: {
      paddingBottom: '10px',
      paddingTop: '10px',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 2,
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'space-between'
    },
    multiSections: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
    section: {
      flex: '1 1 0px',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '15px'
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
      fontWeight: 'normal'
    },
    tableTitle: {
      textTransform: 'uppercase'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      minWidth: '150px'
    },
    action: {
      cursor: 'pointer'
    },
    edgeResource: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: '5px'
    },
    erIconContainer: {
      backgroundColor: `var(--color, ${theme.colors.carbon})`,
      margin: '2px',
      padding: '4px',
      borderRadius: '4px',
      width: '38px',
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    erIcon: {
      fontSize: 22,
      color: 'white'
    }
  }
}
