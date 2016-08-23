package com.mattnovinger.apps.rmnpcamping;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class AvailabilityParser {
    private static final String statusRegex = "(FULL|\\d|NA)";
    private static final String initialStatusRegex = statusRegex + statusRegex + statusRegex + statusRegex + statusRegex + statusRegex;
    private static final String siteIdRegex = "([\\d]{2,3}[A-Za-z]{0,2}-?\\d?)";
    private static final String lastSnowDateRegex = "(\\d\\d?/\\d\\d)";
    private static final String elevationAndDistanceRegex = "\\d+.?\\d?\\w+\\s?[A-Za-z ()/-]+";

    private static final Pattern statusLineRegex = Pattern.compile("^" + initialStatusRegex + lastSnowDateRegex + elevationAndDistanceRegex + siteIdRegex + "\\s" + statusRegex);

    private static final String dateRegex = "(\\d{1,2}\\/\\d{1,2}\\/\\d{4})";
    private static final Pattern dateLineRegex = Pattern.compile("^" + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + "\\s" + dateRegex + "$");

    /**
     * const statusRegex = "(FULL|\\d|NA)";
     * const initialStatusRegex = statusRegex + statusRegex + statusRegex + statusRegex + statusRegex + statusRegex;
     * const siteIdRegex = "([\\d]{2,3}[A-Za-z]{0,2}-?\\d?)";
     * const lastSnowDateRegex = "(\\d\\d?/\\d\\d)";
     * const statusLineRegex = "^" + initialStatusRegex + lastSnowDateRegex + "\\d+.?\\d?\\w+\\s?[[A-Za-z ()/-]+" + siteIdRegex + "\\s" + statusRegex + "$";
     * const dateRegex = "(\\d{1,2}\\/\\d{1,2}\\/\\d{4})";
     * const dateLineRegex = "^" + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + "\\s" + dateRegex + "$";
     * <p>
     * const cgSites = _.map(siteSource, (site) => {
     * site.status = [];
     * return site;
     * });
     * const allDates = [];
     * <p>
     * <p>
     * //Parse file and pull out campsite status and the dates; its all jumbled.
     * <p>
     * const lines = data.split('\n');
     * _.each(lines, (line) => {
     * const status = line.match(statusLineRegex);
     * if (status) {
     * const site = cgSites.find((site) => {
     * return site.id === status[8]
     * });
     * if (!site) {
     * console.error(`Could not find site: ${status[8]}`)
     * } else {
     * site.status.push(status.slice(1, 7).concat(status[9]));
     * site['last_snow'] = status[7];
     * }
     * } else {
     * const dates = line.match(dateLineRegex);
     * if (dates) {
     * Array.prototype.push.apply(allDates, dates.slice(1, 8));
     * }
     * }
     * });
     * <p>
     * <p>
     * //transform the array of statuses into statuses with dates.
     * <p>
     * _.each(cgSites, (site) => {
     * var dateIdx = 0;
     * site.status = _.reduce(_.flatten(site.status), (acc, status) => {
     * acc.push({date: allDates[dateIdx], status: status});
     * dateIdx++;
     * return acc;
     * }, []);
     * });
     * <p>
     * // should be 21 weeks worth
     * // console.log(cgSites[0].status.length == 21);
     * // console.log(util.inspect(cgSites[0]));
     * const fileData = {cgSiteData: cgSites, allDates: allDates};
     * const outputFile = '../client/campsite-status.json';
     * fs.writeFileSync(outputFile, JSON.stringify(fileData));
     * console.log(`wrote ${outputFile}`);
     */
    public static List<CampSite> parseAvailability(List<String> availability) throws IOException {
        Gson gson = new Gson();
        byte[] bytes = Files.readAllBytes(Paths.get("/Users/mnovinger/personal-projects/rmnp-camping/java-server/src/main/resources/campsite-names.json"));
        Type campSiteType = new TypeToken<Collection<CampSite>>() {
        }.getType();
        List<CampSite> campSites = gson.fromJson(new String(bytes, Charset.defaultCharset()), campSiteType);

        Map<String, List<String>> availabilityBySiteId = new HashMap<>();
        for (CampSite site : campSites) {
            availabilityBySiteId.put(site.getId(), new ArrayList<>());
        }

        List<String> allDates = new ArrayList<>();

        for (String line : availability) {
            Matcher matcher = statusLineRegex.matcher(line);
            if (matcher.matches()) {
                String siteId = matcher.group(8);
                List<String> statuses = IntStream.range(1, 7)
                        .mapToObj(matcher::group)
                        .collect(Collectors.toList());

                if (!availabilityBySiteId.containsKey(siteId)) {
                    System.err.println("Couldn't find siteId:"+siteId);
                }
                availabilityBySiteId.get(siteId).addAll(statuses);
            } else {
                matcher = dateLineRegex.matcher(line);
                if (matcher.matches()) {
                    List<String> dates = IntStream.range(1, 8)
                            .mapToObj(matcher::group)
                            .collect(Collectors.toList());

                    allDates.addAll(dates);
                }

            }

        }

        DateFormat df = new SimpleDateFormat("M/d/yyyy");
        campSites.stream().forEach(site -> {
            ArrayList<CampSiteAvailability> siteAvailabilities = new ArrayList<>();
            List<String> statues = availabilityBySiteId.get(site.getId());
            for (int idx = 0; idx < statues.size() ; idx++) {
                String status = statues.get(idx);
                String dateString = allDates.get(idx);

                Date parse = null;
                try {
                    parse = df.parse(dateString);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                siteAvailabilities.add(new CampSiteAvailability(parse, status));
            }
            site.setAvailability(siteAvailabilities);
        });
        return campSites;
    }
}
