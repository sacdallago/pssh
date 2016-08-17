/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Controllers
    const proteinSequenceUserController = context.component('controllers').module('proteinSequenceUser');

    // Routes
    context.router
        /**
         * @api {post} /sequence Submit a sequence to the database in the `user_sequences` table
         * @apiVersion 0.1.0
         * @apiName postSequence
         * @apiGroup Post
         * @apiDescription Inserts a sequence to be processes via PSSH. The calls can be formatted as `multipart/form-data`, `application/x-www-form-urlencoded` or `application/json`.
         * @apiSuccess {Object} nested An Object.
         * @apiParam {String} nested.email Email of the submitter.
         * @apiParam {String} nested.sequence Sequence to be uploaded
         * @apiParam {Binary} nested.pssh [OPTIONAL] pssh calculation of `sequence` with corresponding md5 hash.
         *
         * @apiHeader {String} token The `token` neccessary to perform POST requests, defined in the configuration.js
         *
         * @apiSuccessExample {json} Created
         *HTTP/1.1 201
         *{
         *  "fieldCount": 0,
         *  "affectedRows": 1,
         *  "insertId": 0,
         *  "serverStatus": 2,
         *  "warningCount": 0,
         *  "message": "",
         *  "protocol41": true,
         *  "changedRows": 0
         *}
         * @apiError (422) UnprocessableEntity Most likely duplicate entry, see example below
         * @apiErrorExample {json} UnprocessableEntity 
         *HTTP/1.1 422
         *{
         *  "code": "ER_DUP_ENTRY",
         *  "errno": 1062,
         *  "sqlState": "23000",
         *  "index": 0
         *}
         * @apiError (415) UnsuportedMediaType Wrong method. Allowed methods: `multipart/form-data`, `application/x-www-form-urlencoded` or `application/json`.
         * @apiError (401) Unauthorized Wrong or not token.
         * @apiError (500) InternalServerError Internal node error.
         */
        .post('/sequence', proteinSequenceUserController.psshFromSequence)
        /**
         * @api {post} /sequence Submit a sequence to the database in the `user_sequences` table
         * @apiVersion 0.1.0
         * @apiName postSequence
         * @apiGroup Post
         * @apiDescription Inserts a sequence to be processes via PSSH. The calls can be formatted as `multipart/form-data`, `application/x-www-form-urlencoded` or `application/json`.
         * @apiSuccess {Object} nested An Object.
         * @apiParam {String} nested.email Email of the submitter.
         * @apiParam {String} nested.sequence Sequence to be uploaded
         * @apiParam {Binary} nested.pssh [OPTIONAL] pssh calculation of `sequence` with corresponding md5 hash.
         *
         * @apiHeader {String} token The `token` neccessary to perform POST requests, defined in the configuration.js
         *
         * @apiSuccessExample {json} Created
         *HTTP/1.1 201
         *{
         *  "fieldCount": 0,
         *  "affectedRows": 1,
         *  "insertId": 0,
         *  "serverStatus": 2,
         *  "warningCount": 0,
         *  "message": "",
         *  "protocol41": true,
         *  "changedRows": 0
         *}
         * @apiError (422) UnprocessableEntity
         * @apiErrorExample {json} UnprocessableEntity
         *HTTP/1.1 422
         *{
         *  "code": "ER_DUP_ENTRY",
         *  "errno": 1062,
         *  "sqlState": "23000",
         *  "index": 0
         *}
         * @apiError (415) UnsuportedMediaType
         * @apiError (401) Unauthorized
         * @apiError (500) InternalServerError
         */
        .post('/fasta', proteinSequenceUserController.psshFromFasta);
};