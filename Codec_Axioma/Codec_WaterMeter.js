/**
 * Codec for Axioma water meters : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 26 August 2024
 * Update  Date : 26 August 2024
 */

// Configuration constants for device
var CONFIG_EXTENDED_PACKET = {
    FPORT : 100,
    LENGTH : 48,
    ORDER : [
        {INDEX: 0, SIZE : 4, NAME : "CurrentTimestamp"},
        {INDEX: 4, SIZE : 1, NAME : "StatusCode"},
        {INDEX: 5, SIZE : 4, NAME : "CurrentVolume", RESOLUTION: 0.001},
        {INDEX: 9, SIZE : 4, NAME : "LogTimestamp"},
        {INDEX: 13, SIZE : 4, NAME : "LogVolume", RESOLUTION: 0.001},
    ],
    LOG_INTERVAL: 1200,  // 20 minutes
    MEASUREMENT_TOTAL : 15,
    MEASUREMENT_INDEX : 17,
    MEASUREMENT_TIMESTAMP: true, // to be calculated for each measurement
    MEASUREMENT : [
        {SIZE : 2, NAME : "deltaVolume", RESOLUTION: 0.001},
    ],
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

var CONFIG_ALARM_PACKET = {
    FPORT : 103,
    ALARM_INDEX: 4,
    NORMAL_STATUS_CODE: 0,
    STATUS: [
        { MASK: parseInt("0x04", 16), VALUE: "Low Battery" },
        { MASK: parseInt("0x08", 16), VALUE: "Permanent Error" },
        { MASK: parseInt("0x10", 16), VALUE: "Temporary Error" },
        { MASK: parseInt("0x20", 16), VALUE: "Leakage" },
        { MASK: parseInt("0xA0", 16), VALUE: "Burst" },
        { MASK: parseInt("0x60", 16), VALUE: "Backflow" },
        { MASK: parseInt("0x80", 16), VALUE: "Freeze" },
    ],    
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

var CONFIG_PARAMETER_PACKET = {
    FPORT : 101,    
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

function decodeExtendedPacket(bytes)
{
    var decoded = {};
    var index = CONFIG_EXTENDED_PACKET.MEASUREMENT_INDEX;
    try
    {
        for(var i=0; i<CONFIG_EXTENDED_PACKET.ORDER.length; i=i+1)
        {
            var info = CONFIG_EXTENDED_PACKET.ORDER[i];
            var value = 0;
            value = getValueFromBytesLittleEndianFormat(bytes, info.INDEX, info.SIZE);
        
            if(info.SIGNED)
            {
                value = getSignedIntegerFromInteger(value, info.SIZE);
            }
            if(info.RESOLUTION)
            {
                value = value * info.RESOLUTION;
                value = parseFloat(value.toFixed(3));
            }
            if(info.UNIT)
            {
                decoded[info.NAME] = {};
                decoded[info.NAME]["data"] = value;
                decoded[info.NAME]["unit"] = info["UNIT"];
            }else
            {
                decoded[info.NAME] = value;
            }
        }
        decoded.ListOfMeasurements = [
            {DataloggerTimestamp: decoded.CurrentTimestamp, Volume: decoded.CurrentVolume},
            {DataloggerTimestamp: decoded.LogTimestamp, Volume: decoded.LogVolume}
        ];
        var logVolume = decoded.LogVolume;
        for(var j=0; j<CONFIG_EXTENDED_PACKET.MEASUREMENT_TOTAL; j=j+1)
        {
            var measurements = {};

            measurements.DataloggerTimestamp = decoded.LogTimestamp + 
                (j+1)*CONFIG_EXTENDED_PACKET.LOG_INTERVAL;
            
            for(var k=0; k<CONFIG_EXTENDED_PACKET.MEASUREMENT.length; k=k+1)
            {
                var info = CONFIG_EXTENDED_PACKET.MEASUREMENT[k];
                var value = 0;
                value = getValueFromBytesLittleEndianFormat(bytes, index, info.SIZE);
            
                if(info.SIGNED)
                {
                    value = getSignedIntegerFromInteger(value, info.SIZE);
                }
                if(info.RESOLUTION)
                {
                    value = value * info.RESOLUTION;
                    value = parseFloat(value.toFixed(3));
                }
                if(info.UNIT)
                {
                    measurements[info.NAME] = {};
                    measurements[info.NAME]["data"] = value;
                    measurements[info.NAME]["unit"] = info["UNIT"];
                }else
                {
                    measurements[info.NAME] = value;
                }
                index = index + info.SIZE;
            }
            logVolume = logVolume + measurements.deltaVolume;
            measurements.Volume = parseFloat(logVolume.toFixed(3));
            decoded.ListOfMeasurements.push(measurements);
        }
    }catch(error)
    {
        decoded[CONFIG_EXTENDED_PACKET.ERROR_NAME] = error.message;
    }
    return decoded;
}

function decodeAlarmPacket(bytes)
{
    var decoded = {};
    try
    {
        // Timestamp
        decoded.Timestamp = getValueFromBytesLittleEndianFormat(bytes, 0, 4);
        // Alarms
        decoded.StatusCode = bytes[CONFIG_ALARM_PACKET.ALARM_INDEX];
        decoded.Alarms = [];
        if(decoded.StatusCode == CONFIG_ALARM_PACKET.NORMAL_STATUS_CODE)
        {
            decoded.Alarms.push("Normal");
            return decoded;
        }
        for(var i=0; i<CONFIG_ALARM_PACKET.STATUS.length; i=i+1)
        {
            var info = CONFIG_ALARM_PACKET.STATUS[i];
            if((decoded.StatusCode & info.MASK) == info.MASK)
            {
                decoded.Alarms.push(info.VALUE);
            }
        }
    }catch(error)
    {
        decoded[CONFIG_ALARM_PACKET.ERROR_NAME] = error.message;
    }

    return decoded;
}

function decodeParameterPacket(bytes)
{
    var decoded = {warning: "payload decoding not supported yet"};
    try
    {

    }catch(error)
    {
        decoded[CONFIG_PARAMETER_PACKET.ERROR_NAME] = error.message;
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
    if(variables)
    {
        if(variables.interval)
        {
            CONFIG_EXTENDED_PACKET.LOG_INTERVAL = parseInt(variables.interval);
        }
    }
    if(fPort == 0)
    {
        return {mac: "MAC command received", fPort: fPort};
    }
    if(fPort == CONFIG_EXTENDED_PACKET.FPORT)
    {
        return decodeExtendedPacket(bytes);
    }
    if(fPort == CONFIG_ALARM_PACKET.FPORT)
    {
        return decodeAlarmPacket(bytes);
    }
    if(fPort == CONFIG_PARAMETER_PACKET.FPORT)
    {
        return decodeParameterPacket(bytes);
    }
    return {error: "unknown payload"};
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



