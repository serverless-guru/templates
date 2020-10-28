namespace AwsDotnetCsharp
{
    public class Scheduled
    {
       public Response Handler(Request request)
       {
         string result = Helpers.invokeHiMethodFromLib("hi"); 
         System.Console.Write("Just as scheduled " + result);
         return new Response("success", request);
       }
       
    }

}
