/**
 * Codec for EM2101 device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 16 June 2023
 * Update  Date : 27 March 2024
 */

// Configuration constants for device basic info and current settings
var CONFIG_INFO = {
    PORT     : 50,
    CHANNEL  : parseInt("0xFF", 16),
    TYPES    : {
        "0x09" : {SIZE : 2, NAME : "HardwareVersion", DIGIT: false},
        "0x0A" : {SIZE : 2, NAME : "FirmwareVersion", DIGIT: false},
        "0x16" : {SIZE : 4, NAME : "DeviceSerialNumber"},
        "0x0F" : {SIZE : 1, NAME : "DeviceClass",
            VALUES     : {
                "0x00" : "Class A",
                "0x01" : "Class B",
                "0x02" : "Class C",
            },
        },
        "0x0B" : {SIZE : 1, NAME : "PowerEvent",
            VALUES     : {
                "0x00" : "AC Power Off",
                "0x01" : "AC Power On",
            },
        },
        "0x00" : {SIZE : 1, NAME : "RelayStatus",
            VALUES     : {
                "0x00" : "LOW",
                "0x01" : "HIGH"
            },
        },
        "0x1E" : {SIZE : 2, NAME : "PrimaryCurrentTransformerRatio",},
        "0x1F" : {SIZE : 1, NAME : "SecondaryCurrentTransformerRatio",},
        "0x20" : {SIZE : 4, NAME : "PrimaryVoltageTransformerRatio",},
        "0x21" : {SIZE : 2, NAME : "SecondaryVoltageTransformerRatio",},
        "0x28" : {SIZE : 0, NAME : "DeviceModel",},
        "0x3C" : {SIZE : 2, NAME : "CurrentLimitFallback", UNIT : "A", RESOLUTION : 0.1,},
        "0x3D" : {SIZE : 2, NAME : "VoltageLimitFallback", UNIT : "V",},
        "0x3E" : {SIZE : 2, NAME : "PowerLimitFallback", UNIT : "W",},
        "0x3F" : {SIZE : 2, NAME : "DeactivationDelayFallback", UNIT : "s",},
        "0x40" : {SIZE : 2, NAME : "ActivationDelayFallback", UNIT : "s",},
        "0x41" : {SIZE : 2, NAME : "OffsetCurrentFallback", UNIT : "A", RESOLUTION : 0.1,},
        "0x42" : {SIZE : 2, NAME : "OffsetDelayFallback", UNIT : "s",},
        "0x43" : {SIZE : 2, NAME : "ResetTimeFallback", UNIT : "s",},
        "0x44" : {SIZE : 1, NAME : "ResetAmountFallback",},
        "0x50" : {SIZE : 2, NAME : "CurrentLimitDynamic", UNIT : "A", RESOLUTION : 0.1},
        "0x51" : {SIZE : 2, NAME : "VoltageLimitDynamic", UNIT : "V",},
        "0x52" : {SIZE : 2, NAME : "PowerLimitDynamic", UNIT : "W",},
        "0x53" : {SIZE : 2, NAME : "DeactivationDelayDynamic", UNIT : "s",},
        "0x54" : {SIZE : 2, NAME : "ActivationDelayDynamic", UNIT : "s",},
        "0x55" : {SIZE : 2, NAME : "OffsetCurrentDynamic", UNIT : "A", RESOLUTION : 0.1},
        "0x56" : {SIZE : 2, NAME : "OffsetDelayDynamic", UNIT : "s",},
        "0x57" : {SIZE : 2, NAME : "ResetTimeDynamic", UNIT : "s",},
        "0x58" : {SIZE : 1, NAME : "ResetAmountDynamic",},
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for measurement registers
 var CONFIG_MEASUREMENT = {
    "0x00" : {SIZE : 4, NAME : "Index",},
    "0x01" : {SIZE : 4, NAME : "Timestamp",},
    "0x03" : {SIZE : 4, NAME : "DataloggerTimestamp",},
    "0x04" : {SIZE : 4, NAME : "ActiveEnergyImportL1T1", UNIT : "Wh",},
    "0x05" : {SIZE : 4, NAME : "ActiveEnergyImportL1T2", UNIT : "Wh",},
    "0x06" : {SIZE : 4, NAME : "ActiveEnergyExportL1T1", UNIT : "Wh",},
    "0x07" : {SIZE : 4, NAME : "ActiveEnergyExportL1T2", UNIT : "Wh",},
    "0x08" : {SIZE : 4, NAME : "ReactiveEnergyImportL1T1", UNIT : "varh",},
    "0x09" : {SIZE : 4, NAME : "ReactiveEnergyImportL1T2", UNIT : "varh",},
    "0x0A" : {SIZE : 4, NAME : "ReactiveEnergyExportL1T1", UNIT : "varh",},
    "0x0B" : {SIZE : 4, NAME : "ReactiveEnergyExportL1T2", UNIT : "varh",},
    "0x0C" : {SIZE : 4, NAME : "VoltageL1N", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x10" : {SIZE : 4, NAME : "CurrentL1", UNIT : "mA", SIGNED : true,},
    "0x14" : {SIZE : 4, NAME : "ActivePowerL1", UNIT : "W", SIGNED : true,},
    "0x17" : {SIZE : 4, NAME : "ReactivePowerL1", UNIT : "kvar", RESOLUTION : 0.001, SIGNED : true,},
    "0x1A" : {SIZE : 4, NAME : "ApparentPowerL1", UNIT : "kVA", RESOLUTION : 0.001, SIGNED : true,},
    "0x1D" : {SIZE : 1, NAME : "PowerFactorL1", RESOLUTION : 0.01, SIGNED : true,},
    "0x20" : {SIZE : 2, NAME : "PhaseAngleL1", UNIT : "degree", RESOLUTION : 0.01, SIGNED : true,},
    "0x23" : {SIZE : 2, NAME : "Frequency", UNIT : "Hz", RESOLUTION : 0.01, SIGNED : true,},
    "0x24" : {SIZE : 4, NAME : "TotalSystemActivePower", UNIT : "kW",},
    "0x25" : {SIZE : 4, NAME : "TotalSystemReactivePower", UNIT : "kvar", RESOLUTION : 0.001,},
    "0x26" : {SIZE : 4, NAME : "TotalSystemApparentPower", UNIT : "kVA", RESOLUTION : 0.001,},
    "0x27" : {SIZE : 4, NAME : "MaximumL1CurrentDemand", UNIT : "mA", SIGNED : true,},
    "0x2A" : {SIZE : 4, NAME : "AveragePower", UNIT : "W", SIGNED : true,},
    "0x2B" : {SIZE : 4, NAME : "MIDYearOfCertification",},
    "0xF0" : {SIZE : 2, NAME : "ManufacturedYear", DIGIT: true,},
    "0xF1" : {SIZE : 2, NAME : "FirmwareVersion", DIGIT: false,},
    "0xF2" : {SIZE : 2, NAME : "HardwareVersion", DIGIT: false,},
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for change of state
var CONFIG_STATE = {
    PORT : 11,
    TYPES : {
        "0x01" : {SIZE : 1, NAME : "RelayStatus",
            VALUES     : {
                "0x00" : "OPEN",
                "0x01" : "CLOSED"
            },
        },
        "0x02" : {SIZE : 1, NAME : "DigitalInputStatus",
            VALUES     : {
                "0x00" : "OPEN",
                "0x01" : "CLOSED"
            },
        },
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for event logging
var CONFIG_LOGGING = {
    PORT : 60,
    CHANNEL  : parseInt("0xFD", 16),
    TYPES : {
        "0x01" : {SIZE : 1, NAME : "RelaySwitchingOffReason",
            VALUES     : {
                "0x00" : "Invalid",
                "0x01" : "Due to too high current limit",
                "0x02" : "By control from the Lora network",
                "0x03" : "By operation via display"
            },
        },
        "0x02" : {SIZE : 1, NAME : "RelayEnableReason",
            VALUES     : {
                "0x00" : "Invalid",
                "0x01" : "By reset based on time",
                "0x02" : "By reset from the Lora network",
                "0x03" : "By operation via display",
                "0x04" : "By control from the Lora network"
            },
        },
        "0x03" : {SIZE : 4, NAME : "RelaySwitchOffTime",},
        "0x04" : {SIZE : 4, NAME : "RelayEnableTime",},
        "0x05" : {SIZE : 4, NAME : "CurrentWhenRelaySwitchingOff",},
        "0x06" : {SIZE : 4, NAME : "VoltageWhenRelaySwitchingOff",},
        "0x07" : {SIZE : 4, NAME : "ActivePowerWhenRelaySwitchingOff",},
        "0x08" : {SIZE : 1, NAME : "ResetAmountStatus",
            VALUES     : {
                "0x01" : "Current reset count is less than the reset amount",
                "0x02" : "Current reset count exceeds the reset amount",
            },
        },
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

function decodeBasicInformation(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    var security = Object.keys(CONFIG_INFO.TYPES).length;
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_INFO.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_INFO.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH && security != 0)
        {
            security = security - 1;
            channel = bytes[index];
            index = index + 1;
            // No channel checking
            // Type of basic information
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            var info = CONFIG_INFO.TYPES[type];
            size = info.SIZE;
            // Decoding
            var value = 0;
            if(size != 0)
            {
                if("DIGIT" in info)
                {
                    if(info.DIGIT == false)
                    {
                        // Decode into "V" + DIGIT STRING + "." DIGIT STRING format
                        value = getDigitStringArrayNoFormat(bytes, index, size);
                        value = "V" + value[0] + "." + value[1];
                    }else
                    {
                        // Decode into DIGIT STRING format
                        value = getDigitStringArrayEvenFormat(bytes, index, size);
                        value = value.toString();
                    }
                }
                else if("VALUES" in info)
                {
                    // Decode into STRING (VALUES specified in CONFIG_INFO)
                    value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                    value = info.VALUES[value];
                }else
                {
                    // Decode into DECIMAL format
                    value = getValueFromBytesBigEndianFormat(bytes, index, size);
                }
                if("RESOLUTION" in info)
                {
                    value = value * info.RESOLUTION;
                    value = parseFloat(value.toFixed(2));
                }
                if("UNIT" in info)
                {
                    // decoded[info.NAME] = {};
                    // decoded[info.NAME]["data"] = value;
                    // decoded[info.NAME]["unit"] = info.UNIT;
                    decoded[info.NAME] = value;
                }else
                {
                    decoded[info.NAME] = value;
                }
                index = index + size;
            }else
            {
                // Device Model (End of decoding)
                size = LENGTH - index;
                decoded[info.NAME] = getStringFromBytesBigEndianFormat(bytes, index, size);
                index = index + size;
            }
        }
    }catch(error)
    {
        decoded[CONFIG_INFO.ERROR_NAME] = error.message;
    }

    return decoded;
}

function decodeDeviceData(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    var security = 11;
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_MEASUREMENT.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_MEASUREMENT.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH && security != 0)
        {
            security = security - 1;
            channel = bytes[index];
            index = index + 1;
            // Type of device measurement
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;

            // No channel checking

            var measurement = CONFIG_MEASUREMENT[type];
            size = measurement.SIZE;
            // Decoding
            var value = 0;
            if("DIGIT" in measurement)
            {
                if(measurement.DIGIT == false)
                {
                    // Decode into "V" + DIGIT STRING + "." DIGIT STRING format
                    value = getDigitStringArrayNoFormat(bytes, index, size);
                    value = "V" + value[0] + "." + value[1];
                }else
                {
                    // Decode into DIGIT NUMBER format
                    value = getDigitStringArrayEvenFormat(bytes, index, size);
                    value = parseInt(value.join(""));
                }
            }else
            {
                // Decode into DECIMAL format
                value = getValueFromBytesBigEndianFormat(bytes, index, size);
            }
            if("SIGNED" in measurement)
            {
                value = getSignedIntegerFromInteger(value, size);
            }
            if("RESOLUTION" in measurement)
            {
                value = value * measurement.RESOLUTION;
                value = parseFloat(value.toFixed(2));
            }
            if("UNIT" in measurement)
            {
                // decoded[measurement.NAME] = {};
                // decoded[measurement.NAME]["data"] = value;
                // decoded[measurement.NAME]["unit"] = measurement.UNIT;
                decoded[measurement.NAME] = value;
            }else
            {
                decoded[measurement.NAME] = value;
            }
            index = index + size;

        }
    }catch(error)
    {
        decoded[CONFIG_MEASUREMENT.ERROR_NAME] = error.message;
    }
    return decoded;
}

function decodeChangeState(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    var security = Object.keys(CONFIG_STATE.TYPES).length;
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_STATE.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_STATE.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH && security != 0)
        {
            security = security - 1;
            channel = bytes[index];
            index = index + 1;
            // Type of change of state
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            // No channel checking
            var state = CONFIG_STATE.TYPES[type];
            size = state.SIZE;
            // Decoding
            var value = 0;
            if(size != 0)
            {
                if("VALUES" in state)
                {
                    // Decode into STRING (VALUES specified in CONFIG_STATE)
                    value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                    value = state.VALUES[value];
                }
                index = index + size;
            }
            decoded[state.NAME] = value;
        }
    }catch(error)
    {
        decoded[CONFIG_STATE.ERROR_NAME] = error.message;
    }

    return decoded;
}

function decodeEventLogging(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    var security = Object.keys(CONFIG_LOGGING.TYPES).length;
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_LOGGING.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_LOGGING.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH && security != 0)
        {
            security = security - 1;
            channel = bytes[index];
            index = index + 1;
            // Type of change of state
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            // No channel checking
            var logging = CONFIG_LOGGING.TYPES[type];
            size = logging.SIZE;
            // Decoding
            var value = 0;
            if(size != 0)
            {
                if("VALUES" in logging)
                {
                    // Decode into STRING (VALUES specified in CONFIG_LOGGING)
                    value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                    value = logging.VALUES[value];
                }else
                {
                    // Decode into DECIMAL format
                    value = getValueFromBytesBigEndianFormat(bytes, index, size);
                }
                index = index + size;
            }
            decoded[logging.NAME] = value;
        }
    }catch(error)
    {
        decoded[CONFIG_LOGGING.ERROR_NAME] = error.message;
    }

    return decoded;
}

function getStringFromBytesBigEndianFormat(bytes, index, size)
{
    var value = "";
    for(var i=0; i<size; i=i+1)
    {
        value = value + String.fromCharCode(bytes[index+i]);
    }
    return value;
}

function getStringFromBytesLittleEndianFormat(bytes, index, size)
{
    var value = "";
    for(var i=(size - 1); i>=0; i=i-1)
    {
        value = value + String.fromCharCode(bytes[index+i]);
    }
    return value;
}

function getValueFromBytesBigEndianFormat(bytes, index, size)
{
    var value = 0;
    for(var i=0; i<(size-1); i=i+1)
    {
        value = (value | bytes[index+i]) << 8; 
    }
    value = value | bytes[index+size-1]
    return (value >>> 0); // to unsigned
}

function getValueFromBytesLittleEndianFormat(bytes, index, size)
{
    var value = 0;
    for(var i=(size-1); i>0; i=i-1)
    {
        value = (value | bytes[index+i]) << 8; 
    }
    value = value | bytes[index]
    return (value >>> 0); // to unsigned
}

function getDigitStringArrayNoFormat(bytes, index, size)
{
  var hexString = []
  for(var i=0; i<size; i=i+1)
  {
    hexString.push(bytes[index+i].toString(16));
  }
  return hexString
}

function getDigitStringArrayEvenFormat(bytes, index, size)
{
  var hexString = []
  for(var i=0; i<size; i=i+1)
  {
    hexString.push(bytes[index+i].toString(16));
  }
  return hexString.map(toEvenHEX)
}

function toEvenHEX(hex)
{
  if(hex.length == 1)
  {
    return "0"+hex;
  }
  return hex;
}

function getSignedIntegerFromInteger(integer, size) 
{
    var signMask = 1 << (size * 8 - 1);
    var dataMask = (1 << (size * 8 - 1)) - 1;
    if(integer & signMask) 
    {
        return -(~integer & dataMask) - 1;
    }else 
    {
        return integer & dataMask;
    }
}

/************************************************************************************************************/

// Decode decodes an array of bytes into an object. (ChirpStack v3)
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes, variables) 
{
    if(fPort == CONFIG_INFO.PORT)
    {
        return decodeBasicInformation(bytes);
    }else if(fPort >= 1 && fPort <= 10)
    {
        return decodeDeviceData(bytes);
    }else if(fPort == CONFIG_STATE.PORT)
    {
        return decodeChangeState(bytes);
    }else if(fPort == CONFIG_LOGGING.PORT)
    {
        return decodeEventLogging(bytes);
    }
    return {error: "Incorrect fPort", fPort : fPort};
}

// Decode uplink function. (ChirpStack v4 , TTN)
//
// Input is an object with the following fields:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - data = Object representing the decoded payload.
function decodeUplink(input) {
    return {
        data: Decode(input.fPort, input.bytes, input.variables)
    };
}

/************************************************************************************************************/

// Encode encodes the given object into an array of bytes. (ChirpStack v3)
//  - fPort contains the LoRaWAN fPort number
//  - obj is an object, e.g. {"temperature": 22.5}
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an array of bytes, e.g. [225, 230, 255, 0]
function Encode(fPort, obj, variables) {
    try
    {
        if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.CONFIG)
        {
            return encodeDeviceConfiguration(obj[CONFIG_DOWNLINK.CONFIG], variables);
        }
        else if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.DYNAMIC)
        {
            return encodeDynamicLimitControl(obj[CONFIG_DOWNLINK.DYNAMIC], variables);
        }
        else if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.RELAY)
        {
            return encodeRelayControl(obj[CONFIG_DOWNLINK.RELAY], variables);
        }
        else if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.MEASURE)
        {
            return encodePeriodicPackage(obj[CONFIG_DOWNLINK.MEASURE], variables);
        }
        else if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.REQUEST)
        {
            return encodeRequestSettings(obj[CONFIG_DOWNLINK.REQUEST], variables);
        }
    }catch(error)
    {

    }
    return [];
}

// Encode downlink function. (ChirpStack v4 , TTN)
//
// Input is an object with the following fields:
// - data = Object representing the payload that must be encoded.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - bytes = Byte array containing the downlink payload.
function encodeDownlink(input) {
    return {
        bytes: Encode(null, input.data, input.variables)
    };
}

/************************************************************************************************************/

// Constants for device configuration 
var CONFIG_DEVICE = {
    PORT : 50,
    CHANNEL : parseInt("0xFF", 16),
    TYPES : {
        "Restart" : {TYPE : parseInt("0x0B", 16), SIZE : 1, MIN : 1, MAX : 1,},
        "DigitalInput" : {TYPE : parseInt("0x47", 16), SIZE : 1, MIN : 0, MAX : 1, CHANNEL : parseInt("0x08", 16),},
        "CurrentLimitFallback" : {TYPE : parseInt("0x32", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "VoltageLimitFallback" : {TYPE : parseInt("0x33", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "PowerLimitFallback" : {TYPE : parseInt("0x34", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "DeactivationDelayFallback" : {TYPE : parseInt("0x35", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "ActivationDelayFallback" : {TYPE : parseInt("0x36", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "OffsetCurrentFallback" : {TYPE : parseInt("0x37", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "OffsetDelayFallback" : {TYPE : parseInt("0x38", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "ResetTimeFallback" : {TYPE : parseInt("0x39", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "ResetAmountFallback" : {TYPE : parseInt("0x3A", 16), SIZE : 1, MIN : 0, MAX : 255,}
    }
}

// Constants for Dynamic limit control
var CONFIG_DYNAMIC = {
    PORT : 50,
    CHANNEL : parseInt("0x01", 16),
    TYPES : {
        "CurrentLimit" : {TYPE : parseInt("0x32", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "VoltageLimit" : {TYPE : parseInt("0x33", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "PowerLimit" : {TYPE : parseInt("0x34", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "DeactivationDelay" : {TYPE : parseInt("0x35", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "ActivationDelay" : {TYPE : parseInt("0x36", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "OffsetCurrent" : {TYPE : parseInt("0x37", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "OffsetDelay" : {TYPE : parseInt("0x38", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "ResetTime" : {TYPE : parseInt("0x39", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "ResetAmount" : {TYPE : parseInt("0x3A", 16), SIZE : 1, MIN : 0, MAX : 255,}
    }
}

// Constants for Relay control
var CONFIG_RELAY = {
    PORT : 50,
    CHANNEL : parseInt("0x07", 16),
    TYPES : {
        "Reset" : {TYPE : parseInt("0x46", 16), SIZE : 1, MIN : 1, MAX : 1,},
        "ControlMode" : {TYPE : parseInt("0x47", 16), SIZE : 1, MIN : 0, MAX : 1,},
        "RelayCommand" : {TYPE : parseInt("0x48", 16), SIZE : 1, MIN : 0, MAX : 1,}
    }
}

// Constants for device periodic package 
var CONFIG_PERIODIC = {
    CHANNEL : parseInt("0xFF", 16),
    TYPES : {
        "Interval" : {TYPE : parseInt("0x14", 16), SIZE : 1, MIN : 1, MAX : 255,},
        "Mode" : {TYPE : parseInt("0x15", 16), SIZE : 1, MIN : 0, MAX : 1,},
        "Status" : {TYPE : parseInt("0x16", 16), SIZE : 1, MIN : 0, MAX : 1,},
        "Measurement" : {TYPE : parseInt("0x17", 16), SIZE : 1, MIN : 0, MAX : 10,},
    },
    MEASUREMENTS : {
        Index : "0x00",
        Timestamp : "0x01",
        DataloggerTimestamp : "0x03",
        ActiveEnergyImportL1T1 : "0x04",
        ActiveEnergyImportL1T2 : "0x05",
        ActiveEnergyExportL1T1 : "0x06",
        ActiveEnergyExportL1T2 : "0x07",
        ReactiveEnergyImportL1T1 : "0x08",
        ReactiveEnergyImportL1T2 : "0x09",
        ReactiveEnergyExportL1T1 : "0x0A",
        ReactiveEnergyExportL1T2 : "0x0B",
        VoltageL1N : "0x0C",
        CurrentL1 : "0x10",
        ActivePowerL1 : "0x14",
        ReactivePowerL1 : "0x17",
        ApparentPowerL1 : "0x1A",
        PowerFactorL1 : "0x1D",
        PhaseAngleL1 : "0x20",
        Frequency : "0x23",
        TotalSystemActivePower : "0x24",
        TotalSystemReactivePower : "0x25",
        TotalSystemApparentPower : "0x26",
        MaximumL1CurrentDemand : "0x27",
        AveragePower : "0x2A",
        MIDYearofCertification : "0x2B",
        ManufacturedYear : "0xF0",
        FirmwareVersion : "0xF1",
        HardwareVersion : "0xF2",
    }
}

// Constants for request settings
var CONFIG_REQUEST = {
    CHANNEL : parseInt("0x02", 16),
    TYPE : parseInt("0x0B", 16),
    SETTINGS : {
        CurrentLimitFallback : "0x3C",
        VoltageLimitFallback : "0x3D",
        PowerLimitFallback : "0x3E",
        DeactivationDelayFallback : "0x3F",
        ActivationDelayFallback : "0x40",
        OffsetCurrentFallback : "0x41",
        OffsetDelayFallback : "0x42",
        ResetTimeFallback : "0x43",
        ResetAmountFallback : "0x44",
        CurrentLimitDynamic : "0x50",
        VoltageLimitDynamic : "0x51",
        PowerLimitDynamic : "0x52",
        DeactivationDelayDynamic : "0x53",
        ActivationDelayDynamic : "0x54",
        OffsetCurrentDynamic : "0x55",
        OffsetDelayDynamic : "0x56",
        ResetTimeDynamic : "0x57",
        ResetAmountDynamic : "0x58",
    }

}

// Constants for downlink type (Config or Measure)
var CONFIG_DOWNLINK = {
    TYPE    : "Type",
    CONFIG  : "Config",
    DYNAMIC : "Dynamic",
    RELAY   : "Relay",
    MEASURE : "Measure",
    REQUEST : "RequestSettings"
}

function encodeDeviceConfiguration(obj, variables)
{
    var encoded = []
    var index = 0;
    var field = ["Param", "Value"];
    try
    {
        var config = CONFIG_DEVICE.TYPES[obj[field[0]]];
        var value = obj[field[1]];
        if(obj[field[1]] >= config.MIN && obj[field[1]] <= config.MAX)
        {
            if("CHANNEL" in config)
            {
                encoded[index] = config.CHANNEL;
            }else
            {
                encoded[index] = CONFIG_DEVICE.CHANNEL;
            }
            index = index + 1;
            encoded[index] = config.TYPE;
            index = index + 1;
            for(var i=1; i<=config.SIZE; i=i+1)
            {
                encoded[index] = (value >> 8*(config.SIZE - i)) % 256;
                index = index + 1;
            }
        }else
        {
            // Error
            return [];
        }
    }catch(error)
    {
        // Error
        return [];
    }
    return encoded;
}

function encodeDynamicLimitControl(obj, variables)
{
    var encoded = []
    var index = 0;
    var field = ["Param", "Value"];
    try
    {
        var config = CONFIG_DYNAMIC.TYPES[obj[field[0]]];
        var value = obj[field[1]];
        if(obj[field[1]] >= config.MIN && obj[field[1]] <= config.MAX)
        {
            encoded[index] = CONFIG_DYNAMIC.CHANNEL;
            index = index + 1;
            encoded[index] = config.TYPE;
            index = index + 1;
            for(var i=1; i<=config.SIZE; i=i+1)
            {
                encoded[index] = (value >> 8*(config.SIZE - i)) % 256;
                index = index + 1;
            }
        }else
        {
            // Error
            return [];
        }
    }catch(error)
    {
        // Error
        return [];
    }
    return encoded;
}

function encodeRelayControl(obj, variables)
{
    var encoded = []
    var index = 0;
    var field = ["Param", "Value"];
    try
    {
        var config = CONFIG_RELAY.TYPES[obj[field[0]]];
        var value = obj[field[1]];
        if(obj[field[1]] >= config.MIN && obj[field[1]] <= config.MAX)
        {
            encoded[index] = CONFIG_RELAY.CHANNEL;
            index = index + 1;
            encoded[index] = config.TYPE;
            index = index + 1;
            for(var i=1; i<=config.SIZE; i=i+1)
            {
                encoded[index] = (value >> 8*(config.SIZE - i)) % 256;
                index = index + 1;
            }
        }else
        {
            // Error
            return [];
        }
    }catch(error)
    {
        // Error
        return [];
    }
    return encoded;
}

function encodePeriodicPackage(obj, variables)
{
    var encoded = []
    var index = 0;
    var field = ["Interval", "Mode", "Status", "Measurement"];
    try 
    {
        // Encode Interval, Mode, Status
        for(var i=0; i<3; i=i+1)
        {
            if(field[i] in obj)
            {
                var config = CONFIG_PERIODIC.TYPES[field[i]];
                if(obj[field[i]] >= config.MIN && obj[field[i]] <= config.MAX)
                {
                    encoded[index] = CONFIG_PERIODIC.CHANNEL;
                    index = index + 1;
                    encoded[index] = config.TYPE;
                    index = index + 1;
                    encoded[index] = obj[field[i]];
                    index = index + 1;
                }else
                {
                    // Error
                    return [];
                }
            }
        }
        // Encode Measurement
        if(field[3] in obj)
        {
            var measurements = obj[field[3]];
            var LENGTH = measurements.length;
            var config = CONFIG_PERIODIC.TYPES[field[3]];
            if(LENGTH > config.MAX)
            {
                // Error
                return [];
            }
            var measurement = "";
            if(LENGTH > 0)
            {
                encoded[index] = CONFIG_PERIODIC.CHANNEL;
                index = index + 1;
                encoded[index] = config.TYPE;
                index = index + 1;
            }
            for(var i=0; i<LENGTH; i=i+1)
            {
                measurement = measurements[i];
                if(measurement in CONFIG_PERIODIC.MEASUREMENTS)
                {
                    encoded[index] = parseInt(CONFIG_PERIODIC.MEASUREMENTS[measurement], 16);
                    index = index + 1;
                }else
                {
                    // Error
                    return [];
                }
            }
        }

    }catch(error)
    {
        // Error
        return [];
    }

    return encoded;
}

function encodeRequestSettings(obj, variables){
    var encoded = []
    var index = 0;
    var LENGTH = obj.length;
    try 
    {
        // Encode each request setting
        for(var i=0; i<LENGTH; i=i+1)
        {
            if(obj[i] in CONFIG_REQUEST.SETTINGS)
            {
                encoded[index] = CONFIG_REQUEST.CHANNEL;
                index = index + 1;
                encoded[index] = CONFIG_REQUEST.TYPE;
                index = index + 1;
                encoded[index] = parseInt(CONFIG_REQUEST.SETTINGS[obj[i]], 16);
                index = index + 1;
            }
        }       
    }catch(error)
    {
        // Error
        return [];
    }

    return encoded;
}

