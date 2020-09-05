package app;

import swim.api.SwimRoute;
import swim.api.agent.AgentRoute;
import swim.api.plane.AbstractPlane;
import swim.kernel.Kernel;
import swim.server.ServerLoader;

public class server extends AbstractPlane {

  @SwimRoute("/twitter/feed")
  private AgentRoute<twitterAgent> userManager;

  public static void main(String[] args) throws InterruptedException {
    final Kernel kernel = ServerLoader.loadServer();

    kernel.start();
    System.out.println("Running Server plane...");
    kernel.run();

  }
}
