package api;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ListLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.recon.Recon;
import swim.structure.Record;
import swim.structure.Value;
import java.util.Iterator;

public class userManager extends AbstractAgent {

  @SwimLane("SendWelcomeMsg")
  public final CommandLane<Value> publish = this.<Value>commandLane()
      .onCommand(v -> {
        logMessage("Hello " + Recon.toString(v) + " Welcome To SWIM AI");
      });

  private void logMessage(Object o) {
    System.out.println("[" + nodeUri() + "] " + o);
  }

  @Override
  public void didStart() {
    logMessage("Web Agent Started");
  }

}
