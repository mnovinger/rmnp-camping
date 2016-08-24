package com.mattnovinger.apps.rmnpcamping.rest;

import com.google.gson.Gson;
import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.func.AvailabilityParser;
import com.mattnovinger.apps.rmnpcamping.func.FileFetcher;
import com.mattnovinger.apps.rmnpcamping.func.PdfExtractor;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.stereotype.Component;
/**
 * Created by mnovinger on 8/22/16.
 */
@Component
@Path("/home")
public class AvailabilityGenerator {
    private String cachedAvailabilityJson = null;

    @GET
    @Path("availability")
    @Produces(MediaType.APPLICATION_JSON)
    public String getAvailability() {
        if (cachedAvailabilityJson == null) {
            try {
                InputStream pdfFile = FileFetcher.fetchFile();
                List<String> extractedAvailabilityTest = PdfExtractor.extract(pdfFile);
                List<CampSite> cachedCampsites = AvailabilityParser.parseAvailability(extractedAvailabilityTest);
                Gson gson = new Gson();
                cachedAvailabilityJson = gson.toJson(cachedCampsites);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return cachedAvailabilityJson;
    }
}
