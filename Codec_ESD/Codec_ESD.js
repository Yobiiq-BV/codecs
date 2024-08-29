/**
 * Codec for ESD device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 08 August 2024
 * Update  Date : 29 August 2024
 */

// Configuration constants for device basic info
var CONFIG_INFO = {
    FPORT    : 50,
    CHANNEL  : parseInt("0xFF", 16),
    TYPES    : {
        "0x05" : {SIZE : 2, NAME : "HardwareVersion", DIGIT: false},
        "0x04" : {SIZE : 2, NAME : "FirmwareVersion", DIGIT: false},
        "0x03" : {SIZE : 4, NAME : "DeviceSerialNumber"},
        "0x01" : {SIZE : 0, NAME : "Manufacturer"}, // size to be determinated
        "0x02" : {SIZE : 0, NAME : "DeviceModel"},  // size to be determinated
        "0x07" : {SIZE : 1, NAME : "BatteryPercentage"},
        "0x08" : {SIZE : 1, NAME : "BatteryVoltage", RESOLUTION: 0.1},
        "0x11" : {SIZE : 1, NAME : "DeviceClass",
            VALUES     : {
                "0x00" : "Class A",
                "0x01" : "Class B",
                "0x02" : "Class C",
            },
        },
        "0x06" : {SIZE : 1, NAME : "PowerEvent",
            VALUES     : {
                "0x00" : "AC Power Off",
                "0x01" : "AC Power On",
            },
        }
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for device periodic data
 var CONFIG_PERIODIC = {
    CHANNEL  : parseInt("0xDD", 16),
    FPORT_MIN : 1,
    FPORT_MAX : 5,
    TYPES : {
        "0xFE" : {SIZE: 4, TYPE: "U32", NAME : "Timestamp"},
        "0xFD" : {SIZE: 4, TYPE: "U32", NAME : "DataloggerTimestamp"},
        "0x07" : {SIZE : 1, NAME : "BatteryPercentage"},
        "0x08" : {SIZE : 1, NAME : "BatteryVoltage", RESOLUTION: 0.1},
        "0x12" : {SIZE: 1, NAME: "ADR", VALUES: {"0x00" : "disabled", "0x01" : "enabled",}},
        "0x13" : {SIZE: 1, NAME: "SF", SIZE: 1, VALUES: {
                "0x00" : "SF12BW125",
                "0x01" : "SF11BW125",
                "0x02" : "SF10BW125",
                "0x03" : "SF9BW125",
                "0x04" : "SF8BW125",
                "0x05" : "SF7BW125",
                "0x06" : "SF7BW250",
            }
        },
        "0x14" : {SIZE: 1, NAME : "LorawanWatchdogFunction", VALUES: {"0x00" : "disabled", "0x01" : "enabled",},},
        "0x15" : {SIZE: 2, NAME : "LorawanWatchdogTimeout",},
        "0x16" : {SIZE: 1, NAME : "LorawanWatchdogAlarm", VALUES: {"0x00" : "normal", "0x01" : "alarm",},},
        "0x20" : {SIZE: 1, NAME : "DeviceOperationMode", VALUES: {"0x00" : "factory", "0x01" : "production",}},
        "0xB0" : {SIZE: 2, NAME : "Temperature", RESOLUTION: 0.01, SIGNED:true},
        "0xB1" : {SIZE: 2, NAME : "Setpoint", RESOLUTION: 0.01, SIGNED:true},
        "0xB2" : {SIZE: 2, NAME : "Humidity", RESOLUTION: 0.01},
        "0xB3" : {SIZE: 2, NAME : "OutsideTemperature", RESOLUTION: 0.01, SIGNED:true},
        "0xB4" : {SIZE: 2, NAME : "Co2"},
        "0xB5" : {SIZE: 2, NAME : "OutsideHumidity", RESOLUTION: 0.01},
        "0xB6" : {SIZE: 2, NAME : "VocIndex"},
        "0xB7" : {SIZE: 2, NAME : "Light"},
        "0xB8" : {SIZE: 2, NAME : "Motion"},
        "0xB9" : {SIZE: 2, NAME : "NoxIndex"},
        "0xA6" : {SIZE: 2, NAME : "VocRawValue"},
        "0xA9" : {SIZE: 2, NAME : "NoxRawValue"},
        "0xBA" : {SIZE: 2, NAME : "TemperatureCorrection", RESOLUTION: 0.01, SIGNED:true},
        "0xBB" : {SIZE: 2, NAME : "HumidityCorrection", RESOLUTION: 0.01, SIGNED:true},
        "0xBC" : {SIZE: 2, NAME : "Co2Correction", SIGNED:true},
        "0xBD" : {SIZE: 2, NAME : "VocCorrection", SIGNED:true},
        "0xBE" : {SIZE: 2, NAME : "LightCorrection", SIGNED:true},
        "0xBF" : {SIZE: 2, NAME : "MotionCorrection", SIGNED:true},
        "0xCA" : {SIZE: 2, NAME : "TemperatureInterval"},
        "0xCB" : {SIZE: 2, NAME : "HumidityInterval"},
        "0xCC" : {SIZE: 2, NAME : "Co2Interval"},
        "0xCD" : {SIZE: 2, NAME : "VocInterval"},
        "0xCE" : {SIZE: 2, NAME : "LightInterval"},
        "0xCF" : {SIZE: 2, NAME : "MotionInterval"},
        "0xD0" : {SIZE: 1, NAME : "DisplayShowTemperature", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD1" : {SIZE: 1, NAME : "DisplayShowSetpoint", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD2" : {SIZE: 1, NAME : "DisplayShowHumidity", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD3" : {SIZE: 1, NAME : "DisplayShowWeather", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD4" : {SIZE: 1, NAME : "DisplayShowCo2", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD5" : {SIZE: 1, NAME : "DisplayShowCo2Smiley", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD6" : {SIZE: 1, NAME : "DisplayShowVoc", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD7" : {SIZE: 1, NAME : "DisplayShowLight", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xD8" : {SIZE: 1, NAME : "DisplayShowMotion", VALUES: {"0x00" : "hidden", "0x01" : "displayed",}},
        "0xDA" : {SIZE: 1, NAME : "DisplayLanguage", VALUES: {
            "0x00" : "english", 
            "0x01" : "french",
            "0x02" : "dutch",
            "0x03" : "german",
            "0x04" : "italian",
            "0x05" : "spanish",
            "0x06" : "finnish",}
        },
        "0xDB" : {SIZE: 1, NAME : "DisplayTemperatureUnit", VALUES: {"0x0C" : "celsius", "0x0F" : "fahrenheit",}},
        "0xDC" : {SIZE: 2, NAME : "Co2GoodThreshold",},
        "0xDD" : {SIZE: 2, NAME : "Co2BadThreshold",},
        "0xDE" : {SIZE: 1, NAME : "WeatherPrediction", VALUES: {
            "0x00" : "sunny",
            "0x01" : "cloudy",
            "0x02" : "rainy",
            "0x03" : "snow",}
        },
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for alarm packet
var CONFIG_ALARM = {
    FPORT : 11,
    CHANNEL : parseInt("0xAA", 16),
    TYPES : {
        "0xFE" : {SIZE: 4, NAME : "Timestamp"},
        "0x00" : {SIZE: 1, NAME : "InternalTemperatureAlarm",
            VALUES     : {
                "0x00" : "normal",
                "0x01" : "alarm",
            },
        },
        "0x01" : {SIZE: 1, NAME : "LorawanWatchdogAlarm",
            VALUES     : {
                "0x00" : "normal",
                "0x01" : "alarm",
            },
        },
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for parameters reading
var CONFIG_PARAMETER = {
    FPORT : 100,
    CHANNEL : parseInt("0xFF", 16),
    TYPES : CONFIG_PERIODIC.TYPES,
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
        while(index < LENGTH)
        {
            channel = bytes[index];
            index = index + 1;
            // Channel checking
            if(channel != CONFIG_INFO.CHANNEL)
            {
                continue;
            }
            // Type of basic information
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            var info = CONFIG_INFO.TYPES[type];
            size = info.SIZE;
            // Decoding
            var value = 0;
            if(info.DIGIT || info.DIGIT == false)
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
                    value = value.toString().toUpperCase();
                }

            }
            else if(info.VALUES)
            {
                // Decode into STRING (VALUES specified in CONFIG_INFO)
                value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                value = info.VALUES[value];
            }else
            {
                if(size == 0)
                {
                    size = getSizeBasedOnChannel(bytes, index, channel);
                    // Decode into STRING format
                    value = getStringFromBytesBigEndianFormat(bytes, index, size);
                    
                }else
                {
                    // Decode into DECIMAL format
                    value = getValueFromBytesBigEndianFormat(bytes, index, size);
                }
            }
            if(info.RESOLUTION)
            {
                value = value * info.RESOLUTION;
                value = parseFloat(value.toFixed(2));
            }
            decoded[info.NAME] = value;
            index = index + size;
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
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_PERIODIC.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_PERIODIC.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH)
        {
            channel = bytes[index];
            index = index + 1;
            // Channel checking
            if(channel != CONFIG_PERIODIC.CHANNEL)
            {
                continue;
            }
            // Type of basic information
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            var info = CONFIG_PERIODIC.TYPES[type] ? CONFIG_PERIODIC.TYPES[type] : null;
            if(info == null)
            {
                continue;
            }
            size = info.SIZE ? info.SIZE : 0;
            if(size == 0)
            {
                continue;
            }
            var value = getValueFromBytesBigEndianFormat(bytes, index, size);
            if(info.SIGNED)
            {
                value = getSignedIntegerFromInteger(value, size);
            }
            if(info.VALUES)
            {
                value = "0x" + toEvenHEX(value.toString(16).toUpperCase());
                value = info.VALUES[value];
            }
            if(info.RESOLUTION)
            {
                value = value * info.RESOLUTION;
                value = parseFloat(value.toFixed(2));
            }
            decoded[info.NAME] = value;
            index = index + size;
        }
    }catch(error)
    {
        decoded[CONFIG_PERIODIC.ERROR_NAME] = error.message;
    }

    return decoded;
}

function decodeAlarmPacket(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_ALARM.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_ALARM.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH)
        {
            channel = bytes[index];
            index = index + 1;
            // Channel checking
            if(channel != CONFIG_ALARM.CHANNEL)
            {
                continue;
            }
            // Type of alarm
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            var info = CONFIG_ALARM.TYPES[type] ? CONFIG_ALARM.TYPES[type] : null;
            if(info == null)
            {
                continue;
            }
            size = info.SIZE ? info.SIZE : 0;
            if(size == 0)
            {
                continue;
            }
            // Decoding
            var value = getValueFromBytesBigEndianFormat(bytes, index, size);
            if(info.VALUES)
            {
                value = "0x" + toEvenHEX(value.toString(16).toUpperCase());
                value = info.VALUES[value];
            }
            decoded[info.NAME] = value;
            index = index + size;
        }
    }catch(error)
    {
        decoded[CONFIG_ALARM.ERROR_NAME] = error.message;
    }

    return decoded;
}

function decodeParameters(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_PARAMETER.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_PARAMETER.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH)
        {
            channel = bytes[index];
            index = index + 1;
            // Channel checking
            if(channel != CONFIG_PARAMETER.CHANNEL)
            {
                continue;
            }
            // Type of parameter
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            var info = CONFIG_PARAMETER.TYPES[type] ? CONFIG_PARAMETER.TYPES[type] : null;
            if(info == null)
            {
                continue;
            }
            size = info.SIZE ? info.SIZE : 0;
            if(size == 0)
            {
                continue;
            }
            // Decoding
            var value = getValueFromBytesBigEndianFormat(bytes, index, size);
            if(info.SIGNED)
            {
                value = getSignedIntegerFromInteger(value, size);
            }
            if(info.VALUES)
            {
                value = "0x" + toEvenHEX(value.toString(16).toUpperCase());
                value = info.VALUES[value];
            }
            if(info.RESOLUTION)
            {
                value = value * info.RESOLUTION;
                value = parseFloat(value.toFixed(2));
            }
            decoded[info.NAME] = value;
            index = index + size;
        }
    }catch(error)
    {
        decoded[CONFIG_PARAMETER.ERROR_NAME] = error.message;
    }

    return decoded;
}

/**  Helper functions  **/

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
    value = value | bytes[index+size-1];
    return (value >>> 0); // to unsigned
}

function getValueFromBytesLittleEndianFormat(bytes, index, size)
{
    var value = 0;
    for(var i=(size-1); i>0; i=i-1)
    {
        value = (value | bytes[index+i]) << 8; 
    }
    value = value | bytes[index];
    return (value >>> 0); // to unsigned
}

function getDigitStringArrayNoFormat(bytes, index, size)
{
  var hexString = []
  for(var i=0; i<size; i=i+1)
  {
    hexString.push(bytes[index+i].toString(16));
  }
  return hexString;
}

function getDigitStringArrayEvenFormat(bytes, index, size)
{
  var hexString = []
  for(var i=0; i<size; i=i+1)
  {
    hexString.push(bytes[index+i].toString(16));
  }
  return hexString.map(toEvenHEX);
}

function toEvenHEX(hex)
{
  if(hex.length == 1)
  {
    return "0"+hex;
  }
  return hex;
}

function getSizeBasedOnChannel(bytes, index, channel)
{
    var size = 0;
    while(index + size < bytes.length && bytes[index + size] != channel)
    {
        size = size + 1;
    }
    return size;
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
    if(fPort == 0)
    {
        return {mac: "MAC command received", fPort: fPort};
    }
    if(fPort == CONFIG_INFO.FPORT)
    {
        return decodeBasicInformation(bytes);
    }else if(fPort >= CONFIG_PERIODIC.FPORT_MIN && fPort <= CONFIG_PERIODIC.FPORT_MAX)
    {
        return decodeDeviceData(bytes);
    }else if(fPort == CONFIG_ALARM.FPORT)
    {
        return decodeAlarmPacket(bytes);
    }else if(fPort == CONFIG_PARAMETER.FPORT)
    {
        return decodeParameters(bytes);
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
        else if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.PERIODIC)
        {
            return encodeUplinkConfiguration(obj[CONFIG_DOWNLINK.PERIODIC], variables);
        }
        else if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.READING)
        {
            return encodeParamtersReading(obj[CONFIG_DOWNLINK.READING], variables);
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

// Constants for downlink type
var CONFIG_DOWNLINK = {
    TYPE    : "Type",
    CONFIG  : "Config",
    PERIODIC: "Periodic",
    READING : "Reading"
}

// Constants for device configuration 
var CONFIG_DEVICE = {
    PORT : 50,
    REGISTER_CHANNEL : parseInt("0xFF", 16),
    PERIODIC_CHANNEL : parseInt("0xFF", 16),
    READING_TYPE : parseInt("0xCC", 16),
    DATA_MAX_SIZE : 10,
    REGISTERS : {
        "RebootDevice": {TYPE: parseInt("0x0A", 16), SIZE: 1, MIN: 1, MAX: 1, RIGHT:"WRITE_ONLY",},
        "Restart": {TYPE: parseInt("0x0B", 16), SIZE: 1, MIN: 1, MAX: 1, RIGHT:"WRITE_ONLY",},
        "ADR": {TYPE: parseInt("0x12", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "SF": {TYPE: parseInt("0x13", 16), SIZE: 1, MIN: 0, MAX: 6,},
        "LorawanWatchdogFunction": {TYPE: parseInt("0x14", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "LorawanWatchdogTimeout": {TYPE : parseInt("0x15", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "LorawanWatchdogAlarm": {TYPE: parseInt("0x16", 16), RIGHT:"READ_ONLY"},
        "DeviceOperationMode": {TYPE: parseInt("0x20", 16), RIGHT:"READ_ONLY"},
        "Temperature": {TYPE: parseInt("0xB0", 16), RIGHT:"READ_ONLY"},
        "Setpoint": {TYPE: parseInt("0xB1", 16), RIGHT:"READ_ONLY"},
        "Humidity": {TYPE: parseInt("0xB2", 16), RIGHT:"READ_ONLY"},
        "OutsideTemperature": {TYPE: parseInt("0xB3", 16), RIGHT:"READ_ONLY"},
        "Co2": {TYPE: parseInt("0xB4", 16), RIGHT:"READ_ONLY"},
        "OutsideHumidity": {TYPE: parseInt("0xB5", 16), RIGHT:"READ_ONLY"},
        "VocIndex": {TYPE: parseInt("0xB6", 16), RIGHT:"READ_ONLY"},
        "Light": {TYPE: parseInt("0xB7", 16), RIGHT:"READ_ONLY"},
        "Motion": {TYPE: parseInt("0xB8", 16), RIGHT:"READ_ONLY"},
        "NoxIndex": {TYPE: parseInt("0xB9", 16), RIGHT:"READ_ONLY"},
        "VocRawValue": {TYPE: parseInt("0xA6", 16), RIGHT:"READ_ONLY"},
        "NoxRawValue": {TYPE: parseInt("0xA9", 16), RIGHT:"READ_ONLY"},
        "TemperatureCorrection": {TYPE : parseInt("0xBA", 16), SIZE: 2, MIN: -32768, MAX: 32767,},
        "HumidityCorrection": {TYPE : parseInt("0xBB", 16), SIZE: 2, MIN: -32768, MAX: 32767,},
        "Co2Correction": {TYPE : parseInt("0xBC", 16), SIZE: 2, MIN: -32768, MAX: 32767,},
        "VocCorrection": {TYPE : parseInt("0xBD", 16), SIZE: 2, MIN: -32768, MAX: 32767,},
        "LightCorrection": {TYPE : parseInt("0xBE", 16), SIZE: 2, MIN: -32768, MAX: 32767,},
        "MotionCorrection": {TYPE : parseInt("0xBF", 16), SIZE: 2, MIN: -32768, MAX: 32767,},
        "TemperatureInterval": {TYPE : parseInt("0xCA", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "HumidityInterval": {TYPE : parseInt("0xCB", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "Co2Interval": {TYPE : parseInt("0xCC", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "VocInterval": {TYPE : parseInt("0xCD", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "LightInterval": {TYPE : parseInt("0xCE", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "MotionInterval": {TYPE : parseInt("0xCF", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "DisplayShowTemperature": {TYPE: parseInt("0xD0", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowSetpoint": {TYPE: parseInt("0xD1", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowHumidity": {TYPE: parseInt("0xD2", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowWeather": {TYPE: parseInt("0xD3", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowCo2": {TYPE: parseInt("0xD4", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowCo2Smiley": {TYPE: parseInt("0xD5", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowVoc": {TYPE: parseInt("0xD6", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowLight": {TYPE: parseInt("0xD7", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayShowMotion": {TYPE: parseInt("0xD8", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "DisplayLanguage": {TYPE: parseInt("0xDA", 16), SIZE: 1, MIN: 0, MAX: 6,},
        "DisplayTemperatureUnit": {TYPE: parseInt("0xDB", 16), SIZE: 1, MIN: 12, MAX: 15,},
        "Co2GoodThreshold": {TYPE : parseInt("0xDC", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "Co2BadThreshold": {TYPE : parseInt("0xDD", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "WeatherPrediction": {TYPE: parseInt("0xDE", 16), SIZE: 1, MIN: 0, MAX: 3,},
    }
}

function encodeDeviceConfiguration(obj, variables)
{
    var encoded = [];
    var index = 0;
    var config = {};
    var param = "";
    var value = 0;
    try
    {
        for(var i=0; i<obj.length; i=i+1)
        {
            param = obj[i]["Param"];
            value = obj[i]["Value"];
            var config = CONFIG_DEVICE.REGISTERS[param];
            if(config.RIGHT && config.RIGHT === "READ_ONLY")
            {
                return [];  // error
            }        
            if(value >= config.MIN && value <= config.MAX)
            {
                encoded[index] = CONFIG_DEVICE.REGISTER_CHANNEL;
                index = index + 1;
                encoded[index] = config.TYPE;
                index = index + 1;
                if(config.SIZE == 2)
                {
                    value = parseInt(value.toFixed(0));
                    encoded[index] = (value >> 8) % 256;
                    index = index + 1;
                    encoded[index] = value % 256;
                    index = index + 1;
                }else
                {
                    encoded[index] = value;
                    index = index + 1;
                }
            }else
            {
                // Error
                return [];
            }
        }
    }catch(error)
    {
        // Error
        return [];
    }
    return encoded;
}

function encodeUplinkConfiguration(obj, variables)
{
    var encoded = []
    var index = 0;
    var firstType = parseInt("0x14", 16);
    var field = ["UplinkInterval", "Mode", "Status", "Registers"];
    var fieldIndex = 0;
    var isFieldPresent = false;
    var value = 0;
    var registers = [];
    var register = "";
    try 
    {
        // Encode UplinkInterval, Mode, Status
        for(fieldIndex=0; fieldIndex<3; fieldIndex=fieldIndex+1)
        {
            isFieldPresent = false;
            if(field[fieldIndex] in obj)
            {
                isFieldPresent = true;
            }
            if(!isFieldPresent)
            {
                return [];  // error
            }
            value = obj[field[fieldIndex]];
            if((fieldIndex < 1 && value >= 1 && value <= 65535) || 
                (fieldIndex >= 1 && value >= 0 && value <= 1))
            {
                encoded[index] = CONFIG_DEVICE.PERIODIC_CHANNEL;
                index = index + 1;
                encoded[index] = firstType + fieldIndex;
                index = index + 1;
                if(fieldIndex == 0)
                {
                    // 2 bytes
                    encoded[index] = (value >> 8) % 256;
                    index = index + 1;
                    encoded[index] = value % 256;
                    index = index + 1;
                }else
                {
                    // 1 byte
                    encoded[index] = value;
                    index = index + 1;
                }
            }else
            {
                // Error
                return [];
            }
        }
        // Encode registers
        isFieldPresent = false;
        if(field[fieldIndex] in obj)
        {
            isFieldPresent = true;
        }
        if(!isFieldPresent)
        {
            return [];  // error
        }
        registers = obj[field[fieldIndex]];
        if(registers.length < 1 || registers.length > CONFIG_DEVICE.DATA_MAX_SIZE)
        {
            return [];  // Error
        }
        encoded[index] = CONFIG_DEVICE.PERIODIC_CHANNEL;
        index = index + 1;
        encoded[index] = firstType + fieldIndex;
        index = index + 1;
        var config = {};
        for(var i=0; i<registers.length; i=i+1)
        {
            register = registers[i];
            if(register in CONFIG_DEVICE.REGISTERS)
            {
                config = CONFIG_DEVICE.REGISTERS[register];
                encoded[index] =  config.TYPE;
                index = index + 1;
            }else{
                return [];  // error (registers not supported)
            }
        }
    }catch(error)
    {
        // Error
        return [];
    }
    return encoded;
}

function encodeParamtersReading(obj, variables)
{
    var encoded = [];
    var index = 0;
    var config = {};
    var param = "";
    try
    {
        if(obj.length > CONFIG_DEVICE.DATA_MAX_SIZE)
        {
            return []; // error
        }
        encoded[index] = CONFIG_DEVICE.REGISTER_CHANNEL;
        index = index + 1;
        encoded[index] = CONFIG_DEVICE.READING_TYPE;
        index = index + 1;
        for(var i=0; i<obj.length; i=i+1)
        {
            param = obj[i];
            var config = CONFIG_DEVICE.REGISTERS[param];
            if(config.RIGHT && config.RIGHT === "WRITE_ONLY")
            {
                return [];  // error
            }
            encoded[index] = config.TYPE;
            index = index + 1;
        }
    }catch(error)
    {
        // Error
        return [];
    }
    return encoded;
}


