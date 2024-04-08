import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";

const drawerWidth = 200;

const useMyStyles = makeStyles(theme => ({
    all: {
        width: "90%",
    },
    container: {
        backgroundColor: "#fafafa"
    },
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },

    rootNoCenter: {
        padding: theme.spacing(2),
    },

    noMargin: {
        marginLeft: "0px!important",
        marginRight: "0px!important"
    },

    cardsResults: {
        textAlign: "center",
    },

    headerCard:{
        textAlign: "left",
    },

    circularProgress: {
        margin: "auto",
        width: "100%"
    },
    neededField: {
        '& label': 
        {
            color: "#00926c"
        }
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    error: {
        backgroundColor: theme.palette.error.main,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    card: {
        maxWidth: "60%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9

    },
    flex: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        height: "85px",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "center",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        overflowX: "hidden",
        
    },
    drawerCategoryBorder: {
        border: "1px solid #c4c4c4",
    },

    drawerWidth: {
        width: "300px"
    },

    drawerWidthClose: {
        width: "84px"
    },


    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
            display: 'none',

        },
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: "85px",
        [theme.breakpoints.up('sm')]: {
            width: "85px",
        },
        "&::-webkit-scrollbar": {
            display: 'none',

        },

    },

    drawerListText: {
        fontWeight: "500", 
        fontSize: "14px"
    },

    drawerListHeadingCenter: {
        textAlign: "center"
    },

    drawerListHeadingLeft: {
        textAlign: "left"
    },


    drawerListIcon: {
        width: "24px", 
        height: "24px"
    },
    
    drawerListNested: {
        paddingLeft: theme.spacing(4),
    },

    drawerListIcons: {
        height: "30px",
        width: "30px"
    },
    toolbar: {
        height: "70px",
        paddingBottom: "10px",
    },
    content: {
        flexGrow: 1,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: "50px",
        backgroundColor: "#fafafa",
        minHeight: "97vh"
    },
    logoLeft: {
        cursor: "pointer",
        marginRight: theme.spacing(1),
        maxHeight: "60px",
    },
    logoRight: {
        cursor: "pointer",
        marginLeft: theme.spacing(1),
        maxHeight: "70px",
    },
    selectedApp: {
        color: theme.palette.primary.main,
    },
    unSelectedApp: {},
    fab: {
        margin: theme.spacing(1),
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    iconRoot: {
        textAlign: 'center',
        MaxHeight: "10px"
    },
    popUp: {
        width: "300px",
        padding: theme.spacing(1, 2),
        textAlign: "center",
    },
    grow: {
        flexGrow: 1,
    },
    TableHead: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    buttonOk: {
        color: theme.palette.primary.main,
    },
    buttonError: {
        color: theme.palette.error.main,
    },
    buttonWarning: {
        color: theme.palette.secondary.main,
    },
    imageIcon: {
        height: 'auto',
        width: '100%',
        maxWidth: "60px",
    },
    textPaper: {
        elevation: 4,
        padding: theme.spacing(1, 2),
        textAlign: "left",
    },
    footer: {
        padding: theme.spacing(10, 5),
        textAlign: "center",
        bottom: 0,
    },
    feedback: {
        position: 'fixed',
        bottom: theme.spacing(2),
        left: theme.spacing(2),
        zIndex: theme.zIndex.drawer + 1,
    },
    listRoot: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    listItem: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    formControl: {
        minWidth: 200,
        width:"100%"
    },
    histogram: {
        width: "100%",
        height: "100%"
    },
    twitterSnaResult: {
        marginTop: 20,
        textAlign: "center",
    },
    closeResult: {
        cursor: "pointer",
        marginRight: "-10px",
        marginTop: "-20px",
        textAlign: "right",
    },
    iconRootDrawer: {
        textAlign: "center",
        overflow: "visible"
    },
    imageIconDrawer: {
        width: "auto",
        height: "100%",
    },

    imageIconTab: {
        height: "auto",
        width: "100%"
    },
    iconRootTab: {
        overflow: "visible",
        textAlign: "center",
        fontSize: "2.25rem"
    },
    imageIconAllTools: {
        maxWidth: "300px",
        height: "auto",
        width: "100px",
    },
    text: {
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    gridList: {
        width: "100%",
        maxHeight: "500px",
    },
    imagesRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: theme.spacing(1),
    },
    image: {
        height: "auto",
        width: "auto",
        maxWidth: "300px",
        maxHeight: "300px"
    },
    onClickInfo: {
        borderColor: "grey",
        borderRadius: '10px',
        borderStyle: "solid",
        borderWidth: "2px",
        paddingTop: "10px",
        paddingBottom: "10px"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "#151515",
        width: window.innerWidth * 0.9,
    },
    modalButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    AboutMedia: {
        height: "auto",
        width: "auto",
        maxWidth: "60%",
    },
    InteractiveMedia: {
        maxWidth: "80%",
        maxHeight: window.innerHeight / 2,
    },
    customTitle: {
        textAlign: "center",
        color: "#596977",
        fontSize: 28,
        fontWeight: "bold",
        padding: '15px',
        width: "auto",
        margin: 5,
        display: "block",
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    lightBox: {
        overlay: {
            zIndex: theme.zIndex.drawer + 1,
        },
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    tab: {
        [theme.breakpoints.up('sm')]: {
            fontSize: "10px",
            minWidth: 100,
            color: "#4c4c4c"
        },
    },
    customAllToolsButton: {
        padding: 0,
        minHeight:0,
        minWidth: 0,
        backgroundColor: 'transparent',
        fontSize: 40
    },
    customAllToolsIconDeselected: {
        fontSize: "inherit",
        color: "#9A9A9A"
    },
    customAllToolsIconSelected: {
        fontSize: "inherit",
        color: theme.palette.primary.main
    },
    
    toolTipIcon: {
        color: theme.palette.secondary,
        position: "relative",
        opacity: 0.7,
        top: theme.spacing(1),
        width: theme.typography.h5.fontSize,
        height: theme.typography.h5.fontSize,
        marginRight: 3,
        marginLeft: 5
    },
    svgIcon: {
        fill: theme.palette.primary,
        position: "relative",
        top: theme.spacing(1),
        width: theme.typography.h3.fontSize,
        height: theme.typography.h3.fontSize,
        marginRight: 7,
        marginLeft: 5,
    },
    toolTipWarning: {
        color: "red",
        position: "relative",
        top: theme.spacing(1),
        width: theme.typography.h5.fontSize,
        height: theme.typography.h5.fontSize,
        marginRight: 3,
        marginLeft: 5
    },
    customAllToolsButton: {
        padding: 0,
        minHeight:0,
        minWidth: 0,
        backgroundColor: 'transparent',
        fontSize: 40
    },
    customAllToolsIconDeselected: {
        fontSize: "inherit",
        color: "#9A9A9A"
    },
    customAllToolsIconSelected: {
        fontSize: "inherit",
        color: theme.palette.primary.main
    },

    
    height100: {
        height: "100%",
    },

    root2: {
        textAlign: "center",
        padding: theme.spacing(3),

    },

    toolCardStyle: {
        width: "25%", 
        maxWidth: "350px", 
        minWidth: "250px",
    },

    dialogTitleWithButton: {
        display: "flex",
        justifyContent: "space - between",
        alignItems: "center",
    },

    bigButtonDiv: {
        border: 'solid #E1E1E1 2px',
        borderRadius: "25px",
        cursor: "pointer",

        "&:hover": {
            border: 'solid #51A5B2 2px',

        },
    },


    bigButtonDivSelectted: {
        border: 'solid #51A5B2 3px',
        borderRadius: "25px",
    },

    bigButtonIcon: {

        fontSize: "large",
        color: "#9A9A9A",

    },

    bigButtonIconSelectted: {

        height: "50px",
        width: "auto",
        color: "#51A5B2"

    },

    buttonTableURL:{
        backgroundColor:"#51A5B2!important"
    },

    feedbackButtonTitleHide: {
        display: "none",
    },

    feedbackButtonTitleShow: {
        marginLeft: "12px",
        display: "block",
    },

    fabTop: {
        margin: "0px",
        top: "auto",
        right: "14px",
        bottom: "100px",
        left: "auto",
        position: "fixed",
    },

    feedbackHeaderTitle: {
        marginLeft: "12px",
    },


    

}));
export const myCardStyles = makeStyles({
    root: {
        overflow: "hidden",
    }
});
export default useMyStyles;

