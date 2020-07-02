package api;

import swim.api.ref.SwimRef;
import swim.structure.Text;
import swim.structure.Value;
/**
 * Simple wrapper around some {@code SwimRef}, e.g. a {@code SwimClient} handle,
 * that pushes data to the Swim server running at {@code hostUri}.
 */
class DataSource {

  private final SwimRef ref;
  private final String hostUri;

  DataSource(SwimRef ref, String hostUri) {
    this.ref = ref;
    this.hostUri = hostUri;
  }
  
  void sendCommands() throws InterruptedException {
    final Value msg = Text.from("Doe"); 
    this.ref.command(this.hostUri, "/user/john", "getSurname", msg);
  }

}
