package com.mattnovinger.apps.rmnpcamping.func.parse2017;

import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.func.AvailabilityParser;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by novma03 on 3/29/17.
 */
public class AvailabilityParser2017 extends AvailabilityParser {
    private static final String CAMP_AREA_REGEX = "";//""(?<area>North\n" + "Fork Area)\n";
    private static final String DATE_REGEX = "(\\w{3}\n(?<date>\\d{2}\\/\\d{2})\n)";
    private static final Pattern DATE_PATTERN = Pattern.compile(DATE_REGEX);
    private static final String CAMP_AREA_AND_DATE_PATTERN = CAMP_AREA_REGEX + DATE_REGEX + "{7}";
    private static final String NAME_INFO_REGEX = "(?<name>\\w.+)\\s(?<mileage>\\d{1,2}\\.\\d)\\s(?<elevation>\\d+)\\s(?<snow>\\d{1,2}\\/\\d{2})\\s";
    private static final String STATUS_INFO_REGEX = "(?<status1>FULL|\\d|NA)\\s" + "(?<status2>FULL|\\d|NA|-)\\s" + "(?<status3>FULL|\\d|NA|-)\\s" + "(?<status4>FULL|\\d|NA|-)\\s" + "(?<status5>FULL|\\d|NA|-)\\s" + "(?<status6>FULL|\\d|NA|-)\\s" + "(?<status7>FULL|\\d|NA|-)";
    public static final Pattern NAME_AND_STATUS_PATTERN = Pattern.compile("^"+siteIdRegex + "\\s" + NAME_INFO_REGEX + STATUS_INFO_REGEX+"$", Pattern.MULTILINE);

    private static final DateTimeFormatter statusDateFormat = DateTimeFormat.forPattern("M/d/y");


    public List<CampSite> buildAvailability(String availabilityString) {
        List<LocalDate> uniqueDates = findUniqueDates(availabilityString);

        return new ArrayList<>(parseAvailability(availabilityString, uniqueDates));
    }
    
    private Collection<CampSite> parseAvailability(String availabilityString, List<LocalDate> uniqueDates) {
        Map<String, CampSite> idsToStatus = new HashMap<>();
        Matcher statusMatcher = NAME_AND_STATUS_PATTERN.matcher(availabilityString);
        while (statusMatcher.find()) {
            String siteid = statusMatcher.group("siteid");
            if (!idsToStatus.containsKey(siteid)) {
                idsToStatus.put(siteid, initializeCampsite(statusMatcher, siteid));
            }

            CampSite site = idsToStatus.get(siteid);
            for (int idx = 1; idx <= 7; idx++) {
                String status = statusMatcher.group("status" + idx);
                site.addAvailability(status, uniqueDates);
            }
        }

        return idsToStatus.values();
    }

    private CampSite initializeCampsite(Matcher statusMatcher, String siteid) {
        String name = statusMatcher.group("name");
        Float elevation = Float.parseFloat(statusMatcher.group("elevation"));
        Float distance = Float.parseFloat(statusMatcher.group("mileage"));
        String snow = statusMatcher.group("snow");
        return new CampSite(siteid, name, elevation, distance, snow);
    }

    private List<LocalDate> findUniqueDates(String availabilityString) {
        List<LocalDate> uniqueDates = new ArrayList<>();
        Matcher dateMatcher = DATE_PATTERN.matcher(availabilityString);
        while (dateMatcher.find()) {
            String date = dateMatcher.group("date");
            LocalDate localDate = LocalDate.parse(date + "/2017", statusDateFormat);
            if (!uniqueDates.contains(localDate)) {
                uniqueDates.add(localDate);
            }
        }
        return uniqueDates;
    }

    private List<CampSite> initializeCampSites(List<CampSite> campSites) {
        campSites.forEach(site -> {
            site.setAvailability(new ArrayList<>());
        });

        return campSites;
    }

}
