# WECCC React App

## Installation and Running Documentation
1. Download files from GitHub repository, whether it be Git clone or direct download.
2. In a terminal at the WECCC_IMS root directory, run the following: “npm install” and wait, following any instructions the terminal outputs if there are dependencies that need to be fixed.
   - OPTIONAL: In a terminal, run: “npm install -g nodemon” which will install nodemon globally on your local computer. This allows the project to automatically restart and update while running whenever a change in the code is saved for convenience sake.
3. In a terminal, change your directory to the client folder and run the following again: “npm install” and wait for the installation of node modules to complete. If a fix is required due to dependencies, follow the instructions the terminal outputs to do so. This is usually in the form of running “npm audit fix”.
4. In one terminal at the WECCC_IMS root directory run: “nodemon server.js” which will start the server-side application.
5. In another SEPARATE terminal change your directory to the client folder and run: “npm run start” which will start the client-side application and should automatically open a webpage to the login page. If not, connect to “localhost:3000” in a browser tab.

## Application Documentation
1. Users
   - New Person
     - This page can only be accessed by an administrator and allows the creation/invitation of a new user account. An email address, password, first name and last name, phone number, address, and level of user authorization are all required. To complete the form, click the “Register New Person” button and if all the information was entered correctly, a new user account will successfully be created.
   - Assign Patient
     - This page allows for a patient to be assigned to a worker, coordinator or administrator. It is required that both a patient and a staff member exist in the database. Then the desired patient user must be selected, as well as the desired staff member that will be assigned the patient. Once both the patient and staff member are selected, confirm the assignment by clicking the “Assign Patient to Personal” button.
   - Assign Staff
     - This page works similarly to the “Assign Patient” but involves assigning a worker to a coordinator or administrator instead. Simply select the desired worker and coordinator or administrator and confirm the assignment by clicking the “Assign Worker to Personal” button.
   - Management
     - An administrator can access this page which allows for the management of all users in the database. These users are displayed through a “user card” which contains basic information and the ability to view their full profile, edit their profile or disable/enable their profile in the case an account needs to be deactivated for any reason.
2. Booklets
   - Create a Booklet
     - This section allows an administrator to create a survey booklet that can be edited and then used to acquire desired information from a patient. In order to create a booklet, simply enter the name desired for the booklet and click the “Create Booklet” button. This will successfully register the booklet into the database for use in the application.
   - Management
     - In this section you will be able to view a list of all created booklets with basic information and the ability to perform various actions on them. This includes previewing a booklet (indicated in green), editing and updating a booklet (indicated in blue) and deleting a booklet (indicated in red).
   - Editing a Booklet 
     - This function uses SurveyJS Builder, allowing you to drag items from the toolbox (such as dropdown menus, ratings, etc.) into the main window. In the main window you can edit the title of the question along with other captions such as names of multiple choice answers. At any time you can rename the booklet and save changes to it by clicking the “Save Progress” button.
3. Start a Booklet
   - On this page, staff members are able to start a booklet survey for a patient. It is required that the logged in user has a patient assigned to them and that a booklet survey has already been created and existed within the database. Select the desired patient and booklet that you want them to fill out and click the “Begin Booklet” button. From here, you can complete as much of the survey as possible and click the “Complete” button to save the survey. This instance of the survey can be edited again by going to the “Your Patients” dashboard tab, viewing the desired patient’s profile and selecting the booklet that you want to edit that a patient has begun filling out. Once completed and saved, the booklet will be in a “pending approval” state until an administrator approves the completed booklet.
4. Your Patients
   - This dashboard page will display all of your assigned patients in the form of “user cards” that will display basic information and the option to view their full profile. From their full profile, you can view or edit the booklets that the patient has done, sticky notes associated with them, and extra profile information such as their address, phone number, etc.
5. Search
   - This dashboard page allows you to view all member surveys that have been created. The table is split into four columns: the patient’s name, the name of the booklet they wrote, date created and whether the survey was approved by an administrator or not. These table rows can be filtered by the patient’s name, the booklet name, a threshold date of creation and it’s approval simultaneously, allowing for dynamic and precise searching.
