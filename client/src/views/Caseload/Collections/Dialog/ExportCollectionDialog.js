// ================================================
// Code associated with ExportCollectionDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================
import * as Survey from "survey-react";
import * as SurveyPDF from 'survey-pdf';
import "survey-react/survey.css";

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import CircularProgress from '@material-ui/core/CircularProgress';

// ==================== MUI Icons ====================
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

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
const surveyStyle = "default";
 
// const surveyOptions = {

// }; 

const defaultPdfWidth = 210;
const defaultPdfHeight = 297; 

const pdfDimensions = {
    inputProps: { min: 1 }
}

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const ExportCollectionDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===

        const { getParentData, setParentAlert, selectedDataItemsList,
            exportCollectionDialog, setExportCollectionDialog,
            exportCollectionDialogExecuting, setExportCollectionDialogExecuting, isTemplates  } = props;

        const [pdfWidth, setPdfWidth] = useState(defaultPdfWidth);
        const [pdfHeight, setPdfHeight] = useState(defaultPdfHeight);

        const [totalExported, setTotalExported] = useState(0);

    // Functions ===

        const exportCollectionChapters = useCallback(() =>
        {
            if(pdfWidth > 0 && pdfHeight > 0 && selectedDataItemsList.length > 0)
            {
                let promises = new Array();

                selectedDataItemsList.forEach(item =>
                {
                    if(isTemplates)
                    {
                        item.surveyList.forEach(subItem => {

                            promises.push(
                                new Promise((resolve, reject) => {
                                    
                                    let surveyJSON = "";
                                    let responseJSON = "{}";
                                    
                                    if(subItem.surveyJSON !== "")
                                    {
                                        surveyJSON = JSON.parse(subItem.surveyJSON);
                                    }
                                    
                                    if(Object.prototype.hasOwnProperty.call(subItem, "responseJSON"))
                                    {
                                        responseJSON = JSON.parse(subItem.responseJSON);
                                    }
            
                                    const pdfOptions = {
                                        format: [parseInt(pdfWidth) || defaultPdfWidth, parseInt(pdfHeight) || defaultPdfHeight],
                                        fontSize: 14,
                                        margins: {
                                            left: 10,
                                            right: 10,
                                            top: 18,
                                            bot: 10
                                        }
                                    };
            
                                    let surveyPDF = new SurveyPDF.SurveyPDF(surveyJSON, pdfOptions);
                                    
                                    if(Object.prototype.hasOwnProperty.call(subItem, "responseJSON"))
                                    {
                                        surveyPDF.data = responseJSON;
                                    }
    
                                    surveyPDF.save(new Date().getTime().toString() + subItem._id + subItem.name + ".pdf");
                                    resolve();
                                })
                            .catch((error) => {
                                console.log('Error: ', error);
                            }));
                        });
                    }
                    else
                    {
                        item.memberSurveyList.forEach(subItem => {

                            promises.push(
                                new Promise((resolve, reject) => {
                                    
                                    let surveyJSON = "";
                                    let responseJSON = "{}";
                                    
                                    if(subItem.surveyTemplate.surveyJSON !== "")
                                    {
                                        surveyJSON = JSON.parse(subItem.surveyJSON);
                                    }
                                    
                                    if(Object.prototype.hasOwnProperty.call(subItem, "responseJSON"))
                                    {
                                        responseJSON = JSON.parse(subItem.responseJSON);
                                    }
            
                                    const pdfOptions = {
                                        format: [parseInt(pdfWidth) || defaultPdfWidth, parseInt(pdfHeight) || defaultPdfHeight],
                                        fontSize: 14,
                                        margins: {
                                            left: 10,
                                            right: 10,
                                            top: 18,
                                            bot: 10
                                        }
                                    };
            
                                    let surveyPDF = new SurveyPDF.SurveyPDF(surveyJSON, pdfOptions);
                                    
                                    if(Object.prototype.hasOwnProperty.call(subItem, "responseJSON"))
                                    {
                                        surveyPDF.data = responseJSON;
                                    }
                                    
                                    if(isTemplates)
                                    {
                                        surveyPDF.save(new Date().getTime().toString() + subItem._id + subItem.name + ".pdf");
                                    }
                                    else
                                    {
                                        surveyPDF.save(new Date().getTime().toString() + subItem._id + subItem.collectionTemplate.name + ".pdf");
                                    }

                                    resolve();
                                })
                            .catch((error) => {
                                console.log('Error: ', error);
                            }));
                        });
                    }

                });

                Promise.all(promises).then(() => {
                    setParentAlert(new AlertType(`Successfully exported ${totalExported} chapter${totalExported > 1? "s" : ""}.`, "success"));
                })
                .catch(() =>{
                    setParentAlert(new AlertType(`Unable export ${totalExported} chapter${totalExported > 1? "s" : ""}. Please refresh and try again.`, "error"));
                });
            }
            else
            {
                throw new Error('Bad Export.');
            }
        }, [ pdfWidth, pdfHeight, selectedDataItemsList, totalExported ]);
        
        const closeHandler = useCallback(() => {
            setExportCollectionDialog(false);
            setPdfWidth(defaultPdfWidth);
            setPdfHeight(defaultPdfHeight);
        }, [ setPdfWidth, setPdfHeight, setExportCollectionDialog ]);


        const exportHandler = useCallback(() => {
            try{
                setExportCollectionDialogExecuting(true);
                exportCollectionChapters();
                setExportCollectionDialogExecuting(false);
                setExportCollectionDialog(false);
                setPdfWidth(defaultPdfWidth);
                setPdfHeight(defaultPdfHeight);
                getParentData();
            }
            catch{
                setParentAlert(new AlertType(`Unable export collection(s). Please refresh and try again.`, "error"));
            }
        }, [ setPdfWidth, setPdfHeight, exportCollectionChapters, selectedDataItemsList, setExportCollectionDialogExecuting, setExportCollectionDialog, setParentAlert, getParentData]);

        const widthHandler = useCallback((event) =>
        {
            if(event.target.value !== "")
            {
                setPdfWidth(parseInt(event.target.value));
            }
            
        }, [ setPdfWidth ]);

        const heightHandler = useCallback((event) =>
        {

            if(event.target.value !== "")
            {
                setPdfHeight(parseInt(event.target.value));
            }

        }, [ setPdfHeight ]);

    // Hooks ===

        // First Render only because of the [ ] empty array tracking with the useEffect
        useEffect( () =>
        {
            Survey.StylesManager.applyTheme(surveyStyle);

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

        useEffect( () =>
        {
            if(selectedDataItemsList)
            {
                setTotalExported(() => {
                    
                    let sum = 0;
                    
                    if(isTemplates)
                    {
                        selectedDataItemsList.forEach(item => {
                            sum+=item.surveyList.length
                        });
                    }
                    else
                    {
                        selectedDataItemsList.forEach(item => {
                            sum+=item.memberSurveyList.length
                        });
                    }
                   
                    return sum;
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ selectedDataItemsList ]);


    // Render Section ===

        return (
            <>
                {exportCollectionDialog? (
                    <Dialog id="export-collection-chapter-dialog"
                        fullWidth
                        maxWidth="md"
                        open={exportCollectionDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Export collection{selectedDataItemsList.length > 1? "s" : ""}
                        </DialogTitle>
                        <DialogContent>
                            {exportCollectionDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Exporting {selectedDataItemsList.length} collection{selectedDataItemsList.length > 1? "s" : ""}, totalling {totalExported} chapter{totalExported > 1? "s" : ""}. Please enter valid pdf width and height values for your export.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            <Grid item xs>
                                                <TextField label="Pdf Width"
                                                    type="number"
                                                    size="small"
                                                    variant="filled"
                                                    InputProps={pdfDimensions}
                                                    error={pdfWidth <= 0? true : false && parseInt(pdfHeight)}
                                                    fullWidth
                                                    value={pdfWidth}
                                                    onChange={ (event) => { widthHandler(event); }}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField label="Pdf Height"
                                                    type="number"
                                                    size="small"
                                                    variant="filled"
                                                    InputProps={pdfDimensions}
                                                    error={pdfHeight <= 0? true : false && parseInt(pdfHeight)}
                                                    fullWidth
                                                    value={pdfHeight}
                                                    onChange={ (event) => { heightHandler(event); }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={exportCollectionDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SystemUpdateAltIcon />} onClick={() => { exportHandler(); }} disabled={exportCollectionDialogExecuting}>
                                Export
                            </Button>
                        </DialogActions>
                    </Dialog>
                ) : (
                    null
                )}
            </>
            
        );
}

// ======================== Component PropType Check ========================
ExportCollectionDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    getParentData: PropTypes.func.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    exportCollectionDialog: PropTypes.bool.isRequired,
    setExportCollectionDialog: PropTypes.func.isRequired,
    exportCollectionDialogExecuting: PropTypes.bool.isRequired,
    setExportCollectionDialogExecuting: PropTypes.func.isRequired,
    isTemplates: PropTypes.bool.isRequired
}

ExportCollectionDialog.defaultProps = 
{
    getParentData: () => {},
    setParentAlert: () => {},
    selectedDataItemsList: {},
    exportCollectionDialog: {},
    setExportCollectionDialog: () => {},
    exportCollectionDialogExecuting: {},
    setExportCollectionDialogExecuting: () => {},
    isTemplates: true
}

export default ExportCollectionDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage