/**
 * Codec for SD1001 device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 12 June 2023
 * Update  Date : 12 June 2023
 */

// Configuration constants for device basic info
var CONFIG_INFO = {
    PORT     : 50,
    CHANNEL  : parseInt("0xFF", 16),
    TYPES    : {
        "0x09" : {SIZE : 2, NAME : "HardwareVersion", DIGIT: false},
        "0x0A" : {SIZE : 2, NAME : "FirmwareVersion", DIGIT: false},
        "0x16" : {SIZE : 7, NAME : "DeviceSerialNumber", DIGIT: true},
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
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for data registers
 var CONFIG_DATA = {
    "0x01" : {SIZE : 1, NAME : "BatteryLevelInPercentage",},
    "0x02" : {SIZE : 1, NAME : "PowerEvent",
        VALUES     : {
            "0x00" : "AC Power Off",
            "0x01" : "AC Power On",
        },
    },
    "0x03" : {SIZE : 1, NAME : "LowBatteryAlarm",
        VALUES     : {
            "0x00" : "Normal",
            "0x01" : "Alarm",
        },
    },
    "0x04" : {SIZE : 1, NAME : "FaultAlarm",
        VALUES     : {
            "0x00" : "Normal",
            "0x01" : "Alarm",
        },
    },
    "0x05" : {SIZE : 1, NAME : "SmokeAlarm",
        VALUES     : {
            "0x00" : "Normal",
            "0x01" : "Alarm",
        },
    },
    "0x06" : {SIZE : 1, NAME : "InterconnectAlarm",
        VALUES     : {
            "0x00" : "Normal",
            "0x01" : "Alarm",
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
            if(channel == CONFIG_INFO.CHANNEL)
            {
                // Type of basic information
                type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                index = index + 1;
                var info = CONFIG_INFO.TYPES[type]
                size = info["SIZE"];
                // Decoding
                var value = 0;
                if(size != 0)
                {
                    if("DIGIT" in info)
                    {
                        if(info["DIGIT"] == false)
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
                        // Decode into HEX STRING (VALUES specified in CONFIG_INFO)
                        value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                        value = info["VALUES"][value];
                    }else
                    {
                        // Decode into DECIMAL format
                        value = getValueFromBytesBigEndianFormat(bytes, index, size);
                    }
                    decoded[info["NAME"]] = value;
                    index = index + size;
                }
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
    var channel = "";
    var type = 0;
    var size = 0;
    var security = Object.keys(CONFIG_DATA).length;
    if(LENGTH == 1)
    {
        if(bytes[0] == 0)
        {
            decoded[CONFIG_DATA.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_DATA.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH && security != 0)
        {
            security = security - 1;
            // Channel of device data
            channel = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            // Type of device data
            type = bytes[index];
            index = index + 1;

            // No type checking

            var data = CONFIG_DATA[channel]
            size = data["SIZE"];
            // Decoding
            var value = 0;
            // Decode into DECIMAL format
            if("VALUES" in data)
            {
                // Decode into STRING (VALUES specified in CONFIG_DATA)
                value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                value = data["VALUES"][value];
            }else
            {
                // Decode into DECIMAL format
                value = getValueFromBytesBigEndianFormat(bytes, index, size);
            }
            decoded[data["NAME"]] = value;
            index = index + size;
        }
    }catch(error)
    {
        decoded[CONFIG_DATA.ERROR_NAME] = error.message;
    }
    return decoded;
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
    }else
    {
        return decodeDeviceData(bytes);
    }
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
        "ReportingInterval" : {TYPE : parseInt("0x03", 16), SIZE : 2, MIN : 1, MAX : 65535,},
        "SmokeDetector" : {TYPE : parseInt("0x00", 16), SIZE : 1, MIN : 0, MAX : 1,},
        "SilenceBuzzer" : {TYPE : parseInt("0x0A", 16), SIZE : 2, MIN : 0, MAX : 65535,},
    }
}

// Constants for downlink
var CONFIG_DOWNLINK = {
    TYPE    : "Type",
    CONFIG  : "Config"
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
        if(obj[field[1]] >= config["MIN"] && obj[field[1]] <= config["MAX"])
        {
            encoded[index] = CONFIG_DEVICE.CHANNEL;
            index = index + 1;
            encoded[index] = config["TYPE"];
            index = index + 1;
            for(var i=config["SIZE"]; i>=1; i=i-1)
            {
                encoded[index] = (value >> 8*(config["SIZE"] - i)) % 256;
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



