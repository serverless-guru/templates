# EC2 Autoscaling Nginx with Network Load Balancer
* This template creates a Network Load Balancer listening on TCP 443 with a target group.
* The target group ARN from the NLB stack is used in the EC2 stack.
* The EC2 stack creates an autoscaling group with a launch configuration that installs Nginx, puts SSL certs into respective Nginx folders and restarts the Nginx service.