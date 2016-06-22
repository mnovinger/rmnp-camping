const _ = require('lodash');
const pdfUtil = require('pdf-to-text');
const Promise = require('promise');

const cgSites = require('./../../resources/campsite-names.json');
const statusRegex = '(\\S*)\\s*(\\S*)\\s*(\\S*)\\s*(\\S*)\\s*(\\S*)\\s*(\\S*)\\s*(\\S*)$';
const mileageAndElevationRegEx = '\\s(\\d\\.\\d|\\d)\\s{2,4}(\\d+)';
const mileageAndStatusRegex = mileageAndElevationRegEx+'\\s{12,15}(\\d+\\/\\d\\d)\\s{7}'+statusRegex;
const campSiteIdRegEx = '^(\\d\\S*)\\b';

const util = require('util');


var parsePage = (page) => {
    var options = {from: page, to: page};

    return new Promise((resolve, reject) => {
        pdfUtil.pdfToText('./resources/campsite_availability_list-06-16-2016.pdf',function (err, data) {
            if (err)
                reject(err);
            else {
                console.log(data);
                var lines = data.split('\n');
                resolve(lines);
            }
        });
    });
};

parsePage(3).then((lines) => {
    var allStatuses = _.reduce(lines, (acc, line) => {
        const cgData = line.match(mileageAndStatusRegex);
        if (cgData) {
            acc.push({
                mileage: cgData[1],
                elevation: cgData[2],
                lastSnowDate: cgData[3],
                status: cgData.slice(4,11)
            });
        }
        return acc;
    }, []);

    var allCgsStatus = _.reduce(lines, (acc, line) => {
        const cgIdAndName = line.match(campSiteIdRegEx);
        if (cgIdAndName) {
            const id = cgIdAndName[1];
            const name = cgSites.find((site) => {return site.id == id}).name;
            const data =  allStatuses.shift();
            acc.push(Object.assign({
                id,
                name
            }, data))
        }
        return acc;
    }, []);

    debugger;
}, (err) => {
    console.error(err);
});