const modes = {
  names: {
    PERF: 'perf',
    PERFORMANCE: 'performance',
    ACC: 'acc',
    ACCEPTANCE: 'acceptance',
    MON: 'mon',
    MONITORING: 'monitoring',
  },

  isAcceptanceScript: script => script.mode && (script.mode === modes.names.ACC || script.mode === modes.names.ACCEPTANCE),
  isMonitoringScript: script => script.mode && (script.mode === modes.names.MON || script.mode === modes.names.MONITORING),
  isPerformanceScript: script => !script.mode || (script.mode && (script.mode === modes.names.PERF || script.mode === modes.names.PERFORMANCE)),
  isSamplingScript: script => modes.isAcceptanceScript(script) || modes.isMonitoringScript(script),

  validateScriptMode: (script) => {
    const validModes = Object.keys(modes.names).map(key => modes[key])
    const isScriptModeValid = script.mode === undefined || validModes.includes(script.mode.toLocaleLowerCase())

    if (!isScriptModeValid) {
      const listOfValidModes = validModes.map(mode => `"${mode}"`).join(', ')
      throw new Error(`If specified, the mode attribute must be one of: ${listOfValidModes}.`)
    }
  },

  getModeForDisplay: (script) => {
    if (modes.isAcceptanceScript(script)) return modes.ACCEPTANCE
    if (modes.isMonitoringScript(script)) return modes.MONITORING
    return modes.PERFORMANCE
  },
}

module.exports = Object.assign(modes, modes.names)
