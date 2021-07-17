using System.Threading.Tasks;
using Amazon.CodeDeploy;
using Amazon.CodeDeploy.Model;
using System;
using Amazon.Lambda.Core;

namespace AwsDotnetCsharp
{

    public class Before
    {
      [LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.CamelCaseLambdaJsonSerializer))]
      public async Task<string> Handler(CodeDeployRequest request)
       {

          Console.WriteLine(request.DeploymentId);


          AmazonCodeDeployClient	client = new AmazonCodeDeployClient();
          PutLifecycleEventHookExecutionStatusRequest req = new PutLifecycleEventHookExecutionStatusRequest();

          req.DeploymentId = request.DeploymentId;
          req.LifecycleEventHookExecutionId = request.LifecycleEventHookExecutionId;

         // SET STATUS TO Falied or Succed based on CUSTOM LOGIC
          req.Status = "Succeeded";
          await client.PutLifecycleEventHookExecutionStatusAsync(req);
          return "Go Serverless v1.0! Your function executed successfully!";
       }
    }

}
