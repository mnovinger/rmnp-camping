package com.mattnovinger.apps.rmnpcamping.domain;

import java.util.List;

public class CampSite {
    private String id;
    private String name;
    private float elevation;
    private float distance;
    private String lastSnowData;
    private List<CampSiteAvailability> availability;

    public String getId() {return id;}

    public String getName() {
        return name;
    }

    public float getElevation() {
        return elevation;
    }

    public float getDistance() {
        return distance;
    }

    public String getLastSnowData() {
        return lastSnowData;
    }

    public List<CampSiteAvailability> getAvailability() {
        return availability;
    }

    public void setAvailability(List<CampSiteAvailability> availability) {
        this.availability = availability;
    }
}
