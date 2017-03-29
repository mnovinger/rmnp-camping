package com.mattnovinger.apps.rmnpcamping.domain;

import org.joda.time.LocalDate;

import java.util.ArrayList;
import java.util.List;

public class CampSite {
    private String id;
    private String name;
    private float elevation;
    private float distance;
    private String lastSnowData;
    private List<CampSiteAvailability> availability;

    private int dateIdx = 0;

    public CampSite() {
    }

    public CampSite(String id, String name, float elevation, float distance, String lastSnowData) {
        this.id = id;
        this.name = name;
        this.elevation = elevation;
        this.distance = distance;
        this.lastSnowData = lastSnowData;
        this.availability = new ArrayList<>();
    }

    public void addAvailability(String status, List<LocalDate> uniqueDates) {
        this.availability.add(new CampSiteAvailability(uniqueDates.get(dateIdx).toDate(), status));
        dateIdx++;
    }

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

    @Override
    public String toString() {
        return "CampSite{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", elevation=" + elevation +
                ", distance=" + distance +
                ", lastSnowData='" + lastSnowData + '\'' +
                ", availability=" + availability +
                ", dateIdx=" + dateIdx +
                '}';
    }
}
