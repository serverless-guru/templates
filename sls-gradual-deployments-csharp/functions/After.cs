using System.Threading.Tasks;
using Amazon.CodeDeploy;
using Amazon.CodeDeploy.Model;
using System;

namespace AwsDotnetCsharp
{

    public class After
    {
       public async Task<string> Handler(CodeDeployRequest request)
       {
          AmazonCodeDeployClient	client = new AmazonCodeDeployClient();
          PutLifecycleEventHookExecutionStatusRequest req = new PutLifecycleEventHookExecutionStatusRequest();

          req.DeploymentId = request.DeploymentId;
          req.LifecycleEventHookExecutionId = request.LifecycleEventHookExecutionId;
          // SET STATUS TO Failed or Succeeded based on CUSTOM LOGIC
          req.Status = "Succeeded";
          await client.PutLifecycleEventHookExecutionStatusAsync(req);
          return "Go Serverless v1.0! Your function executed successfully!";
       }
    }

}