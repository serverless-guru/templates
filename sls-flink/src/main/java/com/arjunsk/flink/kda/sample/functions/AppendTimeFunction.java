package com.arjunsk.flink.kda.sample.functions;

import static com.arjunsk.flink.kda.sample.constants.LogConstants.METHOD_END;
import static com.arjunsk.flink.kda.sample.constants.LogConstants.METHOD_START;

import java.time.Instant;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.functions.RichMapFunction;

@Slf4j
public class AppendTimeFunction extends RichMapFunction<String, String> {

  @Override
  public String map(String input) throws Exception {

    log.debug("AppendTimeFunction" + METHOD_START);

    String result = "The time is "+Instant.now() + " " + input;

    log.debug("AppendTimeFunction" + METHOD_END);

    return result;
  }
}
