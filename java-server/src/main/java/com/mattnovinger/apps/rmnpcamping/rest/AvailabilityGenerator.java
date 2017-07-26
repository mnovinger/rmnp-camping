package com.mattnovinger.apps.rmnpcamping.rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.domain.CampsiteAvailabilityResponse;
import com.mattnovinger.apps.rmnpcamping.func.AvailabilityParser;
import com.mattnovinger.apps.rmnpcamping.func.parse2016.AvailabilityParser2016;
import com.mattnovinger.apps.rmnpcamping.func.FileFetcher;
import com.mattnovinger.apps.rmnpcamping.func.PdfExtractor;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.mattnovinger.apps.rmnpcamping.func.parse2017.AvailabilityParser2017;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 * Created by mnovinger on 8/22/16.
 */
@Component
@CrossOrigin
@Path("/")
public class AvailabilityGenerator {
    private String cachedAvailabilityJson = null;
    private LocalDateTime lastFetchDate = null;

    @GET
    @Path("availability")
    @Produces(MediaType.APPLICATION_JSON)
    public String getAvailability() {
        if (cachedAvailabilityJson == null || moreThanSixHoursSinceUpdate(lastFetchDate)) {
            try {
                InputStream pdfFile = FileFetcher.fetchFile();
                lastFetchDate = LocalDateTime.now();
                String extractedAvailabilityTest = PdfExtractor.extract(pdfFile);
                AvailabilityParser parser = new AvailabilityParser2017();
                List<CampSite> cachedCampsites = parser.buildAvailability(extractedAvailabilityTest);
                CampsiteAvailabilityResponse response = new CampsiteAvailabilityResponse(cachedCampsites, lastFetchDate.toString());
                Gson gson = new GsonBuilder()
                        .setDateFormat(DateFormat.SHORT, DateFormat.SHORT).create();
                cachedAvailabilityJson = gson.toJson(response);
            } catch (IOException e) {
                e.printStackTrace();
                return "{\"msg\":\"error fetching or parsing\"}";
            }
        }

        return cachedAvailabilityJson;
    }

    protected boolean moreThanSixHoursSinceUpdate(LocalDateTime lastFetchDate) {
        return lastFetchDate != null && LocalDateTime.now().isAfter(lastFetchDate.plus(6, ChronoUnit.HOURS));
    }
}
