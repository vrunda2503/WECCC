// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';                // Used for link navigation to other areas on the website
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down
import clsx from 'clsx';                                // Constructing className strings conditionally. Used for render logic

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { lighten } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

// ==================== MUI Icons ====================
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import FilterListIcon from '@material-ui/icons/FilterList';

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
          },
          highlight:
            theme.palette.type === 'light'
              ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
              : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark,
                },
          title: {
            flex: '1 1 100%',
          }
    }));


// ================= Static Variables ================
const viewCollectionBaseLinkAdministration = "/administration/collections/";
const viewCollectionBaseLinkStaff = "/staff/collections/";
const viewCollectionBaseLinkClient = "/client/collections/";

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const CollectionTableToolbar = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, selectedDataItemsList, setParentDeleteCollectionDialog, setParentExportCollectionDialog} = props;
        
        const [viewUrl, setViewUrl] = useState("");
        const [editUrl, setEditUrl] = useState("");

        const [toolNone, setToolNone] = useState(false);
        const [toolOne, setToolOne] = useState(false);
        const [toolMultiple, setToolMultiple] = useState(false);

    // Functions ===
    
        const toolHandler = useCallback(() => {
            if(selectedDataItemsList.length === 0) {
                setToolNone(true);
                setToolOne(false);
                setToolMultiple(false);
            }
            else if(selectedDataItemsList.length === 1) {
                setToolNone(false);
                setToolOne(true);
                setToolMultiple(false);
            }
            else if(selectedDataItemsList.length > 1) {
                setToolNone(false);
                setToolOne(false);
                setToolMultiple(true);
            }
        }, [ selectedDataItemsList, setToolNone, setToolOne, setToolMultiple]);
    

        const deleteHandler = useCallback(() => {
            setParentDeleteCollectionDialog(true);
        }, [ setParentDeleteCollectionDialog ]);

        const exportHandler = useCallback(() => {
            setParentExportCollectionDialog(true);
        }, [ setParentExportCollectionDialog ]);
        

    // Hooks ===

        useEffect( () =>
        {
            toolHandler();  
        }, [ selectedDataItemsList, toolHandler ]);

        useEffect( () => {
            
            if(toolNone || toolMultiple)
            {
                setViewUrl("");
            }
            else if(toolOne)
            {
                if(appState.role === "Admin")
                {
                    setViewUrl(viewCollectionBaseLinkAdministration + "view/" + selectedDataItemsList[0]._id);
                }
                else if(appState.role === "Coordinator" || appState.role === "Volunteer")
                {
                    setViewUrl(viewCollectionBaseLinkStaff + "view/" + selectedDataItemsList[0]._id);
                }
                else
                {
                    setViewUrl(viewCollectionBaseLinkClient + "view/" + selectedDataItemsList[0]._id);
                }

                
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [toolNone, toolOne, toolMultiple ]);

    // Render Section ===

        return (
            <Toolbar
                className={clsx(classes.root, { [classes.highlight]: selectedDataItemsList.length > 0 } )}
            >
                {selectedDataItemsList.length > 0 ? (
                    <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                        {selectedDataItemsList.length} Selected Item{selectedDataItemsList.length > 1 ? "s" : null}
                    </Typography>
                ) : (
                    <Typography className={classes.title} variant="h6" component="div">
                        {"Collection Results"}
                    </Typography>
                )}

                {toolNone ? (
                    <>
                        <Tooltip title="Filter list">
                            <IconButton aria-label="filter list">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (null)}
                
                {toolOne? (
                    <>
                        <Tooltip title="View">
                            <IconButton aria-label="view" component={Link} to={viewUrl} >
                                <VisibilityIcon/>
                            </IconButton>
                        </Tooltip>
                            
                        {/* <Tooltip title="Edit">
                            <IconButton aria-label="edit" component={Link} to={editUrl} >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip> */}
                            
                        <Tooltip title="Export" onClick={() => exportHandler()}>
                            <IconButton aria-label="export">
                                <SystemUpdateAltIcon/>
                            </IconButton>
                        </Tooltip>
                            
                        <Tooltip title="Delete">
                            <IconButton aria-label="delete" onClick={() => deleteHandler()}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (null)}
                {toolMultiple ? (
                    <>
                        {/* <Tooltip title="Export">
                            <IconButton aria-label="export" onClick={() => exportHandler()}>
                                <SystemUpdateAltIcon/>
                            </IconButton>
                        </Tooltip> */}

                        <Tooltip title="Delete">
                            <IconButton aria-label="delete" onClick={() => deleteHandler()}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (null)}
            </Toolbar>
        );
}

// ======================== Component PropType Check ========================
CollectionTableToolbar.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    selectedDataItemsList: PropTypes.array.isRequired,
    setParentDeleteCollectionDialog: PropTypes.func.isRequired,
    setParentExportCollectionDialog: PropTypes.func.isRequired
}

CollectionTableToolbar.defaultProps = 
{
    appState: {},
    selectedDataItemsList: {},
    setParentDeleteCollectionDialog: () => {},
    setParentExportCollectionDialog: () => {}
}

export default CollectionTableToolbar;  // You can even shorthand this line by adding this at the function [Component] declaration stage