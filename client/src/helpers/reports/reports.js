const calculateCompleteness = (survey) => {

    let totalSurveyItems = survey.getAllQuestions().length;
    let totalQuestions = 0; 
    let finishedQuestions = 0;
    let partiallyFinishedQuestions = 0;

    survey.getAllQuestions().forEach( (question) => {
        if(question.getType() != 'html' && !question.isReadOnly)    // SurveyJS Question types; we currently use HTML for Titles / Sub titles
        {
            totalQuestions += 1;

            if(question.getType() == 'matrix')
            {
                // console.log('Matrix Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('rows') && question.propertyHash.rows && Array.isArray(question.propertyHash.rows)
                        && question.propertyHash.hasOwnProperty('value') && question.propertyHash.value)
                    {
                        let subQuestionsLength = question.propertyHash.rows.length;
                        let answeredSubQuestions = Object.keys(question.propertyHash.value).length;
                        
                        // ============= Check correlating Row Question to Answer =============

                        // question.propertyHash.rows.forEach( (subQuestion) => {

                        //     if(subQuestion.hasOwnProperty('propertyHash') && question.propertyHash)
                        //     {
                        //         if(subQuestion.propertyHash.hasOwnProperty('value') && subQuestion.propertyHash.value)
                        //         {
                        //             if(String(subQuestion.propertyHash.value) in question.propertyHash.value)
                        //             {
                        //                 console.log("-> Answered Sub Matrix Item");
                        //             }
                        //             else
                        //             {
                        //                 console.log("-> Un-Answered Sub Matrix Item");
                        //             }
                        //         }
                        //     }
                            
                        // });

                        if(answeredSubQuestions < subQuestionsLength)
                        {
                            // console.log('Partially-Completed Matrix Question');
                            // console.log(question);
                            partiallyFinishedQuestions += 1;
                        }
                        else if(answeredSubQuestions == subQuestionsLength)
                        {
                            // console.log('Finished Multiple Question Matrix');
                            finishedQuestions += 1;
                        }
                    }    
                }
                
            }
            else if(question.getType() == 'matrixdynamic')
            {
                // console.log('Matrix Dynamic Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('rows') && question.propertyHash.rows && Array.isArray(question.propertyHash.rows)
                        && question.propertyHash.hasOwnProperty('value') && question.propertyHash.value
                        && question.propertyHash.hasOwnProperty('columns') && question.propertyHash.columns)
                    {
                        // Odd behaviour from dynamic questions
                        let subQuestionCellLength = question.propertyHash.columns.length;
                        let subQuestionsLength = question.propertyHash.rowCount;
                        let answeredSubQuestions = 0;

                        //Has an available row
                        if(subQuestionsLength > 0)
                        {
                             // This calculation is based on if row fully fills cells within it's row. Does not take into account cell is required
                            question.propertyHash.value.forEach(row => {
                                if(Object.keys(row).length == subQuestionCellLength)
                                    answeredSubQuestions += 1;
                            });

                            if(answeredSubQuestions < subQuestionsLength)
                            {
                                // console.log('Partially-Completed Dynamic Matrix Question');
                                // console.log(question);
                                partiallyFinishedQuestions += 1;
                            }
                            else if(answeredSubQuestions == subQuestionsLength)
                            {
                                // console.log('Finished Dynamic Matrix Question');
                                finishedQuestions += 1;
                            }
                        }
                        else
                        {
                            // console.log('Finished Dynamic Matrix Question');
                            finishedQuestions += 1;
                        }
                       
                    }    
                }
                
            }
            else if(question.getType() == 'multipletext')
            {
                // console.log('Multiple Text Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('items') && question.propertyHash.items && Array.isArray(question.propertyHash.items)
                        && question.propertyHash.hasOwnProperty('value') && question.propertyHash.value)
                    {
                        let subQuestionsLength = question.propertyHash.items.length;
                        let answeredSubQuestions = Object.keys(question.propertyHash.value).length;

                        if(answeredSubQuestions < subQuestionsLength)
                        {
                            // console.log('Partially-Completed Multiple Text Question');
                            // console.log(question);
                            partiallyFinishedQuestions += 1;
                        }
                        else if(answeredSubQuestions == subQuestionsLength)
                        {
                            // console.log('Finished Dynamic Matrix Question');
                            finishedQuestions += 1;
                        }
                    }    
                }
                
            }
            else if(question.getType() == 'checkbox')
            {
                // console.log('Checkbox Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('value') && question.propertyHash.value && Array.isArray(question.propertyHash.value))
                    {
                            if(question.propertyHash.value.length > 0)
                            {
                                // console.log('Finished Checkbox Question');
                                finishedQuestions += 1;
                            }
                            else
                            {
                                // console.log('Partially-Completed Checkbox Question');
                                // console.log(question);
                            }
                    }      
                }
            }
            else if(question.getType() == 'text')
            {
                // console.log('Text Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('value') && question.propertyHash.value)
                    {
                            if(/\S/.test(String(question.propertyHash.value)))
                            {
                                // console.log('Finished Text Question');
                                finishedQuestions += 1;
                            }
                            else
                            {
                                // console.log('Partially-Completed Text Question');
                                // console.log(question);
                            }
                    }      
                }
            }
            else if(question.getType() == 'radiogroup')
            {
                // console.log('Radio Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('value') && question.propertyHash.value)
                    {
                            if(String(question.propertyHash.value))
                            {
                                // console.log('Finished Radio Question');
                                finishedQuestions += 1;
                            }
                            else
                            {
                                // console.log('Partially-Completed Radio Group Question');
                                // console.log(question);
                            }
                    }      
                }
            }
            else if(question.getType() == 'rating')
            {
                // console.log('Rating Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('value') && question.propertyHash.value)
                    {
                            if(parseInt(question.propertyHash.value))
                            {
                                // console.log('Finished Rating Question');
                                finishedQuestions += 1;
                            }
                            else
                            {
                                // console.log('Partially-Completed Rating Question');
                                // console.log(question);
                            }
                    }      
                }
            }
            else if(question.getType() == 'nouislider')
            {
                // console.log('NoUiSlider Item: ' + question.getType());
                // console.log(question);

                if(question.hasOwnProperty('propertyHash') && question.propertyHash)
                {
                    if(question.propertyHash.hasOwnProperty('value') && question.propertyHash.value)
                    {
                            if(parseInt(question.propertyHash.value))
                            {
                                // console.log('Finished Rating Question');
                                finishedQuestions += 1;
                            }
                            else
                            {
                                // console.log('Partially-Completed Rating Question');
                                // console.log(question);
                            }
                    }      
                }
            }
            else
            {
                // console.log('Other Non HTML Item that was missed: ' + question.getType());
                // console.log(question);
            }
        }
        else
        {
            // console.log('Title or Miscellaneous Item: ' + question.getType());
            // console.log(question);
        }
    });

    // console.log( 'Total Survey Items: ' + totalSurveyItems);
    // console.log( 'Total Survey Questions: ' + totalQuestions);
    // console.log( 'Finished Survey Questions: ' + finishedQuestions);
    // console.log( 'Partially finished Survey Questions: ' + partiallyFinishedQuestions);

    let completePercentage = Math.round(((finishedQuestions/totalQuestions)*100) * 100)/100;

    // console.log( 'Complete Percentage: ' + completePercentage);
    
    if(!completePercentage)
        return 0;
    else
        return completePercentage;

};

export default calculateCompleteness;