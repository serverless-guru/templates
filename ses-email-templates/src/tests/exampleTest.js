const params = {
// Name of template defined in example.yml
   Template: "Example",
   Source: "test@serverlessguru.com",
   Destination: {
       ToAddresses: ["ben@serverlessguru.com"]
   },
   TemplateData : {
       date: `${Date()}`,
       //the "name" variable is not used in the template. It can still safely be passed to the template without causing errors, though.
       name: "Ben"
   }
}

module.exports = params