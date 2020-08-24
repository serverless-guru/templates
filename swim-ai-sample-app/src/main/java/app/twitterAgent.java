package app;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;

public class twitterAgent extends AbstractAgent {

  @SwimLane("tweets")
  ValueLane<String> info = this.<String>valueLane()
      .didSet((newValue, oldValue) -> {
        logMessage("`info` set to " + newValue + " from " + oldValue);
      });
  
  private void logMessage(Object o) {
    System.out.println("[" + nodeUri() + "] " + o);
  }

  @Override
  public void didStart() {
    logMessage("Web Agent Started");
  }

}
