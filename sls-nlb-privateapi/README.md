# Private API with Network Load Balancer
* The template assumes that a VPC with two private and public subnets already exists as those inputs are needed for the creation of this stack.
* This template creates a VPC Endpoint, Security group for the VPC Endpoint, Network Load Balancer listening on TCP 443 with a target group and a Private API.
* The target group has ENI IPs of the VPC Endpoint as targets. Therefore, only those requests that the load balancer receives will be routed to the API through the VPC.
* The NLB can be hit by using the Public IPs since the NLB is internet facing, and the ENIs are part of the public subnets where the NLB is created.

## For testing the API
```
var https = require('https');
const options = {
  // NLB IP
  host: '',
  port: 443,
  path: '/stage-name',
  method: 'GET',
  headers: {
    'Host': 'APIID.execute-api.us-east-1.amazonaws.com'
    
  }
};
 const handler = () => {
    https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
    //   console.log(res);
      let data = '';
      res.on('data', (d) => {
       data += d;
        process.stdout.write(d);
      });
      res.on('end', () => {
         console.log(JSON.parse(data));
      });
    }).on('error', (e) => {
      console.log(e);
    }).end();
 }

handler();

```