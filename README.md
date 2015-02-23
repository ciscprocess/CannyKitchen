# CannyKitchen
CS 4911B Senior Design Project: Meal Plan Optimizer

## Prerequisites
CannyKitchen requires standard web tools to build properly, including

- [Node.js](nodejs.org)
- [Grunt](http://gruntjs.com/)
- [Bower](http://bower.io/)

As Grunt and Bower depend on the Node Package Manager to be installed, please install Node.js first. Installation instructions can be found on the respective webpages.

## Initial Set Up
Upon a fresh checkout, you must perform several tasks. The steps are listed below, in order.
Open a terminal with root privileges, or 'sudo' (or su -c) each command if on a Unix-based OS.

### Update Node Packages

	npm install
    
This installs all necessary packages for the node.js server.

### Install Bower Packages
This is as easy as the last step.

	bower install

### Seed the Database
This step shouldn't be necessary for Sprint 1, since the remote database is by default used. If, however, you wish to use a local MongoDB instance, run the following before attempting to run the application:

	grunt seed-recipes

A completion indicator, in percent units, should appear.

### Run the Express Server
Now that the initial set up has been performed, the app should now be runnable. At the terminal, simply run grunt:
	
    grunt

The application can now be accessed at [localhost](localhost:3000) on port 3000.

## Contact
For any questions, feel free to contact [Nathan Korzekwa](mailto:nkorzekwa3@gatech.edu) at [nkorzekwa3@gatech.edu](mailto:nkorzekwa3@gatech.edu) or [Anna Tran](mailto:atran37@gatech.edu) at [atran37@gatech.edu](atran37@gatech.edu).

## Contributors
- Nathan Korzekwa
- Anna Tran
- Hyun Kim
