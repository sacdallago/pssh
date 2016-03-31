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
             "Primary_Accession": null|"123",
             "Sequence": "acb",
             "MD5_Hash": "hash",
             "Description": null|"abc",
             "Length": 3,
             "pssh_finished": 0|1
           }
        ],
        "count": 1
      }
     ```
   - 404, Not Found:

     ```javascript
      {
        "data": [],
        "count": 0
      }
     ```
     
   - 500, Internal Server Error.
-  GET `/api/md5/:md5`: Returns the entry from `protein_sequence_unified` if `:md5` matches an entry, or error instead. Same as above
-   POST `/api/sequence`: Inserts a sequence to be processes via PSSH. The calls can be formatted as `multipart/form-data`, `application/x-www-form-urlencoded` or `application/json`, and the body should be as:

   ```javascript
      {
        "sequence": "abc",
        "email": "email@domain.com"
      }
     ```
     Possible returns include
   - 201, Created:
   
      ```javascript
      {
         "fieldCount": 0,
         "affectedRows": 1,
         "insertId": 0,
         "serverStatus": 2,
         "warningCount": 0,
         "message": "",
         "protocol41": true,
         "changedRows": 0
      }
     ```
   - 422, Unprocessable Entity:
   
      ```javascript
      {
        "code": "ER_DUP_ENTRY",
        "errno": 1062,
        "sqlState": "23000",
        "index": 0
      }
     ```
   - 415, Unsuported Media Type.
   - 500, Internal Server Error.
- POST `/api/fasta`: Inserts (a) sequence(s) to be processes via PSSH or one sequence and it's calculated PSSH. The calls can only be formatted as `multipart/form-data`, and the body should be as:
      ```javascript
        {
         "sequence": "abc",
         "email": "email@domain.com"
         }
      ```
Possible returns include
     
   - 415, Unsuported Media Type.
   - 500, Internal Server Error.
