package com.mattnovinger.apps.rmnpcamping;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collection;

public class AvailabilityParser {
    /**
     *   const cgSites = _.map(siteSource, (site) => {
            site.status = [];
            return site;
         });
         const allDates = [];


         //Parse file and pull out campsite status and the dates; its all jumbled.

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


             //transform the array of statuses into statuses with dates.

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
        const outputFile = '../client/campsite-status.json';
        fs.writeFileSync(outputFile, JSON.stringify(fileData));
        console.log(`wrote ${outputFile}`);

     */
    public void parseAvailability() throws IOException {
        Gson gson = new Gson();
        byte[] bytes = Files.readAllBytes(Paths.get("/Users/mnovinger/personal-projects/rmnp-camping/java-server/src/main/resources/campsite-names.json"));
        Type campSiteType = new TypeToken<Collection<CampSite>>(){}.getType();
        Collection<CampSite> campSites = gson.fromJson(new String(bytes, Charset.defaultCharset()), campSiteType);
        System.out.println();
    }
}
