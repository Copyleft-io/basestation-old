# Basestation

##### Description
BaseStation is a Real-Time Service and Configuration Management System Handcrafted by the Hobbyists at Copyleft.io


##### Components...

    Angular (https://angular.io)
    AngularFire (https://github.com/firebase/angularfire)
    Firebase (https://www.firebase.com)
    Bootstrap (http://getbootstrap.com/)
    Bootswatch Flatly Theme (https://bootswatch.com/flatly/)
    FontAwesome (http://fortawesome.github.io/Font-Awesome/)
    jQuery (https://jquery.com/)


##### Tools...

    Node (https://nodejs.org/)
    NPM (https://www.npmjs.com/)
    Grunt (http://gruntjs.com/)
    Bower (http://bower.io/)
    Yeoman (http://yeoman.io/)

##### Version Checks...

    # Checking Node Installation
    $ node --version
    v0.12.7

    # Checking NPM Installation
    $ npm --version
    2.11.3

    # Checking Grunt and Grunt-CLI Installation
    $ grunt --version
    grunt-cli v0.1.13
    grunt v0.4.5

    # Checking Bower Installation
    $ bower --version
    1.4.1

    # Checking Yeoman Installation
    $ yo --version
    1.4.6

    # Checking Firebase-CLI Installation
    $ firebase --version
    Firebase Command Line Tools
    Version 1.2.0


##### Setup...

    # Clone BaseStation Repository
    git clone https://github.com/Copyleft-io/basestation.git

    # Install NPM Modules
    npm install

    # Install Bower Components
    bower install

    # Update FIREBASE_URL in app.js to point to your Firebase...
    .constant('FIREBASE_URL', 'https://<yourapp>.firebaseio.com/');


##### Build... Serve... Deploy...

    # Grunt is used to concat dependencies (css, js) and construct a build in /dist
    grunt build

    # Grunt is used to serve the application on localhost:4000/#/
    grunt serve

    # Firebase-CLI is used to push the Application /dist to Firebase Hosting
    # Configuration is set in firebase.json
    # Hosting URl: https://<yourapp>.firebaseapp.com/#/
    firebase deploy
