package com.arjunsk.flink.kda.sample.functions;

import static com.arjunsk.flink.kda.sample.constants.LogConstants.METHOD_END;
import static com.arjunsk.flink.kda.sample.constants.LogConstants.METHOD_START;

import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.functions.RichMapFunction;

@Slf4j
public class AppendGreetingsFunction extends RichMapFunction<String, String> {

  private final String greetKeyword;

  public AppendGreetingsFunction(String greetKeyword) {
    this.greetKeyword = greetKeyword;
  }

  @Override
  public String map(String input) throws Exception {

    log.debug("AppendGreetingsFunction" + METHOD_START);

    String result = greetKeyword + "! " + input;

    log.debug("AppendGreetingsFunction" + METHOD_END);

    return result;
  }
}
