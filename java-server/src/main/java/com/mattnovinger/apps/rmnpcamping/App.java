package com.mattnovinger.apps.rmnpcamping;

import com.mattnovinger.apps.rmnpcamping.rest.AvailabilityGenerator;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

/**
 * Created by mnovinger on 8/23/16.
 */
public class App {
    public static void main(String[] args) throws Exception {
        String webPort = System.getenv("PORT");
        if(webPort == null || webPort.isEmpty()) {
            webPort = "8181";
        }

        Server server = new Server(Integer.valueOf(webPort));

        ResourceConfig resourceConfig = new ResourceConfig();
        resourceConfig.packages(AvailabilityGenerator.class.getPackage().getName());

//        resourceConfig.property()
//        resourceConfig.register(JacksonFeature.class);

        ServletHolder sh = new ServletHolder(new ServletContainer(resourceConfig));

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/rest");


        context.addServlet(sh, "/*");



        server.setHandler(context);

        try {
            server.start();
            server.join();
        } finally {
            server.destroy();
        }
    }
}
