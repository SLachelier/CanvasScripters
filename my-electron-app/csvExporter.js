// csvExporter.js
const fs = require('fs');
const path = require('path');

function exportToCSV(data, fileName = 'MyCSV') {
    console.log('writing to file');
    let csvHeaders = [];

    const wStream = fs.createWriteStream(`${path.join(__dirname, fileName)}.csv`, { flags: 'a' });

    try {
        console.log('Geting headers');
        if (csvHeaders.length === 0) {
            for (const [key, value] of Object.entries(data[0])) {
                if ((typeof value === 'object') && value != null) {
                    csvHeaders.push(...Object.keys(value));
                } else {
                    csvHeaders.push(key);
                }
            }
        }
        //console.log(csvHeaders);
        csvHeaders = csvHeaders.join();
        console.log('Writing headers');
        wStream.write(csvHeaders + '\n');

        console.log('Getting Rows');
        for (const element of data) {
            //console.log('Writing Row');
            let csvRow = [];
            let newRow = '';
            for (const value of Object.values(element)) {
                if ((typeof value === 'object') && value != null) {
                    csvRow.push(...Object.values(value));
                } else {
                    csvRow.push(`"${value}"`);
                }

            }
            newRow = csvRow.join();
            wStream.write(newRow + '\n');
        }
    } catch (error) {
        console.log('There was an error', error.message);
    }
    wStream.end();
    console.log('Finished writing');
}

// (async () => {
//     const response = await axios.get('https://ckruger.instructure.com/api/v1/users/26/page_views?start_time=2023-02-15&end_time=2023-02-16');
//     exportToCSV(response.data);
// })();

module.exports = {
    exportToCSV
};
