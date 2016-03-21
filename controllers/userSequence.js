/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Daos
    const userSequenceDao = context.component('daos').module('userSequence');

    return {
        getMD5: function(request, response) {
            const md5 = request.params.md5;
            userSequenceDao.findByMD5(md5).then(function(data){
                if(data.length < 1){
                    return response.status(404).send({
                        data: [],
                        count: 0
                    });
                } else {
                    return response.status(200).send({
                        data: data,
                        count: data.length
                    });
                }
            }, function(error){
                console.error("Error while getting sequence via MD5:");
                console.error(error.code);
                return response.status(500).send(error);
            });
        },
        psshFromSequence: function(request, response) {
            if(request.is("application/x-www-form-urlencoded") || request.is("application/json") ) {
                const sequence = request.body.sequence;
                const email = request.body.email;

                try {
                    const md5 = context.crypto.createHash('md5').update(sequence).digest('hex');
                    userSequenceDao.insertInProteinSequenceUpload(email, sequence, md5).then(function(data){
                        return response.status(201).send(data);
                    }, function(error){
                        console.error("Error while trying to insert sequence:");
                        console.error(error.code);
                        return response.status(500).send(error);
                    });
                } catch (err) {
                    console.error("Could not generate MD5 hash");
                    return response.status(500).send("Could not generate MD5 hash");
                }
            } else if(request.is('multipart/form-data')) {
                const formidable = context.formidable;
                const form = new formidable.IncomingForm();

                form.parse(request, function(error, fields, files) {
                    const sequence = fields.sequence;
                    const email = fields.email;

                    try {
                        const md5 = context.crypto.createHash('md5').update(sequence).digest('hex');
                        userSequenceDao.insertInProteinSequenceUpload(email, sequence, md5).then(function(data){
                            return response.status(201).send(data);
                        }, function(error){
                            console.error("Error while trying to insert sequence:");
                            console.error(error.code);
                            return response.status(500).send(error);
                        });
                    } catch (err) {
                        console.error("Could not generate MD5 hash");
                        return response.status(500).send("Could not generate MD5 hash");
                    }
                });
            } else {
                return response.status(500).send("Allowed calls include:\n"+
                                                 "- multipart/form-data\n"+
                                                 "- application/x-www-form-urlencoded\n"+
                                                 "- application/json"
                                                );
            }
        },
        psshFromFasta: function(request, response) {
            if(request.is('multipart/form-data')) {
                const formidable = context.formidable;
                const form = new formidable.IncomingForm();

                form.parse(request, function(error, fields, files) {
                    const email = fields.email;

                    try {
                        var sequences = context.biojs.parse(textFile);
                        sequences.forEach(function(sequence){
                            const seq  = sequence.seq.replace(new RegExp("[\\*|\\s]", 'g'), "");
                            const md5 = context.crypto.createHash('md5').update(seq).digest('hex');

                            userSequenceDao.insertInProteinSequenceUpload(email, seq, md5).then(function(data){
                                return response.status(201).send(data);
                            }, function(error){
                                console.error("Error while trying to insert sequence:");
                                console.error(error.code);
                                return response.status(500).send(error);
                            });
                        });

                    } catch (err) {
                        console.error("Could not generate MD5 hash");
                        return response.status(500).send("Could not generate MD5 hash");
                    }
                });
            } else {
                return response.status(500).send("Allowed calls include:\n"+
                                                 "- multipart/form-data\n"
                                                );
            }
        },
        getSequence: function(request,response){
            const sequence = request.params.sequence;
            userSequenceDao.findBySequence(sequence).then(function(data){
                if(data.length < 1){
                    return response.status(404).send({
                        data: [],
                        count: 0
                    });
                } else {
                    return response.status(200).send({
                        data: data,
                        count: data.length
                    });
                }
            }, function(error){
                console.error("Error while getting sequence:");
                console.error(error.code);
                return response.status(500).send(error);
            });
        }
    };
};