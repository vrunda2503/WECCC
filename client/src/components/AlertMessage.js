// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

// ==================== MUI Icons ====================

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            flexGrow: 1,     // CSS determined this way, flexbox properties
            height: '100%'
        }
    }));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const AlertMessage = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { alert, setParentAlert } = props;

        // show collapse Tag that controls the viewing of the alert
        const [show, setShow] = useState(false);


    // Functions ===

        const closeHandler = useCallback(() => {
            setShow(false);
        }, [ ]);

    // Hooks ===

        // First Render only because of the [ ] empty array tracking with the useEffect
        useEffect( () =>
        {       
                const collapseHandler = () => {
                    if(alert !== null) {
                        if(alert.message !== '') {
                            setShow(true);
                        }
                        else {
                            setShow(false);
                        }
                    }
                    else {
                        setShow(false);
                    }
                };

                setShow(false);

                let timer = setTimeout( () => 
                {
                    collapseHandler();
                }, 400);

                return () => 
                {
                    clearTimeout(timer); //This return function covers for when your component unmounts, clearing the timeout
                }    
                
        }, [ alert ]);

        useEffect( () => {

            if(show)
            {
                let timer = setTimeout( () => 
                {
                    closeHandler();
                }, 5000);

                return () => 
                {
                    clearTimeout(timer); //This return function covers for when your component unmounts, clearing the timeout
                }
            }
        }, [ show, closeHandler ]);


    // Render Section ===

        return (
            <>
                <Collapse in={show}>
                    {alert.message !== ''? (
                        <Alert
                            severity={alert.severity}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        closeHandler();
                                    }}
                                    onClose={() => { setParentAlert(new AlertType('', 'success')); }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {alert.message}
                        </Alert>
                    ) : (
                        null
                    )}
                </Collapse>
            </>
        );
}

// ======================== Component PropType Check ========================
AlertMessage.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    alert: PropTypes.instanceOf(AlertType).isRequired,
    setParentAlert: PropTypes.func.isRequired
}

AlertMessage.defaultProps = 
{
    alert: {},
    setParentAlert: () => {}
}

export default AlertMessage;  // You can even shorthand this line by adding this at the function [Component] declaration stage