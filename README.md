# The Molecular Playground
A web server and interface to The Molecular Playground, a molecular and
proteomic visualization program.

## Getting Started
This guide is intended for users running Debian-based distributions of Linux
only (e.g. [L/X/Ed]Ubuntu, Kali, Tails, etc.), mainly due to its usage of the
apt-get package.

### Starting the Server
- If you don't already have node.js installed, run `sudo apt-get install nodejs`
- If you don't already have npm installed, run `sudo apt-get install npm`
- Navigate to the repository's root folder via the terminal
- Execute the command './run-production-server.sh'

### Server is Running
- After the server has started, it will be listening for HTTP requests on port 3000
- Open any web browser and navigate to the address `http://localhost:3000`
- You should then be redirected to the "index" page
- You should now be at the home page of the web interface

### Using the Playground
 - In order to view the playrgound as a content author choose "sign up" from the home page navigation menu
    - create an account with username = "user"
 - In order to view the plargound as a global admin choose "log in" from the home page navigation menu
    - create an account with username = "admin"
