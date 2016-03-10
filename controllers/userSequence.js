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
                console.error("Error while getting sequence via MD5");
                return response.status(500).send(error);
            });
        },
        generatePSSH: function(request, response) {
            const sequence = request.body.sequence;
            const email = request.body.email;

            try {
                const md5 = context.crypto.createHash('md5').update(sequence).digest('hex');
            } catch (error) {
                console.error("Could not generate MD5 hash");
                return response.status(500).send("could not generate MD5 hash");
            }

            userSequenceDao.insertInProteinSequenceUpload(email, sequence, md5).then(function(data){
                return response.status(201).send(data);
            }, function(error){
                console.error("Error while trying to insert sequence");
                return response.status(500).send(error);
            });
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
                console.error("Error while getting sequence");
                return response.status(500).send(error);
            });
        }
    };
};