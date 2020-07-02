var swim = require("@swim/client");
var structure = require("@swim/structure");


var userName = structure.Text.from('John Doe')
const client = new swim.WarpClient();
client.command("warp://localhost:9001", "/welcome/user", "SendWelcomeMsg", userName);

