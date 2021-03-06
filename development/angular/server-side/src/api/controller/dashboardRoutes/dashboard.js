const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/', auth.authController, async (req, res) => {
    try {
        logger.info('--- dashboard details api ---');
        const_data['getParams']['Key'] = 'static/landing_page_metrics.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.send(err);
            } else if (!data) {
                logger.info("Something went wrong or s3 file not found");
                res.send("Something went wrong or s3 file not found");
            } else {
                let dashboardData = data.Body.toString();
                dashboardData = JSON.parse(dashboardData);

                let dashboardResult = {
                    attendance: {
                        title: "Attendance",
                        data: [{
                            metric: dashboardData[7].metric,
                            value: dashboardData[7].value + " %"
                        }]
                    },
                    crc: {
                        title: "CRC",
                        data: [{
                            metric: dashboardData[4].metric,
                            value: dashboardData[4].value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                        }, {
                            metric: dashboardData[8].metric,
                            value: parseFloat(dashboardData[8].value).toFixed(2)
                        }]
                    },
                    schools: {
                        title: "Schools",
                        data: [{
                            metric: dashboardData[3].metric,
                            value: dashboardData[3].value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                        }, {
                            metric: dashboardData[6].metric,
                            value: dashboardData[6].value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                        }, {
                            metric: 'Average Schools',
                            value: (parseFloat(dashboardData[3].value / dashboardData[6].value) * 100).toFixed(2) + ' %'
                        }]
                    },
                    inspection_rate: {
                        title: "Individual Inspection Rate",
                        data: [{
                            metric: dashboardData[0].metric,
                            value: parseFloat(dashboardData[0].value).toFixed(2)
                        }, {
                            metric: dashboardData[1].metric,
                            value: parseFloat(dashboardData[1].value).toFixed(2)
                        }]
                    },
                    students: {
                        title: "Students",
                        data: [{
                            metric: dashboardData[5].metric,
                            value: dashboardData[5].value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                        }]
                    },
                    average_inspection: {
                        title: "Average Inspection",
                        data: [{
                            metric: dashboardData[2].metric,
                            value: parseFloat(dashboardData[2].value).toFixed(2)
                        }]
                    }
                }
                logger.info('--- dashboard details api response sent ---');
                res.send(dashboardResult);
            }
        })
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
})

module.exports = router;