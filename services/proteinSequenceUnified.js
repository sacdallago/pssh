/*
 *  Protein Sequence Unified Service
 *
 *  Created by Christian Dallago on 20160327 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Controllers
    const proteinSequenceUnifiedController = context.component('controllers').module('proteinSequenceUnified');

    // Routes
    context.router
        /**
         * @api {get} /md5/:md5 Request protein sequence information
         * @apiVersion 0.1.0
         * @apiName getMd5
         * @apiGroup Get
         * @apiDescription Returns the entry from `protein_sequence_unified` if `:md5` matches an entry, or error instead.
         * @apiParam {String} md5 Protein sequence MD5 hash.
         *
         * @apiSuccessExample {json} Success Response No Pssh
         *HTTP/1.1 200
         *{
         *  "data": [
         *    {
         *       "Primary_Accession": null,
         *       "Sequence": "acb",
         *       "MD5_Hash": "hash",
         *       "Description": null,
         *       "Length": 3,
         *      "pssh_finished": 0
         *    }
         *  ],
         *  "count": 1
         *}
         * @apiSuccessExample {json} Success Response has Pssh
         *HTTP/1.1 200
         *{
         *  "data": [
         *    {
         *       "Primary_Accession": "123",
         *       "Sequence": "acb",
         *       "MD5_Hash": "hash",
         *       "Description": "abc",
         *       "Length": 3,
         *      "pssh_finished": 1
         *    }
         *  ],
         *  "count": 1
         *}
         * @apiError (404) NotFound No data for the given protein found.
         * @apiErrorExample {json} NotFound
         *HTTP/1.1 404
         *{
         *  "data": [],
         *  "count": 0
         *}
         * @apiError (500) InternalServerError Internal node error.
         */
        .get('/md5/:md5', proteinSequenceUnifiedController.getMD5)
                /**
         * @api {get} /sequence/:sequence Request protein sequence information
         * @apiVersion 0.1.0
         * @apiName getSequence
         * @apiGroup Get
         * @apiDescription Returns the entry from `protein_sequence_unified` if `:sequence` matches an entry, or error instead.
         * @apiParam {String} sequence Protein sequence.
         *
         * @apiSuccessExample {json} Success Response No Pssh
         *HTTP/1.1 200
         *{
         *  "data": [
         *    {
         *       "Primary_Accession": null,
         *       "Sequence": "acb",
         *       "MD5_Hash": "hash",
         *       "Description": null,
         *       "Length": 3,
         *      "pssh_finished": 0
         *    }
         *  ],
         *  "count": 1
         *}
         * @apiSuccessExample {json} Success Response has Pssh
         *HTTP/1.1 200
         *{
         *  "data": [
         *    {
         *       "Primary_Accession": "123",
         *       "Sequence": "acb",
         *       "MD5_Hash": "hash",
         *       "Description": "abc",
         *       "Length": 3,
         *      "pssh_finished": 1
         *    }
         *  ],
         *  "count": 1
         *}
         * @apiError (404) NotFound No data for the given protein found.
         * @apiErrorExample {json} NotFound
         *HTTP/1.1 404
         *{
         *  "data": [],
         *  "count": 0
         *}
         * @apiError (500) InternalServerError Internal node error.
         */
        .get('/sequence/:sequence', proteinSequenceUnifiedController.getSequence);
};