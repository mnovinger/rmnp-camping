package com.mattnovinger.apps.rmnpcamping.domain;

import java.util.Date;

/**
 * Created by mnovinger on 8/22/16.
 */
public class CampSiteAvailability {
    private Date date;
    private String status;

    public CampSiteAvailability(Date date, String status) {
        this.date = date;
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
