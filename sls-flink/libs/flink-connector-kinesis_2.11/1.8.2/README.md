## Flink Connector Kinesis 2.11-1.8.2

#### Maven Repo
The Following (version: 1.8.2) connector is removed from Maven Central. It was hosted in ICM 
repository for a while, but has been removed from there also, due to some license issue.

Reference: [Maven ICM repo for 1.8.2](https://mvnrepository.com/artifact/org.apache.flink/flink-connector-kinesis_2.11/1.8.0)


#### Flink Documentation Excerpt:

The flink-connector-kinesis_2.11 has a dependency on code licensed under the Amazon Software License (ASL). Linking to the flink-connector-kinesis will include ASL licensed code into your application.

The flink-connector-kinesis_2.11 artifact is not deployed to Maven central as part of Flink releases because of the licensing issue. Therefore, you need to build the connector yourself from the source.

Download the Flink source or check it out from the git repository. Then, use the following Maven command to build the module:

```shell script
mvn clean install -Pinclude-kinesis -DskipTests -Dfast
```

Reference: 
1. [Flink 1.8 Kinesis Connector Document](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/kinesis.html)
2. [Flink 1.8 Build Document](https://ci.apache.org/projects/flink/flink-docs-release-1.8/flinkDev/building.html)

#### Possible Solution
1. Request (or wait for) amazon to upgrade to Flink 1.10
2. Build the 1.8.2 Flink release, and generate kinesis-connector locally.
3. Follow the 2nd approach and included the `flink-connector-kinesis` library .jar in the lib folder. 
By performing `mvn validate`, this .jar will be installed in your local .m2. [Current Approach]