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

### Run a Local MongoDB Instance
For this sprint, the MongoCloud data will not work. Therefore, it is recommended that you run a local MongoDB instance at port 3000. This can be easily done by running:

	mongod --dbpath /path/to/empty/folder

where the 'dbpath' parameter can be of your choosing (though it should be consistent between runs).
	
### Seed the Database
To fill your database with test recipe data, run the following command at a console in the root directory of the project:

	grunt seed-recipes


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
