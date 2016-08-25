package com.mattnovinger.apps.rmnpcamping.func;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.domain.CampSiteAvailability;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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

    public static List<CampSite> parseAvailability(List<String> availability) throws IOException {
        Gson gson = new Gson();
        InputStream campsiteData = AvailabilityParser.class.getClassLoader().getResourceAsStream("campsite-names.json");

        Type campSiteType = new TypeToken<Collection<CampSite>>() {
        }.getType();
        List<CampSite> campSites = gson.fromJson(new InputStreamReader(campsiteData), campSiteType);

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
