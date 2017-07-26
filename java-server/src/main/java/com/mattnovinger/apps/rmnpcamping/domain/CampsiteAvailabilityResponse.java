package com.mattnovinger.apps.rmnpcamping.domain;

import java.util.List;

/**
 * Created by matt.novinger on 7/19/17.
 */
public class CampsiteAvailabilityResponse {
    private List<CampSite> sites;
    private String lastUpdated;

    public CampsiteAvailabilityResponse(List<CampSite> sites, String lastUpdated) {
        this.sites = sites;
        this.lastUpdated = lastUpdated;
    }

    public List<CampSite> getSites() {
        return sites;
    }

    public void setSites(List<CampSite> sites) {
        this.sites = sites;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
