// ================================================
// Code associated with Templates Table Component.
// Displays all existing Templates created and allows
// user to delete, edit and preview the Templates
// survey questions.
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// ===================== Components ======================
import CollectionTableHead from './CollectionTableHead';
import CollectionTableToolbar from './CollectionTableToolbar';

// ==================== Helpers ====================

// ==================== MUI ====================
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { makeStyles } from '@material-ui/core/styles';
// ==================== Icons ====================

// ==================== Static Helper Functions ====================

    const descendingComparator = (a, b, orderBy) => {    // Establishing the result of a comparison between two objects in an array
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
    }

    const getComparator = (order, orderBy) => {            // Deciding asc or desc comparison, notice the negative version of the funcion above

    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const stableSort = (array, comparator) => {

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
    }

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        tableRow: {
            cursor: "pointer"
        }
    }));

// ==================== Static Variables ====================

//=================================================== TemplateTable Component ===================================================
export default function CollectionTable(props) {

  // Variables ===

         // Style variable declaration
        const classes = useStyles();

        const { appState, isDense, isTemplates, userID, searchFilteredDataList, setParentDeleteCollectionDialog, setParentExportCollectionDialog,
            selectedDataItemsList, setSelectedDataItemsList } = props;

        // Responsive Table variables
        const [order, setOrder] = useState('asc');
        const [orderBy, setOrderBy] = useState('collectionId');
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(20);

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, searchFilteredDataList.length - page * rowsPerPage);


    // Functions ===

        const handleRequestSort = useCallback((event, property) => {

            // console.log(property);

            let isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);

        }, [ order, setOrder, orderBy, setOrderBy ]);

        const handleSelectAllClick = useCallback((event) => {

            if (event.target.checked) {

                let newSelecteds = []
                
                searchFilteredDataList.forEach(elem => 
                {
                    newSelecteds.push(elem);
                });
                
                setSelectedDataItemsList(newSelecteds);
                
                return;

            }

            setSelectedDataItemsList([]);
        }, [ searchFilteredDataList, setSelectedDataItemsList ]);

        const handleClick = useCallback((event, item) => {
            
            let previousSelectedIds = selectedDataItemsList.map(elem => elem._id);
            let selectedIndex = previousSelectedIds.indexOf(item._id);
            let newSelected = [];

            if (selectedIndex === -1)
            {
                newSelected = newSelected.concat(selectedDataItemsList, item);
            }
            else if (selectedIndex === 0)
            {
                newSelected = newSelected.concat(selectedDataItemsList.slice(1));
            }
            else if (selectedIndex === selectedDataItemsList.length - 1)
            {
                newSelected = newSelected.concat(selectedDataItemsList.slice(0, -1));
            }
            else if (selectedIndex > 0)
            {
                newSelected = newSelected.concat(
                    selectedDataItemsList.slice(0, selectedIndex),
                    selectedDataItemsList.slice(selectedIndex + 1),
                );
            }

            setSelectedDataItemsList(newSelected);
        }, [ selectedDataItemsList, setSelectedDataItemsList ]);

        const isSelected = useCallback((item) => {

            let previousSelectedIds = selectedDataItemsList.map(elem => elem._id);
            return previousSelectedIds.indexOf(item._id) !== -1;

        }, [ selectedDataItemsList ]);
        
        const handleChangePage = useCallback((newPage) => {

            setPage(newPage);

        }, [ setPage ]);

        const handleChangeRowsPerPage = useCallback((event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        }, [ setRowsPerPage, setPage]);

    // Hooks ===

        useEffect( () =>
        {
            setPage(0);
        }, [ searchFilteredDataList ]);

    // Render Section ===
    return (

        <div className={classes.root}>
        
            <Box mx={1} my={1}>
                <Paper className={classes.paper}>
                    <CollectionTableToolbar
                        appState={appState}
                        isTemplates={isTemplates}
                        selectedDataItemsList={selectedDataItemsList} 
                        setParentDeleteCollectionDialog={setParentDeleteCollectionDialog} 
                        setParentExportCollectionDialog={setParentExportCollectionDialog}
                    />
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={isDense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <CollectionTableHead
                                userID={userID}
                                numSelected={selectedDataItemsList.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={searchFilteredDataList.length}
                                isTemplates={isTemplates}
                            />

                            <TableBody>
                                {stableSort(searchFilteredDataList, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => {
                                    const isItemSelected = isSelected(item);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    
                                    return (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            onClick={(event) => handleClick(event, item)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={`row${index}-${item._id}`}
                                            selected={isItemSelected}

                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>

                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                <Typography color="textPrimary" variant="subtitle2" noWrap style={{display: 'inline-block', width: '240px'}}>
                                                    {isTemplates? item.name : item.collectionTemplate? item.collectionTemplate.name : ""}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="left" padding="none">
                                                <Typography color="secondary" variant="body2" noWrap style={{display: 'inline-block', width: '120px'}}>
                                                    {item._id}
                                                </Typography>
                                            </TableCell>

                                            {(isTemplates && item.projectList && item.memberList && item.memberCollectionList && item.surveyList)? (
                                                <>
                                                    <TableCell align="right" padding="normal">
                                                        <Tooltip title={
                                                            <>
                                                                <Typography color="inherit">Projects</Typography>
                                                                <ol>
                                                                    {item.projectList.map((subItem, index) => {
                                                                        return (
                                                                            <li key={`subrow${index}-${subItem._id}`}>
                                                                                {subItem.name}
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ol>
                                                                <em>{"Projects apart of this"}</em> <b>{'Service Template'}</b>.{' '}
                                                            </>
                                                        } placement="top">
                                                            <Button>
                                                                <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                                    {item.projectList.length}
                                                                </Typography>
                                                            </Button>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell align="right" padding="normal">
                                                        <Tooltip title={
                                                            <>
                                                                <Typography color="inherit">Members</Typography>
                                                                {/* <ol>
                                                                    {item.projectList.map((subItem, index) => {
                                                                        return (
                                                                            <li key={`subrow${index}-${subItem._id}`}>
                                                                                {subItem._id}
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ol> */}
                                                                <em>{"Members apart of this"}</em> <b>{'Service Template'}</b>.{' '}
                                                            </>
                                                        } placement="top">
                                                            <Button>
                                                                <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                                    {item.memberList.length}
                                                                </Typography>
                                                            </Button>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell align="right" padding="normal">
                                                        <Tooltip title={
                                                            <>
                                                                <Typography color="inherit">Survey Templates</Typography>
                                                                <ol>
                                                                    {item.surveyList.map((subItem, index) => {
                                                                        return (
                                                                            <li key={`subrow${index}-${subItem._id}`}>
                                                                                {subItem.name}
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ol>
                                                                <em>{"Survey Templates apart of this"}</em> <b>{'Service Template'}</b>.{' '}
                                                            </>
                                                        } placement="top">
                                                            <Button>
                                                                <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                                    {item.surveyList.length}
                                                                </Typography>
                                                            </Button>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell align="right" padding="normal">
                                                        <Tooltip title={
                                                            <>
                                                                <Typography color="inherit">Member Service Instances</Typography>
                                                                {/* <ol>
                                                                    {item.projectList.map((subItem, index) => {
                                                                        return (
                                                                            <li key={`subrow${index}-${subItem._id}`}>
                                                                                {subItem._id}
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ol> */}
                                                                <em>{"Member Collections apart of this"}</em> <b>{'Service Template'}</b>.{' '}
                                                            </>
                                                        } placement="top">
                                                            <Button>
                                                                <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                                    {item.memberCollectionList.length}
                                                                </Typography>
                                                            </Button>
                                                        </Tooltip>
                                                    </TableCell>
                                                    
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell align="left" padding="none">
                                                        <Typography color="primary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                            {item.completeness}
                                                        </Typography>
                                                    </TableCell>

                                                    {userID? (
                                                        <>
                                                        </>
                                                    ) : 
                                                        item.member? (
                                                            <>
                                                                <TableCell align="left" padding="none">
                                                                    <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                                        {item.member.info.name}
                                                                    </Typography>
                                                                </TableCell>

                                                                <TableCell align="left" padding="none">
                                                                    <Typography color="textPrimary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                                        {item.member._id}
                                                                    </Typography>
                                                                </TableCell>

                                                                <TableCell align="right" padding="normal">
                                                                    <Tooltip title={
                                                                        <>
                                                                            <Typography color="inherit">Member Chapters</Typography>
                                                                            <ol>
                                                                                {item.memberSurveyList.map((subItem, index) => {
                                                                                    return (
                                                                                        <li key={`subrow${index}-${subItem._id}`}>
                                                                                            {subItem.name}
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ol>
                                                                            <em>{"Member Chapters instantiated in this"}</em> <b>{'Member Collection'}</b>.{' '}
                                                                        </>
                                                                    } placement="top">
                                                                        <Button>
                                                                            <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                                                {item.memberSurveyList.length}
                                                                            </Typography>
                                                                        </Button>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )}

                                            <TableCell align="right">
                                                <Typography color="primary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </Typography>
                                                <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                    {new Date(item.createdAt).toLocaleTimeString()}
                                                </Typography>
                                            </TableCell>


                                            <TableCell align="right">
                                                <Typography color="primary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                    {new Date(item.updatedAt).toLocaleDateString()}
                                                </Typography>
                                                <Box component="span" mr={1}/>
                                                <Typography color="secondary" variant="body2" style={{display: 'inline-block', width: '120px'}}>
                                                    {new Date(item.updatedAt).toLocaleTimeString()}
                                                </Typography>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}

                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (isDense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </TableContainer>
                    {searchFilteredDataList.length > 0? (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15, 20, 25]}
                            component="div"
                            count={searchFilteredDataList.length}
                            rowsPerPage={rowsPerPage}
                            page={searchFilteredDataList.length <= rowsPerPage? 0 : page}
                            onPageChange={ (event, pageNumber) => { handleChangePage(pageNumber); }}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    ) : (
                        null
                    )}
                </Paper>
            </Box>
        </div>
    );

}

CollectionTable.propTypes = {
    appState: PropTypes.object.isRequired,
    userID: PropTypes.string,
    searchFilteredDataList: PropTypes.arrayOf(PropTypes.object).isRequired,
    setParentDeleteCollectionDialog: PropTypes.func.isRequired,
    setParentExportCollectionDialog: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    setSelectedDataItemsList: PropTypes.func.isRequired,
    isTemplates: PropTypes.bool.isRequired,
}

CollectionTable.defaultProps =
{
    appState: {},
    userID: null,
    searchFilteredDataList: {},
    setParentDeleteCollectionDialog: () => {},
    setParentExportCollectionDialog: () => {},
    selectedDataItemsList: {},
    setSelectedDataItemsList: () => {},
    isTemplates: true
}