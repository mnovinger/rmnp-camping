package com.mattnovinger.apps.rmnpcamping;

import com.mattnovinger.apps.rmnpcamping.rest.AvailabilityGenerator;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

/**
 * Created by mnovinger on 8/23/16.
 */
 @SpringBootApplication
public class App extends SpringBootServletInitializer {
  public static void main(String[] args) {
		    new App()
				.configure(new SpringApplicationBuilder(App.class))
				.run(args);
	}
    // public static void main(String[] args) throws Exception {
//         String webPort = System.getenv("PORT");
//         if(webPort == null || webPort.isEmpty()) {
//             webPort = "8181";
//         }
//
//         Server server = new Server(Integer.valueOf(webPort));
//
//         ResourceConfig resourceConfig = new ResourceConfig();
//         resourceConfig.packages(AvailabilityGenerator.class.getPackage().getName());
//
// //        resourceConfig.property()
// //        resourceConfig.register(JacksonFeature.class);
//
//         ServletHolder sh = new ServletHolder(new ServletContainer(resourceConfig));
//
//         ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
//         context.setContextPath("/rest");
//
//
//         context.addServlet(sh, "/*");
//
//
//
//         server.setHandler(context);
//
//         try {
//             server.start();
//             server.join();
//         } finally {
//             server.destroy();
//         }
    // }
}
