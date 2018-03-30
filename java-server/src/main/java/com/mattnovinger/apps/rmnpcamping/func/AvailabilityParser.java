package com.mattnovinger.apps.rmnpcamping.func;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.func.parse2016.AvailabilityParser2016;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.*;

/**
 * Created by Matt Novinger on 3/29/17.
 */
public abstract class AvailabilityParser {
    protected static final String statusRegex = "(FULL|\\d|NA)";
    protected static final String initialStatusRegex = statusRegex + statusRegex + statusRegex + statusRegex + statusRegex + statusRegex;
    protected static final String siteIdRegex = "(?<siteid>[\\d]{2,3}[A-Za-z]{0,2}-?\\d?)";
    protected static final String lastSnowDateRegex = "(\\d\\d?/\\d\\d)";
    protected static final String elevationAndDistanceRegex = "\\d+.?\\d?\\w+\\s?[A-Za-z ()/-]+";

    public abstract List<CampSite> buildAvailability(String availability);

    protected List<CampSite> getCampSites() {
        Gson gson = new Gson();
        InputStream campsiteData = AvailabilityParser2016.class.getClassLoader().getResourceAsStream("campsite-names.json");

        Type campSiteType = new TypeToken<Collection<CampSite>>() {
        }.getType();
        return gson.fromJson(new InputStreamReader(campsiteData), campSiteType);
    }


    protected static Map<String, List<String>> buildAvailabilityMap(List<CampSite> campSites) {
        Map<String, List<String>> availabilityBySiteId = new HashMap<>();
        for (CampSite site : campSites) {
            availabilityBySiteId.put(site.getId(), new ArrayList<>());
        }
        return availabilityBySiteId;
    }
}
