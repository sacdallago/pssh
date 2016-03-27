/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Daos
    const proteinSequenceUserDao = context.component('daos').module('proteinSequenceUser');
    const psshUserDao = context.component('daos').module('psshUser');

    // Internal functions
    const spawnPSSH = function(sequence){
        const sleep = context.childProcess.spawn('sleep', ['10']);

        sleep.on('close', (code) => {
            if(code === 0){
                console.log('Calculated PSSH', sequence);
            } else {
                console.error('Failed to calculate PSSH', sequence);
            }
        });
        return;
    };

    return {
        psshFromSequence: function(request, response) {
            if(request.is("application/x-www-form-urlencoded") || request.is("application/json") ) {
                const sequence = request.body.sequence;
                const email = request.body.email;

                try {
                    const md5 = context.crypto.createHash('md5').update(sequence).digest('hex');
                    proteinSequenceUserDao.insertInProteinSequenceUpload(email, sequence, md5).then(function(data){
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
                        proteinSequenceUserDao.insertInProteinSequenceUpload(email, sequence, md5).then(function(data){
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
                return response.status(403).send("Allowed calls include:\n"+
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
                    const fasta = files.fasta;
                    const pssh = files.pssh;

                    if(!email || !fasta){
                        return response.status(403).send("Allowed calls include:\n"+
                                                         "- multipart/form-data\n"+
                                                         "With attributes 'email', 'fasta' and optional 'pssh'\n"+
                                                         "If sending fasta + pssh files, only one sequence can be present in the fasta file."
                                                        );
                    }

                    context.fs.readFile(fasta.path, 'utf8', function (fastaError, fastaData) {
                        if (fastaError) {
                            return response.status(500).send({
                                message: "Internal Server error when reading Fasta file."
                            });
                        }

                        var sequences = [];

                        try {
                            sequences = context.biojs.parse(fastaData);
                        } catch (err) {
                            console.error("Could not generate MD5 hash");
                            return response.status(500).send("Could not generate MD5 hash");
                        }

                        if(pssh){
                            if(sequences.length != 1){
                                return response.status(403).send("Allowed calls include:\n"+
                                                                 "- multipart/form-data\n"+
                                                                 "With attributes 'email', 'fasta' and optional 'pssh'\n"+
                                                                 "If sending fasta + pssh files, only one sequence can be present in the fasta file."
                                                                );
                            } else {
                                // Try to insert FASTA here, then if inserted, go on.
                                context.fs.readFile(pssh.path, 'utf8', function (psshError, psshData) {
                                    if(psshError){
                                        return response.status(500).send({
                                            message: "Internal Server error when reading pssh2 file."
                                        });
                                    } else {
                                        var psshArray = context.psshParser.parsePSSH2file(psshData);
                                        // Insert sequence with pssh_calculated = 1 + insert PSSH

                                        psshArray = psshArray.map(function(element){
                                            return [
                                                element.protein_sequence_hash,
                                                element.PDB_chain_hash,
                                                element.Repeat_domains,
                                                element.E_value,
                                                element.Identity_Score,
                                                element.Match_length,
                                                element.Alignment
                                            ];
                                        });
                                        psshUserDao.insertInPSSHUser(psshArray).then(function(data){
                                            return response.status(201).send(data);
                                        }, function(error){
                                            console.error("Error while trying to insert pssh:");
                                            console.error(error.code);
                                            return response.status(500).send(error);
                                        });
                                    }
                                });

                            }
                        } else {
                            var promises = [];

                            sequences.forEach(function(sequence){
                                var deferred = context.promises.defer();
                                promises.push(deferred.promise);

                                const seq  = sequence.seq.replace(new RegExp("[\\*|\\s]", 'g'), "");
                                if(seq.length < 1){
                                    deferred.resolve({
                                        md5: undefined,
                                        sequence: undefined,
                                        error: "Not able to parse sequence"
                                    });
                                } else {
                                    const md5 = context.crypto.createHash('md5').update(seq).digest('hex');
                                    const description = sequence.name;

                                    proteinSequenceUserDao.insertInProteinSequenceUpload(email, seq, md5, description).then(function(data){
                                        deferred.resolve({
                                            md5: md5,
                                            sequence: seq
                                        });
                                        spawnPSSH({
                                            sequence: seq
                                        });
                                    }, function(error){
                                        deferred.resolve({
                                            md5: md5,
                                            sequence: seq,
                                            error: error
                                        });
                                    });   
                                }
                            });
                            context.promises.all(promises).then(function(results) {
                                return response.status(200).send({
                                    succesful: results.filter(function(element){
                                        return undefined === element.error;
                                    }),
                                    unsuccesful: results.filter(function(element){
                                        return element.error !== undefined;
                                    })
                                });
                            });
                        }
                    });
                });
            } else {
                return response.status(403).send("Allowed calls include:\n"+
                                                 "- multipart/form-data\n"+
                                                 "With attributes 'email', 'fasta' and optional 'pssh'\n"+
                                                 "If sending fasta + pssh files, only one sequence can be present in the fasta file."
                                                );
            }
        }
    };
};