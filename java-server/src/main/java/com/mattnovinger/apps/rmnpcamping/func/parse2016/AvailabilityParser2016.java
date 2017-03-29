package com.mattnovinger.apps.rmnpcamping.func.parse2016;

import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.domain.CampSiteAvailability;
import com.mattnovinger.apps.rmnpcamping.func.AvailabilityParser;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class AvailabilityParser2016 extends com.mattnovinger.apps.rmnpcamping.func.AvailabilityParser {
    private static final Pattern statusLineRegex = Pattern.compile("^" + initialStatusRegex + lastSnowDateRegex + elevationAndDistanceRegex + siteIdRegex + "\\s" + statusRegex);
    private static final String dateRegex = "(\\d{1,2}\\/\\d{1,2}\\/\\d{4})";
    private static final Pattern dateLineRegex = Pattern.compile("^" + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + dateRegex + "\\s" + dateRegex + "$");

    @Override
    public List<CampSite> buildAvailability(String availability) {

        List<String> availabilityByLine = Arrays.asList(availability.split("\n"));
        List<CampSite> campSites = getCampSites();

        List<String> allDates = parseDates(availabilityByLine);

        Map<String, List<String>> availabilityBySiteId = parseAvailabilityText(availabilityByLine, campSites);

        return parseAndSortAvailability(campSites, availabilityBySiteId, allDates);
    }

    private List<String> parseDates(List<String> availability) {
        List<String> allDates = new ArrayList<>();

        for (String line : availability) {
            Matcher matcher = dateLineRegex.matcher(line);
            if (matcher.matches()) {
                List<String> dates = IntStream.range(1, 8)
                        .mapToObj(matcher::group)
                        .collect(Collectors.toList());

                    /*
                    Date lines appear more than once, but only add them once. Keep the ordering (which isn't
                    chronological) because the statuses appear in this order too.
                     */
                dates.stream().forEach(date -> {
                    if (!allDates.contains(date)) {
                        allDates.add(date);
                    }
                });

            }
        }

        return allDates;
    }
    private Map<String, List<String>> parseAvailabilityText(List<String> availability, List<CampSite> campSites) {
        Map<String, List<String>> availabilityBySiteId = buildAvailabilityMap(campSites);

        for (String line : availability) {
            Matcher matcher = statusLineRegex.matcher(line);
            if (matcher.matches()) {
                String siteId = matcher.group(8);
                List<String> statuses = IntStream.range(1, 7)
                        .mapToObj(matcher::group)
                        .collect(Collectors.toList());

                if (!availabilityBySiteId.containsKey(siteId)) {
                    System.err.println("Couldn't find siteId:" + siteId);
                }
                availabilityBySiteId.get(siteId).addAll(statuses);
            } else {
                matcher = dateLineRegex.matcher(line);


            }

        }
        return availabilityBySiteId;
    }

    private static List<CampSite> parseAndSortAvailability(List<CampSite> campSites, Map<String, List<String>> availabilityBySiteId, List<String> allDates) {
        DateFormat df = new SimpleDateFormat("M/d/yyyy");
        campSites.stream().forEach(site -> {
            ArrayList<CampSiteAvailability> siteAvailabilities = new ArrayList<>();
            List<String> statues = availabilityBySiteId.get(site.getId());
            for (int idx = 0; idx < statues.size(); idx++) {
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
            siteAvailabilities.sort((o1, o2) -> o1.getDate().compareTo(o2.getDate()));
            site.setAvailability(siteAvailabilities);
        });
        return campSites;
    }
}
