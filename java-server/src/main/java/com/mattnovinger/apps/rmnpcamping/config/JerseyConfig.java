package com.mattnovinger.apps.rmnpcamping.config;

import com.mattnovinger.apps.rmnpcamping.rest.AvailabilityGenerator;

import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
@Component
public class JerseyConfig extends ResourceConfig {
	public JerseyConfig() {
		register(AvailabilityGenerator.class);
	}
}
