// ================================================
// Code associated with ExportChapterDialog
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

const ExportChapterDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===

        const { isTemplates, getParentData, setParentAlert, selectedDataItemsList,
            exportChapterDialog, setExportChapterDialog,
            exportChapterDialogExecuting, setExportChapterDialogExecuting  } = props;

        const [pdfWidth, setPdfWidth] = useState(defaultPdfWidth);
        const [pdfHeight, setPdfHeight] = useState(defaultPdfHeight);

    // Functions ===

        const exportChapter = useCallback(() =>
        {
            if(pdfWidth > 0 && pdfHeight > 0 && selectedDataItemsList.length > 0)
            {
                selectedDataItemsList.forEach( item =>
                {
                    let surveyJSON = "";
                    let responseJSON = "{}";
                    
                    if(isTemplates)
                    {
                        if(item.surveyJSON !== "")
                        {
                            surveyJSON = JSON.parse(item.surveyJSON);
                        }
                    }
                    else
                    {
                        if(item.surveyTemplate)
                        {
                            surveyJSON = JSON.parse(item.surveyTemplate.surveyJSON);
                        }
                    }

                    
                    if(Object.prototype.hasOwnProperty.call(item, "responseJSON"))
                    {
                        responseJSON = JSON.parse(item.responseJSON);
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
                    
                    if(Object.prototype.hasOwnProperty.call(item, "responseJSON"))
                    {
                        surveyPDF.data = responseJSON;
                    }

                    surveyPDF.save(item._id + item.name + ".pdf");

                });
            }
            else
            {
                throw new Error('Bad Export.');
            }
        }, [ pdfWidth, pdfHeight, selectedDataItemsList ]);
        
        const closeHandler = useCallback(() => {
            setExportChapterDialog(false);
            setPdfWidth(defaultPdfWidth);
            setPdfHeight(defaultPdfHeight);
        }, [ setPdfWidth, setPdfHeight, setExportChapterDialog ]);


        const exportHandler = useCallback(() => {
            try{
                setExportChapterDialogExecuting(true);
                exportChapter();
                setExportChapterDialogExecuting(false);
                setExportChapterDialog(false);
                setPdfWidth(defaultPdfWidth);
                setPdfHeight(defaultPdfHeight);
                getParentData();
                setParentAlert(new AlertType(`Successfully exported ${selectedDataItemsList.length} chapter${selectedDataItemsList.length > 1? "s" : ""}.`, "success"));
                
            }
            catch{
                setParentAlert(new AlertType(`Unable export chapter${selectedDataItemsList.length > 1? "s" : ""}. Please refresh and try again.`, "error"));
            }
        }, [ setPdfWidth, setPdfHeight, exportChapter, selectedDataItemsList, setExportChapterDialogExecuting, setExportChapterDialog, setParentAlert, getParentData]);

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


    // Render Section ===

        return (
            <>
                {exportChapterDialog? (
                    <Dialog id="export-chapter-dialog"
                        fullWidth
                        maxWidth="md"
                        open={exportChapterDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Export chapter{selectedDataItemsList.length > 1? "s" : ""}
                        </DialogTitle>
                        <DialogContent>
                            {exportChapterDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Exporting {selectedDataItemsList.length} chapter{selectedDataItemsList.length > 1? "s" : ""}. Please enter valid pdf width and height values for your export.
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
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={exportChapterDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SystemUpdateAltIcon />} onClick={() => { exportHandler(); }} disabled={exportChapterDialogExecuting}>
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
ExportChapterDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    isTemplates: PropTypes.bool.isRequired,
    getParentData: PropTypes.func.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    exportChapterDialog: PropTypes.bool.isRequired,
    setExportChapterDialog: PropTypes.func.isRequired,
    exportChapterDialogExecuting: PropTypes.bool.isRequired,
    setExportChapterDialogExecuting: PropTypes.func.isRequired 
}

ExportChapterDialog.defaultProps = 
{
    exportChapterDialog: true,
    getParentData: () => {},
    setParentAlert: () => {},
    selectedDataItemsList: {},
    exportChapterDialog: {},
    setExportChapterDialog: () => {},
    exportChapterDialogExecuting: {},
    setExportChapterDialogExecuting: () => {}
}

export default ExportChapterDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage