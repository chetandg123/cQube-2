var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');

const frequencyData = () => {
    return new Promise((resolve, reject) => {
        try {
            const_data['getParams']['Key'] = 'CRC/crc_frequency_scatter.json'
            const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
                if (err) {
                    logger.error(err);
                    resolve([]);
                } else if (!data) {
                    logger.error("No data found in s3 file");
                    resolve([]);
                } else {
                    let crcData = data.Body.toString();
                    crcData = JSON.parse(crcData);
                    resolve(crcData)
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

const crcMetaData = () => {
    return new Promise((resolve, reject) => {
        try {
            const_data['getParams']['Key'] = 'CRC/crc_metadata.json'
            const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
                if (err) {
                    logger.error(err);
                    resolve([]);
                } else if (!data) {
                    logger.error("No data found in s3 file");
                    resolve([]);
                } else {
                    let crcData = data.Body.toString();
                    crcData = JSON.parse(crcData);
                    resolve(crcData)
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    frequencyData,
    crcMetaData
}