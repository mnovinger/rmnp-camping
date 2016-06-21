const fs = require('fs');
const _ = require('lodash');
const Q = require('q');
const cgSites = require('./../resources/campsite-names.json');

// const regex = '^(FULL|\\d|NA)(FULL|\\d|NA)(FULL|\\d|NA)(FULL|\\d|NA)(FULL|\\d|NA)(FULL|\\d|NA)(\\d\\d?/\\d\\d).*(FULL|\\d|NA)$';
var statusRegex = "(FULL|\\d|NA)";
var initialStatusRegex = statusRegex + statusRegex + statusRegex + statusRegex + statusRegex + statusRegex;
var siteIdRegex = "([\\d]{2,3}[A-Za-z]{0,2}-?\\d?)";
const regex = "^" + initialStatusRegex + "(\\d\\d?/\\d\\d)\\d+.?\\d?\\w+\\s?[[A-Za-z ()/-]+" + siteIdRegex + "\\s"+statusRegex+"$";

function readFile() {
    var deferred = Q.defer();

    fs.readFile("resources/campsite_availability_list-06-16-2016.txt", "utf-8", function (error, text) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(text);
        }
    });
    return deferred.promise;
}


readFile().then((data) => {
    const lines = data.split('\n');
    const allStatus = _.reduce(lines, (acc, line) => {
        const status = line.match(regex);
        if (status) {
            const site = cgSites.find((site) => {return site.id === status[8]});
            if (!site) {
                debugger;
            }
            acc.push({site: site, status:status});
        }
        return acc;
    },[]);
    // should be 20 weeks worth
    console.log(allStatus.length == 2814);
});