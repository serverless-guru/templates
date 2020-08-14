# EC2 autoscaling with Nginx running behind a Network load balancer

* This template initializes creates a Network load balancer listening on TCP 443 with a target group. 
* The target group ARN from the NLB stack is used in the EC2 autoscaling stack. This stack creates an autoscaling group with a launch configuration that installs Nginx, adds SSL certs to the folders of Nginx, and then restarts Nginx.
