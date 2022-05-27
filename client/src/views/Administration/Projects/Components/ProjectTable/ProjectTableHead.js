// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { TableSortLabel } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';

// ==================== MUI Icons ====================

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
          }
    }));


// ================= Static Variables ================

    const headCellTitlesProject = [
        { id: 'projectName', numeric: false, disablePadding: true, label: 'Project Name' },
        { id: 'projectId', numeric: false, disablePadding: true, label: 'Project ID' },
        { id: 'memberList', numeric: true, disablePadding: false, label: 'Associated Members' },
        { id: 'collectionList', numeric: true, disablePadding: false, label: 'Associated Services' },
        { id: 'createdAt', numeric: true, disablePadding: false, label: 'Date Created' },
        { id: 'updatedAt', numeric: true, disablePadding: false, label: 'Date Last Modified' },
    ];

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const ProjectTableHead = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { userID, isTemplates, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

        const [headCells, setHeadCells] = useState(null);

        
    // Functions ===

        const createSortHandler = useCallback((property) => (event) => {
            onRequestSort(event, property);
        }, [ onRequestSort ]);

    // Hooks ===

    useEffect( () =>
        {
            setHeadCells(headCellTitlesProject);
            
        }, [ userID, isTemplates ]);

    // Render Section ===

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all' }}
                        />
                    </TableCell>
                    {headCells? ( 
                        headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'normal'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                                </TableSortLabel>
                            </TableCell>
                        ))
                    ) : ( 
                        null
                    )}
                </TableRow>
            </TableHead>
        );
}

// ======================== Component PropType Check ========================
ProjectTableHead.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    userID: PropTypes.string,
    isTemplates: PropTypes.bool.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}

ProjectTableHead.defaultProps = 
{
    userID: null,
    isTemplates: true,
    numSelected: {},
    onRequestSort: () => {},
    onSelectAllClick: () => {},
    order: {},
    orderBy: {},
    rowCount: {},
}

export default ProjectTableHead;  // You can even shorthand this line by adding this at the function [Component] declaration stage