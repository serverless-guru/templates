import type { CreateJobCommandInput, Input, Output } from '@aws-sdk/client-mediaconvert'

export const input: Input = {
  AudioSelectors: {
    'Audio Selector 1': {
      DefaultSelection: 'DEFAULT',
      Offset: 0,
      ProgramSelection: 1,
    },
  },
  DeblockFilter: 'DISABLED',
  DenoiseFilter: 'DISABLED',
  FileInput: undefined,
  FilterEnable: 'AUTO',
  FilterStrength: 0,
  PsiControl: 'USE_PSI',
  TimecodeSource: 'EMBEDDED',
  VideoSelector: {
    ColorSpace: 'FOLLOW',
    Rotate: 'DEGREE_0',
  },
}

export const output: Output = {
  AudioDescriptions: [
    {
      AudioSourceName: 'Audio Selector 1',
      AudioType: 0,
      AudioTypeControl: 'FOLLOW_INPUT',
      CodecSettings: {
        AacSettings: {
          AudioDescriptionBroadcasterMix: 'NORMAL',
          Bitrate: 160000,
          CodecProfile: 'LC',
          CodingMode: 'CODING_MODE_2_0',
          RateControlMode: 'CBR',
          RawFormat: 'NONE',
          SampleRate: 48000,
          Specification: 'MPEG4',
        },
        Codec: 'AAC',
      },
      LanguageCodeControl: 'FOLLOW_INPUT',
    },
  ],
  ContainerSettings: {
    Container: 'MP4',
    Mp4Settings: {
      CslgAtom: 'INCLUDE',
      FreeSpaceBox: 'EXCLUDE',
      MoovPlacement: 'PROGRESSIVE_DOWNLOAD',
    },
  },
  VideoDescription: {
    AfdSignaling: 'NONE',
    AntiAlias: 'ENABLED',
    CodecSettings: {
      Codec: 'H_264',
      H264Settings: {
        AdaptiveQuantization: 'HIGH',
        CodecLevel: 'LEVEL_4_2',
        CodecProfile: 'HIGH',
        EntropyEncoding: 'CABAC',
        FieldEncoding: 'PAFF',
        FlickerAdaptiveQuantization: 'ENABLED',
        FramerateControl: 'SPECIFIED',
        FramerateConversionAlgorithm: 'DUPLICATE_DROP',
        FramerateDenominator: 1001,
        FramerateNumerator: 30000,
        GopBReference: 'DISABLED',
        GopClosedCadence: 1,
        GopSize: 2,
        GopSizeUnits: 'SECONDS',
        HrdBufferInitialFillPercentage: 90,
        HrdBufferSize: 12000000,
        InterlaceMode: 'PROGRESSIVE',
        MaxBitrate: 6000000,
        MinIInterval: 0,
        NumberBFramesBetweenReferenceFrames: 1,
        NumberReferenceFrames: 3,
        ParControl: 'SPECIFIED',
        ParDenominator: 1,
        ParNumerator: 1,
        QualityTuningLevel: 'SINGLE_PASS_HQ',
        QvbrSettings: {
          QvbrQualityLevel: 8,
        },
        RateControlMode: 'QVBR',
        RepeatPps: 'DISABLED',
        SceneChangeDetect: 'ENABLED',
        Slices: 1,
        SlowPal: 'DISABLED',
        Softness: 0,
        SpatialAdaptiveQuantization: 'ENABLED',
        Syntax: 'DEFAULT',
        Telecine: 'NONE',
        TemporalAdaptiveQuantization: 'ENABLED',
        UnregisteredSeiTimecode: 'DISABLED',
      },
    },
    ColorMetadata: 'INSERT',
    DropFrameTimecode: 'ENABLED',
    Height: 1080,
    RespondToAfd: 'NONE',
    ScalingBehavior: 'STRETCH_TO_OUTPUT',
    Sharpness: 50,
    TimecodeInsertion: 'DISABLED',
    Width: 1920,
  },
}

export const outputH265: Output = {
  AudioDescriptions: [
    {
      AudioSourceName: 'Audio Selector 1',
      AudioType: 0,
      AudioTypeControl: 'FOLLOW_INPUT',
      CodecSettings: {
        AacSettings: {
          AudioDescriptionBroadcasterMix: 'NORMAL',
          Bitrate: 160000,
          CodecProfile: 'LC',
          CodingMode: 'CODING_MODE_2_0',
          RateControlMode: 'CBR',
          RawFormat: 'NONE',
          SampleRate: 48000,
          Specification: 'MPEG4',
        },
        Codec: 'AAC',
      },
      LanguageCodeControl: 'FOLLOW_INPUT',
    },
  ],
  VideoDescription: {
    AfdSignaling: 'NONE',
    AntiAlias: 'ENABLED',
    CodecSettings: {
      Codec: 'H_265',
      H265Settings: {
        AdaptiveQuantization: 'HIGH',
        CodecLevel: 'AUTO',
        CodecProfile: 'MAIN_MAIN',
        FlickerAdaptiveQuantization: 'ENABLED',
        FramerateControl: 'SPECIFIED',
        FramerateConversionAlgorithm: 'DUPLICATE_DROP',
        FramerateDenominator: 1001,
        FramerateNumerator: 30000,
        GopBReference: 'DISABLED',
        GopClosedCadence: 1,
        GopSize: 2,
        GopSizeUnits: 'SECONDS',
        HrdBufferInitialFillPercentage: 90,
        HrdBufferSize: 12000000,
        InterlaceMode: 'PROGRESSIVE',
        MaxBitrate: 6000000,
        MinIInterval: 0,
        NumberBFramesBetweenReferenceFrames: 1,
        NumberReferenceFrames: 3,
        ParControl: 'SPECIFIED',
        ParDenominator: 1,
        ParNumerator: 1,
        QualityTuningLevel: 'SINGLE_PASS_HQ',
        QvbrSettings: {
          QvbrQualityLevel: 8,
        },
        RateControlMode: 'QVBR',
        SampleAdaptiveOffsetFilterMode: 'ADAPTIVE',
        SceneChangeDetect: 'ENABLED',
        Slices: 4,
        SlowPal: 'DISABLED',
        SpatialAdaptiveQuantization: 'ENABLED',
        Telecine: 'NONE',
        TemporalAdaptiveQuantization: 'ENABLED',
        TemporalIds: 'DISABLED',
        Tiles: 'ENABLED',
        UnregisteredSeiTimecode: 'DISABLED',
      },
    },
    ColorMetadata: 'INSERT',
    DropFrameTimecode: 'ENABLED',
    Height: 1080,
    RespondToAfd: 'NONE',
    ScalingBehavior: 'STRETCH_TO_OUTPUT',
    Sharpness: 50,
    TimecodeInsertion: 'DISABLED',
    Width: 1920,
  },
  ContainerSettings: {
    Container: 'MP4',
    Mp4Settings: {
      CslgAtom: 'INCLUDE',
      FreeSpaceBox: 'EXCLUDE',
      MoovPlacement: 'PROGRESSIVE_DOWNLOAD',
    },
  },
}

interface OutputFormat {
  Width: number
  Height: number
  Bitrate: number
  Profile: 'MAIN-MAIN' | 'HIGH' | 'MAIN'
  Level: 'AUTO' | 'LEVEL_4_2' | 'LEVEL_3_1'
  Codec?: 'H_265' | 'H_264'
  FramerateNumerator?: number
}

export const outputs: OutputFormat[] = [
  {
    Width: 3840,
    Height: 2160,
    Bitrate: 20000000,
    Profile: 'MAIN-MAIN',
    Level: 'AUTO',
    Codec: 'H_265',
  },
  {
    Width: 1920,
    Height: 1080,
    Bitrate: 6000000,
    Profile: 'HIGH',
    Level: 'LEVEL_4_2',
  },
  {
    Width: 1280,
    Height: 720,
    Bitrate: 3500000,
    Profile: 'HIGH',
    Level: 'LEVEL_4_2',
  },
  {
    Width: 854,
    Height: 480,
    Bitrate: 1000000,
    Profile: 'MAIN',
    Level: 'LEVEL_3_1',
  },
  {
    Width: 640,
    Height: 360,
    Bitrate: 700000,
    Profile: 'MAIN',
    Level: 'LEVEL_3_1',
  },
  {
    Width: 480,
    Height: 270,
    Bitrate: 400000,
    FramerateNumerator: 15000,
    Profile: 'MAIN',
    Level: 'LEVEL_3_1',
  },
]

export const job: CreateJobCommandInput = {
  Role: undefined,
  Settings: {
    AdAvailOffset: 0,
    Inputs: undefined,
    OutputGroups: [
      {
        Name: 'video',
        OutputGroupSettings: {
          FileGroupSettings: {
            Destination: undefined,
          },
          Type: 'FILE_GROUP_SETTINGS',
        },
        Outputs: [],
      },
      {
        Name: 'frames',
        OutputGroupSettings: {
          FileGroupSettings: {
            Destination: undefined,
          },
          Type: 'FILE_GROUP_SETTINGS',
        },
        Outputs: [
          {
            VideoDescription: {
              CodecSettings: {
                Codec: 'FRAME_CAPTURE',
                FrameCaptureSettings: {
                  Quality: 95,
                  FramerateNumerator: 1,
                  FramerateDenominator: 10,
                  MaxCaptures: 20,
                },
              },
            },
            ContainerSettings: {
              Container: 'RAW',
            },
          },
        ],
      },
    ],
  },
}
