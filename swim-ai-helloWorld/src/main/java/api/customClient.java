package api;

import swim.client.ClientRuntime;
import swim.structure.Num;
import swim.structure.Text;

class customClient {
  public static void main(String[] args) throws InterruptedException {
    ClientRuntime swimClient = new ClientRuntime();
    swimClient.start();
    final Text msg = Text.from("Doe");
    // command "msg" TO
    // the "publish" lane OF
    // the agent addressable by "/unit/master" RUNNING ON
    // the plane with hostUri "warp://localhost:9001"
    swimClient.command("warp://localhost:9001", "/user/john", "getSurname", msg);

    System.out.println("Will shut down client in 2 seconds");
    Thread.sleep(2000);
    swimClient.stop();
  }
}