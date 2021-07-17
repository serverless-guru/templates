using Amazon.Lambda.Core;

namespace AwsDotnetCsharp
{


    public class Response
    {
      public string Message {get; set;}
      public Request Request {get; set;}

      public Response(string message, Request? request){
        Message = message;
        Request = request;
      }
    }

    public class CodeDeployRequest 
    {
      public string DeploymentId { get; set; }
      public string LifecycleEventHookExecutionId { get; set; }
    }

    public class Request
    {
      public string Key1 {get; set;}
      public string Key2 {get; set;}
      public string Key3 {get; set;}
    }
}
