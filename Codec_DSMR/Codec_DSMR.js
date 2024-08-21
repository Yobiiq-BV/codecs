/**
 * Codec for DSMR device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 28 February 2023
 * Update  Date : 08 July 2024
 */

// Configuration constants for device basic info and current settings
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

// Configuration constants for measurement
var CONFIG_MEASUREMENT = {
    "0xFE" : {SIZE : 4, NAME : "DeviceTimestamp",},
    "0x00" : {SIZE : 2, NAME : "P1Version", RESOLUTION: 0.1},
    "0x02" : {SIZE : 4, NAME : "TelegramTimestamp",},
    "0x06" : {SIZE : 4, NAME : "ElectricityDeliveredToClientT1", UNIT : "Wh",},
    "0x08" : {SIZE : 4, NAME : "ElectricityDeliveredToClientT2", UNIT : "Wh",},
    "0x0A" : {SIZE : 4, NAME : "ElectricityDeliveredByClientT1", UNIT : "Wh",},
    "0x0C" : {SIZE : 4, NAME : "ElectricityDeliveredByClientT2", UNIT : "Wh",},
    "0x0E" : {SIZE : 2, NAME : "TariffIndicator",},
    "0x10" : {SIZE : 4, NAME : "ElectricityPowerDelivered", UNIT : "W", SIGNED : true,},
    "0x12" : {SIZE : 4, NAME : "ElectricityPowerReceived", UNIT : "W", SIGNED : true,},
    "0x14" : {SIZE : 4, NAME : "NumberOfPowerFailuresInAnyPhase",},
    "0x18" : {SIZE : 0, NAME : "PowerFailureEventLog", SINGLE_EVENT_SIZE:8,},
    "0x1A" : {SIZE : 4, NAME : "NumberOfVoltageSagsL1",},
    "0x1C" : {SIZE : 4, NAME : "NumberOfVoltageSagsL2",},
    "0x1E" : {SIZE : 4, NAME : "NumberOfVoltageSagsL3",},
    "0x1F" : {SIZE : 4, NAME : "NumberOfVoltageSwellsL1",},
    "0x20" : {SIZE : 4, NAME : "NumberOfVoltageSwellsL2",},
    "0x21" : {SIZE : 4, NAME : "NumberOfVoltageSwellsL3",},
    "0x22" : {SIZE : 4, NAME : "VoltageL1", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x23" : {SIZE : 4, NAME : "VoltageL2", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x24" : {SIZE : 4, NAME : "VoltageL3", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x26" : {SIZE : 4, NAME : "CurrentL1", UNIT : "A", SIGNED : true,},
    "0x28" : {SIZE : 4, NAME : "CurrentL2", UNIT : "A", SIGNED : true,},
    "0x2A" : {SIZE : 4, NAME : "CurrentL3", UNIT : "A", SIGNED : true,},
    "0x2C" : {SIZE : 4, NAME : "ActivePowerDeliveredL1", UNIT : "W", SIGNED : true,},
    "0x2E" : {SIZE : 4, NAME : "ActivePowerDeliveredL2", UNIT : "W", SIGNED : true,},
    "0x30" : {SIZE : 4, NAME : "ActivePowerDeliveredL3", UNIT : "W", SIGNED : true,},
    "0x32" : {SIZE : 4, NAME : "ActivePowerReceivedL1", UNIT : "W", SIGNED : true,},
    "0x33" : {SIZE : 4, NAME : "ActivePowerReceivedL2", UNIT : "W", SIGNED : true,},
    "0x34" : {SIZE : 4, NAME : "ActivePowerReceivedL3", UNIT : "W", SIGNED : true,},
    "0x46" : {SIZE : 2, NAME : "DeviceTypeOnChannel1",},
    "0x50" : {SIZE : 8, NAME : "LastReadingOnChannel1",},
    "0x56" : {SIZE : 2, NAME : "DeviceTypeOnChannel2",},
    "0x60" : {SIZE : 8, NAME : "LastReadingOnChannel2",},
    "0x66" : {SIZE : 2, NAME : "DeviceTypeOnChannel3",},
    "0x70" : {SIZE : 8, NAME : "LastReadingOnChannel3",},
    "0x76" : {SIZE : 2, NAME : "DeviceTypeOnChannel4",},
    "0x80" : {SIZE : 8, NAME : "LastReadingOnChannel4",},
    "0x71" : {SIZE: 2, NAME : "InternalCircuitTemperature", RESOLUTION: 0.01},
    "0x72" : {SIZE: 1, NAME : "InternalCircuitHumidity",},
    "0x81" : {SIZE: 2, NAME : "AmbientTemperature", RESOLUTION: 0.01},
    "0x82" : {SIZE: 1, NAME : "AmbientHumidity",},
    "0xD1" : {SIZE : 4, NAME : "PulseCounterDryInput1",},
    "0xD2" : {SIZE : 4, NAME : "PulseCounterDryInput2",},
    CHANNEL : parseInt("0xDD", 16),
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
            decoded[CONFIG_MEASUREMENT.INFO_NAME] = "Downlink command succeeded";

        } else if(bytes[0] == 1)
        {
            decoded[CONFIG_MEASUREMENT.WARNING_NAME] = "Downlink command failed";
        }
        return decoded;
    }
    try
    {
        while(index < LENGTH)
        {
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

            if(size == 0)
            {
                // PowerFailureEventLog decoding
                value = getValueFromBytesBigEndianFormat(bytes, index, 4);
                index = index + 4;
                size =  measurement.SINGLE_EVENT_SIZE * value;
                decoded[measurement.NAME] = getPowerFailureEventLog(bytes, index, size);
                index = index + size;
                continue;
            }
            if(size == 8)
            {
                // Slave last reading decoding
                value = getValueFromBytesBigEndianFormat(bytes, index, 4);
                index = index + 4;
                decoded[measurement.NAME] = {};
                decoded[measurement.NAME]["timestamp"] = value;
                value = getValueFromBytesBigEndianFormat(bytes, index, 4);
                index = index + 4;
                decoded[measurement.NAME]["value"] = value;
                continue;
            }

            // Decode into DECIMAL format
            value = getValueFromBytesBigEndianFormat(bytes, index, size);
        
            if(measurement.SIGNED)
            {
                value = getSignedIntegerFromInteger(value, size);
            }
            if(measurement.RESOLUTION)
            {
                value = value * measurement.RESOLUTION;
                value = parseFloat(value.toFixed(2));
            }
            if(measurement.UNIT)
            {
                decoded[measurement.NAME] = {};
                decoded[measurement.NAME]["data"] = value;
                decoded[measurement.NAME]["unit"] = measurement["UNIT"];
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

function getPowerFailureEventLog(bytes, index, size)
{
    var decoded = [];
    for(var i=index; i<(index + size); i=i+8)
    {
        var eventLog = {};
        eventLog.timestamp = getValueFromBytesBigEndianFormat(bytes, i, 4);
        eventLog.duration = getValueFromBytesBigEndianFormat(bytes, i+4, 4);
        decoded.push(eventLog);
    }
    return decoded;
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
    }else if(fPort >= 1 && fPort <= 10)
    {
        return decodeDeviceData(bytes);
    }else if(fPort == 11)
    {
        // status packet
        return {};
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



