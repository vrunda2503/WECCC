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

    const headCellTitlesCollectionTemplate = [ //This is a user specified array is used to populate the table header cells. Notice the Template Specifications
        { id: 'collectionName', numeric: false, disablePadding: true, label: 'Service Name' },
        { id: 'collectionId', numeric: false, disablePadding: true, label: 'Service ID' },
        { id: 'numProjects', numeric: true, disablePadding: false, label: '# of Associated Projects' },
        { id: 'numMembers', numeric: true, disablePadding: false, label: '# of Associated Members' },
        { id: 'numSurveyTemplates', numeric: true, disablePadding: false, label: '# of Chapter Templates' },
        { id: 'numMemberSurveys', numeric: true, disablePadding: false, label: '# of Instances' },
        { id: 'createdAt', numeric: true, disablePadding: false, label: 'Date Created' },
        { id: 'updatedAt', numeric: true, disablePadding: false, label: 'Date Last Modified' },
    ];

    const headCellTitlesMemberCollection = [
        { id: 'collectionName', numeric: false, disablePadding: true, label: 'Service Name' },
        { id: 'collectionId', numeric: false, disablePadding: true, label: 'Service ID' },
        { id: 'completeness', numeric: false, disablePadding: true, label: 'Completeness' },
        { id: 'clientName', numeric: false, disablePadding: true, label: 'Client Name' },
        { id: 'clientId', numeric: false, disablePadding: true, label: 'Client ID' },
        { id: 'numMemberSurveys', numeric: true, disablePadding: false, label: '# of Member Chapters' },
        { id: 'createdAt', numeric: true, disablePadding: false, label: 'Date Created' },
        { id: 'updatedAt', numeric: true, disablePadding: false, label: 'Date Last Modified' },
    ];

    const headCellTitlesMemberCollectionClient = [
        { id: 'collectionName', numeric: false, disablePadding: true, label: 'Service Name' },
        { id: 'collectionId', numeric: false, disablePadding: true, label: 'Service ID' },
        { id: 'completeness', numeric: false, disablePadding: true, label: 'Completeness' },
        { id: 'createdAt', numeric: true, disablePadding: false, label: 'Date Created' },
        { id: 'updatedAt', numeric: true, disablePadding: false, label: 'Date Last Modified' },
    ];

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const CollectionTableHead = (props) => { // Notice the arrow function... regular function()  works too

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
            if(userID)
            {
                setHeadCells(headCellTitlesMemberCollectionClient);
            }
            else
            {
                if(isTemplates)
                {
                    setHeadCells(headCellTitlesCollectionTemplate);
                }
                else 
                {
                    setHeadCells(headCellTitlesMemberCollection);
                }
            }
            
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
CollectionTableHead.propTypes = 
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

CollectionTableHead.defaultProps = 
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

export default CollectionTableHead;  // You can even shorthand this line by adding this at the function [Component] declaration stage