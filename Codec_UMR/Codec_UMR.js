/**
 * Codec for UMR device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 24 September 2024
 * Update  Date : 24 September 2024
 */


// Configuration constants for device
var CONFIG_DATA = {
    LENGTH    : 13,
    DATA : [
        {INDEX: 0, SIZE : 1, NAME : "status", VALUES: {
            0:"OK", 1:"WarningMAX", 2:"ErrorMAX", 3:"ErrorMAXFreeze", 4:"WarningRet", 
            5:"ErrorRet", 6:"ErrorRetFreeze", 7:"WarningCond", 8:"ErrorCond"}
        },
        {INDEX: 1, SIZE : 1, NAME : "kickStatus", VALUES: {
            0:"Off", 1:"Primary", 2:"Pump", 3:"Secondary", 4:"Pump+Secondary"}
        },
        {INDEX: 2, SIZE : 1, NAME : "mode", VALUES: {
            0:"Off", 1:"Extern", 2:"Heating", 3:"Cooling", 4:"MainHeating", 5: "MainCooling", 6: "MainOff"}
        },
        {INDEX: 3, SIZE : 2, NAME : "ntcTemperatureMaxInput", RESOLUTION: 0.01, SIGNED: true},
        {INDEX: 5, SIZE : 2, NAME : "ntcTemperatureReturnInput", RESOLUTION: 0.01, SIGNED: true},
        {INDEX: 7, SIZE : 2, NAME : "condens", RESOLUTION: 1, SIGNED: false},
        {INDEX: 9, SIZE : 2, NAME : "thermostatRoomReading", RESOLUTION: 0.01, SIGNED: true},
        {INDEX: 11, SIZE : 2, NAME : "thermostatRoomSetpoint", RESOLUTION: 0.01, SIGNED: true},
    ],
    WARNING_NAME   : "warning",
    ERROR_NAME     : "error",
    INFO_NAME      : "info"
}


function decodeDeviceData(bytes, config)
{
    var decoded = {};
    try
    {
        for(var i=0; i<config.DATA.length; i=i+1)
        {
            var info = config.DATA[i];
            // Decoding
            var value = 0;
            value = getValueFromBytesLittleEndianFormat(bytes, info.INDEX, info.SIZE);
        
            if(info.SIGNED)
            {
                value = getSignedIntegerFromInteger(value, info.SIZE);
            }
            if(info.VALUES)
            {
                if(info.VALUES[value])
                {
                    value = info.VALUES[value];
                }
            }
            if(info.RESOLUTION)
            {
                value = value * info.RESOLUTION;
                value = parseFloat(value.toFixed(2));
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
    }catch(error)
    {
        decoded[config.ERROR_NAME] = error.message;
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
    var decoded = {};
    if(fPort == 0)
    {
        decoded = {mac: "MAC command received", fPort: fPort};
    } else if(bytes.length == CONFIG_DATA.LENGTH)
    {
        decoded = decodeDeviceData(bytes, CONFIG_DATA);
    }else
    {
        decoded = {error: "unknown payload"};
    }
    return decoded;
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
    TYPES : {
        "mode" : {TYPE : 0, SIZE : 1, MIN : 0, MAX : 6, VALUES: {
            "off":0, "extern":1, "heating":2, "cooling":3,
            "mainheating":4, "maincooling":5, "mainoff":6}
        },
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
        if(typeof value === "string")
        {
            value = config.VALUES[value.toLowerCase()]
        }
        if(value >= config.MIN && value <= config.MAX)
        {
            encoded[index] = config.TYPE;
            index = index + 1;
            if(config.SIZE == 1)
            {
                encoded[index] = value;
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

