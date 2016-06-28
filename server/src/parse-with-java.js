const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const Q = require('q');
const request = require("request");
const siteSource = require('../resources/campsite-names.json');

const statusRegex = "(FULL|\\d|NA)";
const initialStatusRegex = statusRegex + statusRegex + statusRegex + statusRegex + statusRegex + statusRegex;
const siteIdRegex = "([\\d]{2,3}[A-Za-z]{0,2}-?\\d?)";
const lastSnowDateRegex = "(\\d\\d?/\\d\\d)";
const statusLineRegex = "^" + initialStatusRegex + lastSnowDateRegex + "\\d+.?\\d?\\w+\\s?[[A-Za-z ()/-]+" + siteIdRegex + "\\s" + statusRegex + "$";
const dateRegex = "(\\d{1,2}\\/\\d{1,2}\\/\\d{4})";
const dateLineRegex = "^" + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + "\\s" + dateRegex + "$";

function fetchedAndParseTheHardWay() {
    /*
     https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback

     curl -o ~/personal-projects/rmnp-camping/server/resources/campsite_availability_list.pdf https://www.nps.gov/webcams-romo/campsite_availability_list.pdf
     java -jar pdfbox-app-2.0.2.jar ExtractText ~/personal-projects/rmnp-camping/server/resources/campsite_availability_list.pdf


     const exec = require('child_process').exec;
     exec('cat *.js bad_file | wc -l', (error, stdout, stderr) => {
     java -jar pdfbox-app-2.0.2.jar ExtractText ~/personal-projects/rmnp-camping/server/resources/campsite_availability_list.pdf
     */
    const curlCommand = 'curl -o ~/personal-projects/rmnp-camping/server/resources/campsite_availability_list.pdf https://www.nps.gov/webcams-romo/campsite_availability_list.pdf';
    const javaCommand = 'java -jar ~/personal-projects/rmnp-camping/server/resources/pdfbox-app-2.0.2.jar ExtractText ~/personal-projects/rmnp-camping/server/resources/campsite_availability_list.pdf';
    const exec = require('child_process').exec;
    var deferred = Q.defer();
    exec(curlCommand, (error, stderr, stdout ) => {
        if (!error && stderr == "") {
            console.log('fetched file');
            exec(javaCommand, (error, stderr, stdout) => {
                if (!error && stderr == "") {
                    console.log('parsed file');
                    deferred.resolve();
                } else {
                    deferred.reject(new Error(error));
                }
            });
        } else {
            deferred.reject(new Error(error));
        }
    });
    return deferred.promise;
}

function readFile(fileName) {
    var deferred = Q.defer();
    //noinspection JSUnresolvedFunction
    fs.readFile(fileName, "utf-8", function (error, text) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(text);
        }
    });
    return deferred.promise;
}

fetchedAndParseTheHardWay().then(() => {
    readFile("./resources/campsite_availability_list.txt").then((data) => {
        const cgSites = _.map(siteSource, (site) => {
            site.status = [];
            return site;
        });
        const allDates = [];

        /*
         Parse file and pull out campsite status and the dates; its all jumbled.
         */
        const lines = data.split('\n');
        _.each(lines, (line) => {
            const status = line.match(statusLineRegex);
            if (status) {
                const site = cgSites.find((site) => {
                    return site.id === status[8]
                });
                if (!site) {
                    console.error(`Could not find site: ${status[8]}`)
                } else {
                    site.status.push(status.slice(1, 7).concat(status[9]));
                    site['last_snow'] = status[7];
                }
            } else {
                const dates = line.match(dateLineRegex);
                if (dates) {
                    Array.prototype.push.apply(allDates, dates.slice(1, 8));
                }
            }
        });

        /*
         transform the array of statuses into statuses with dates.
         */
        _.each(cgSites, (site) => {
            var dateIdx = 0;
            site.status = _.reduce(_.flatten(site.status), (acc, status) => {
                acc.push({date: allDates[dateIdx], status: status});
                dateIdx++;
                return acc;
            }, []);
        });

        // should be 21 weeks worth
        // console.log(cgSites[0].status.length == 21);
        // console.log(util.inspect(cgSites[0]));
        const fileData = {cgSiteData: cgSites, allDates: allDates};
        const outputFile = '../client/public/campsite-status.json';
        fs.writeFileSync(outputFile, JSON.stringify(fileData));
        console.log(`wrote ${outputFile}`);
    }, console.error);
});


function fetchFile() {
    var deferred = Q.defer();
    request("https://www.nps.gov/webcams-romo/campsite_availability_list.pdf", function (error, response, body) {
        if (!error) {
            // parseMyAwesomeHtml(body);
            // write to file or return as a stream
        } else {
            deferred.reject(new Error(error));
        }
    });
    return deferred.promise;
}

