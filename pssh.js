/*jshint esversion: 6 */

// Logic to perform PSSH calculation

const fs            = require('fs');
const path          = require('path');
const dir           = path.join(__dirname, 'private');
const childProcess  = require('child_process');

// If private dir in root doesn't exist, make it!
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

module.exports = function(options) {

    // options :
    // {
    //   sequence   : String,
    //   md5        : String
    // }

    const tempDir = path.join(dir, options.md5);

    if (!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir);
        var stream = fs.createWriteStream(path.join(tempDir, "query.fasta"));
        return stream.once('open', function() {
            stream.write(">" + options.md5 +"\n");
            stream.write(options.sequence);
            stream.end();

            const pssh = childProcess.spawn('pssh2_seq', {
                cwd: tempDir
            });

            pssh.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            return pssh.on('close', function(code){
                if(code === 0){
                    console.log('Calculated PSSH', options.md5);
                } else {
                    console.error('Failed to calculate PSSH', options.md5);
                }
            });
        });
    } else {
        return console.error('Failed to calculate PSSH, temp folder already exists', options.md5);
    }
};