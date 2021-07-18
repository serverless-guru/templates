using Amazon.Lambda.Core;
using System.Text.Json;


namespace AwsDotnetCsharp
{
    public class Handler
    {
      [LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.CamelCaseLambdaJsonSerializer))]
       public Response Hello(Request request)
       {
           return new Response("Your function executed successfully!", request);
       }
    }

}
