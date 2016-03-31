# pssh-parser [![Build Status](https://travis-ci.org/sacdallago/pssh.svg?branch=master)](https://travis-ci.org/sacdallago/pssh)
A basic webservice for submitting PSSH calculations
***

## Prerequisites
You will need to have `pssh2` installed on your system, so that node can call the command when a new job is submitted.

## How to configure and run
1. First you need to clone this repository
2. If you don't have them already, generate an SSL certificate an key for the node instance to use. The best approach for this is to follow the instructions in the readme in the `certificates` folder.
3. Copy the `configuration.js.template` file to `configuration.js` and change the values of `mysql`, `email` and `security` according to your necessities.
4. `cd` into the repository and `npm install` all dependencies.
5. Run `./deploy.sh` to make the instance run in the background as a _forever_ process. Otherwise `node app` to run the application in the current bash window.

## What comes with it
You can find all the possible calls in the `services` folder, in separate files as the respective tables are on the database.

For now, you can:

- GET `/api/sequence/:sequence`: Returns the entry from `protein_sequence_unified` if `:sequence` matches an entry, or error instead.
   - 200, Success: 
     ```javascript
      {
        "data": [
          {
            "Primary_Accession": null,
            "Sequence": "testest",
            "MD5_Hash": "c3add7b94781ee70ec7c817c79f7b7bd",
            "Description": null,
            "Length": 7,
            "pssh_finished": 0
          }
        ],
        "count": 1
      }
     ```
