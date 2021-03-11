package com.arjunsk.flink.kda.sample;

import static com.arjunsk.flink.kda.sample.configs.StreamProcessorConfigConstants.KINESIS_SOURCE_GROUP_ID_KEY;
import static com.arjunsk.flink.kda.sample.configs.StreamProcessorConfigConstants.KINESIS_SOURCE_STREAM_NAME_KEY;
import static com.arjunsk.flink.kda.sample.configs.StreamProcessorConfigConstants.STREAM_PROCESSOR_GREETING_KEY;
import static com.arjunsk.flink.kda.sample.configs.StreamProcessorConfigConstants.STREAM_PROCESSOR_GROUP_ID_KEY;

import com.amazonaws.services.kinesisanalytics.runtime.KinesisAnalyticsRuntime;
import com.arjunsk.flink.kda.sample.functions.AppendGreetingsFunction;
import com.arjunsk.flink.kda.sample.functions.AppendTimeFunction;
import java.io.IOException;
import java.util.Map;
import java.util.Properties;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.LocalStreamEnvironment;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.kinesis.FlinkKinesisConsumer;

/** Stream Job Main class. */
@Slf4j
public class StreamingJob {

  /**
   * Configures Flink Kinesis source.
   *
   * @param env Flink execution context for setting source.
   * @param properties Kinesis source properties.
   * @return Flink input source stream.
   */
  private static DataStream<String> createSource(
      StreamExecutionEnvironment env, Properties properties) {
    return env.addSource(
            new FlinkKinesisConsumer<>(
                properties.getProperty(KINESIS_SOURCE_STREAM_NAME_KEY),
                new SimpleStringSchema(),
                properties))
        .name("Kinesis Source")
        .uid("kinesis_source");
  }

  /** Driver Method for Streaming Job. */
  public static void main(String[] args) throws Exception {

    final StreamExecutionEnvironment sEnv = StreamExecutionEnvironment.getExecutionEnvironment();

    // Fetching applicationProperties.
    Map<String, Properties> applicationPropertiesMap = initPropertiesMap(sEnv);
    Properties applicationProperties = applicationPropertiesMap.get(STREAM_PROCESSOR_GROUP_ID_KEY);

    // ===== Adding Flink Source. =====
    DataStream<String> inputStream =
        createSource(sEnv, applicationPropertiesMap.get(KINESIS_SOURCE_GROUP_ID_KEY));

    DataStream<String> timeAppendedStream =
        inputStream
            .map(new AppendTimeFunction())
            .name("Time Appender")
            .uid("time_appender")
            .startNewChain();

    String greetingKeyword = applicationProperties.getProperty(STREAM_PROCESSOR_GREETING_KEY);
    DataStream<String> greetAppendedStream =
        timeAppendedStream
            .map(new AppendGreetingsFunction(greetingKeyword))
            .name("Greet Appender")
            .uid("greet_appender")
            .startNewChain();

    greetAppendedStream.print();

    sEnv.execute("Flink Streaming Processor");
  }

  /**
   * Initializes Properties Map based on execution environment.
   *
   * <pre>
   *    If we are running the program locally, it will take from "application-properties-*.json".
   *    Else it will take value from Kinesis Data Analytics Environment.
   * </pre>
   *
   * @param sEnv Streaming Environment Context
   * @return Application Map
   * @throws IOException If file not found.
   */
  private static Map<String, Properties> initPropertiesMap(StreamExecutionEnvironment sEnv)
      throws IOException {

    Map<String, Properties> applicationPropertiesMap;
    if (sEnv instanceof LocalStreamEnvironment) {
      applicationPropertiesMap =
          KinesisAnalyticsRuntime.getApplicationProperties(
              StreamingJob.class
                  .getClassLoader()
                  .getResource("application-properties-dev.json")
                  .getPath());
      log.info("Read Properties from resource folder.");
    } else {
      applicationPropertiesMap = KinesisAnalyticsRuntime.getApplicationProperties();
      log.info("Read Properties from KDA.");
    }
    return applicationPropertiesMap;
  }
}
