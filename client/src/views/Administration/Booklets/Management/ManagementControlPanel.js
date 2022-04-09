// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ButtonGroup from  '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

// ==================== MUI Icons ====================
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';


// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            flexGrow: 1,     // CSS determined this way, flexbox properties
            height: '100%'
        },
        rootGrid: {
            height: '100%'
        }
    }));


// ================= Static Variables ================
const selectFilterOptions = [ { key: "Name", value: "name", display: "Name"}, { key: "CollectionId", value: "collectionId", display: "Collection ID"}, { key: "PatientName", value: "patientName", display: "Patient Name"}, { key: "PatientId", value: "patientId", display: "Patient ID"} ]

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const ManagementControlPanel = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const {  setParentAlert,
            isDense, setIsDense,
            isTemplates, setIsTemplates,
            dataList, getParentData,
            setSearchFilteredDataList,
            setCreateChapterTemplateDialog,
            setCreateChapterUserDialog } = props;

        const [selectSearchFilterOption, setSelectSearchFilterOption ] = useState(selectFilterOptions[0].value);
        const [searchFilter, setSearchFilter] = useState("");

    // Functions ===

        const pullHandler = useCallback(() =>
        {
            try
            {
                getParentData();
                setParentAlert(new AlertType('Refreshed initiated...', "info"));
            }
            catch
            {

            }
            
        }, [ getParentData, setParentAlert ]);

        const createTemplateHandler = useCallback(() =>
        {
            setCreateChapterTemplateDialog(true);
        }, [ setCreateChapterTemplateDialog ]);

        const createUserHandler = useCallback(() =>
        {
            setCreateChapterUserDialog(true);
        }, [ setCreateChapterUserDialog ]);

        const compactHandler = useCallback((event) =>
        {
            setIsDense(event.target.checked);
        }, [ setIsDense ]);

        const chapterTemplatesButtonHandler = useCallback(() =>
        {
            setIsTemplates(true);
            setSelectSearchFilterOption(selectFilterOptions[0].value);
        }, [ setIsTemplates ]);

        const userChaptersButtonHandler = useCallback(() =>
        {
            setIsTemplates(false);
            setSelectSearchFilterOption(selectFilterOptions[0].value);
        }, [ setIsTemplates ]);

        const selectSearchHandler = useCallback((event) =>
        {
            setSearchFilter("");
            setSelectSearchFilterOption(event.target.value);

        }, [ setSelectSearchFilterOption ]);

        const searchHandler = useCallback((event) =>
        {
            let tempFilter = event.target.value.toUpperCase();
            let tempArray = [];
            dataList.forEach( item => 
            {
                switch(selectSearchFilterOption)
                {
                    case "name":

                        if(item.name.toUpperCase().indexOf(tempFilter) > -1)
                        {
                            tempArray.push(item);
                        }

                        break;

                    case "collectionId":

                            if(item.collectionId.toUpperCase().indexOf(tempFilter) > -1)
                            {
                                tempArray.push(item);
                            }
    
                            break;

                    case "patientId":

                        if(item.patientId.toUpperCase().indexOf(tempFilter) > -1)
                        {
                            tempArray.push(item);
                        }

                        break;

                    case "patientName":

                        if(item.patientName.toUpperCase().indexOf(tempFilter) > -1)
                        {
                            tempArray.push(item);
                        }

                        break;

                    default:
                }
                
            });

            setSearchFilter(event.target.value);
            setSearchFilteredDataList(tempArray);
        }, [ dataList, setSearchFilteredDataList, selectSearchFilterOption ]);


    // Hooks ===

        // First Render only because of the [ ] empty array tracking with the useEffect
        useEffect( () =>
        {
            setSearchFilter("");
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ dataList ]);

        useEffect( () =>
        {
            if(searchFilter === "")
            {
                setSearchFilteredDataList(dataList);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ setSelectSearchFilterOption, searchFilter ]);

    // Render Section ===

        return (
            <>
                <Box mx={2} my={1} boxShadow={0}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={1}
                    >
                        <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                            <Grid item>
                                <Typography variant="h6" component="h6">
                                    Manage
                                </Typography>
                                <Divider />
                            </Grid>
                            <Grid item xs>
                                <Box mx={3} my={1} boxShadow={0}>
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                        <Grid item>
                                            <ButtonGroup size="small" variant="contained" color="secondary">
                                                    <Button 
                                                        startIcon={<CheckBoxOutlineBlankOutlinedIcon />}
                                                        disabled={isTemplates}
                                                        onClick={ () => { chapterTemplatesButtonHandler(); }}
                                                    >
                                                        Chapter Templates
                                                    </Button>
                                                    <Button
                                                        startIcon={<ListAltOutlinedIcon />}
                                                        disabled={!isTemplates}
                                                        onClick={ () => { userChaptersButtonHandler(); }}
                                                    >
                                                        User Chapters
                                                    </Button>
                                            </ButtonGroup>
                                        </Grid>
                                        <Grid item>
                                            <Tooltip
                                                placement="bottom"
                                                title="Refresh Online Chapters"
                                            >
                                                <Button 
                                                    size="small" 
                                                    variant="contained" 
                                                    color="primary"
                                                    startIcon={<RefreshIcon />}
                                                    onClick={() => { pullHandler(); }}
                                                >
                                                    Refresh
                                                </Button>
                                            </Tooltip> 
                                        </Grid>
                                        {isTemplates? (
                                            <>
                                                <Grid item>
                                                    <Tooltip
                                                        placement="bottom"
                                                        title="Create Chapter Template"
                                                    >
                                                        <Button 
                                                            size="small" 
                                                            variant="contained" 
                                                            color="primary"
                                                            disabled={!isTemplates}
                                                            startIcon={<AddBoxOutlinedIcon />}
                                                            onClick={() => { createTemplateHandler(); }}
                                                        >
                                                            Create Template
                                                        </Button>
                                                    </Tooltip> 
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Grid item>
                                                    <Tooltip
                                                        placement="bottom"
                                                        title="Start User Chapter"
                                                    >
                                                        <Button 
                                                            size="small" 
                                                            variant="contained" 
                                                            color="primary"
                                                            disabled={isTemplates}
                                                            startIcon={<AddBoxOutlinedIcon />}
                                                            onClick={() => { createUserHandler(); }}
                                                        >
                                                            Start User Chapter
                                                        </Button>
                                                    </Tooltip> 
                                                </Grid>
                                            </>
                                        )}
                                        
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Tooltip
                                    placement="left"
                                    title="Use this page to manage your chapters. Any information that a patient has answered in a chapter along with its versions exist in the Chapter Tab. Otherwise, created chapter Templates exists in its own tab."
                                >
                                    <IconButton>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                            <Box mx={1} my={1} boxShadow={0}>
                                <Card>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={3}>
                                            <Grid item>
                                                <Typography color="textPrimary" variant="subtitle2">
                                                    Table Options
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <FormControlLabel
                                                    control={<Switch checked={isDense} onChange={ (event) => { compactHandler(event); }} />}
                                                    label="Compact"
                                                    labelPlacement="end"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <FormControl id="search-filter-select-label" variant="filled" size="small" style={{minWidth: 140}} disabled={isTemplates}>
                                                    <InputLabel>
                                                        Search Filter
                                                    </InputLabel>
                                                    <Select
                                                        autoWidth={true}
                                                        labelId="search-filter-select-label"
                                                        value={selectSearchFilterOption}
                                                        onChange={(event) => { selectSearchHandler(event); } }
                                                    >
                                                        {selectFilterOptions.map( item => 
                                                        {
                                                            return(
                                                                <MenuItem key={item.key} value={item.value}>
                                                                    <em>{item.display}</em>
                                                                </MenuItem>  
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs>
                                                <TextField label="Search"
                                                    type="search"
                                                    size="small"
                                                    variant="filled"
                                                    fullWidth
                                                    value={searchFilter}
                                                    onChange={ (event) => { searchHandler(event); }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                        <Grid item xs={12} container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                            <Grid item>
                                <Typography variant="h6" component="h6">
                                    Table
                                </Typography>
                                <Divider />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </>
        );
}

// ======================== Component PropType Check ========================
ManagementControlPanel.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    setParentAlert: PropTypes.func.isRequired,
    isDense: PropTypes.bool.isRequired,
    setIsDense: PropTypes.func.isRequired,
    isTemplates:PropTypes.bool.isRequired,
    setIsTemplates: PropTypes.func.isRequired,
    dataList: PropTypes.arrayOf(PropTypes.object).isRequired,
    getParentData: PropTypes.func.isRequired,
    setSearchFilteredDataList: PropTypes.func.isRequired,
    setCreateChapterTemplateDialog: PropTypes.func.isRequired,
    setCreateChapterUserDialog: PropTypes.func.isRequired
                        
}

ManagementControlPanel.defaultProps = 
{
    setParentAlert: () => {},
    setIsDense: () => {},
    setIsTemplates: () => {},
    dataList: {},
    getParentData: () => {},
    setSearchFilteredDataList: () => {},
    setCreateChapterTemplateDialog: () => {},
    setCreateChapterUserDialog: () => {}
}

export default ManagementControlPanel;  // You can even shorthand this line by adding this at the function [Component] declaration stage