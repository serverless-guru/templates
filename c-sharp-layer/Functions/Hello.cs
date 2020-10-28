namespace AwsDotnetCsharp
{
    public class Hello
    {
       public Response Handler(Request request)
       {
          string result = Helpers.invokeHiMethodFromLib("hi");
          
          return new Response("Your function executed successfully! \n method says: " + result, request);
       }
       
    }

}
