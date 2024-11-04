/**
 * Codec for CMi4140 device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 21 October 2023
 * Update  Date : 04 November 2024
*/


// Configuration constants for device
var MESSAGE_FORMAT = {
    STANDARD: parseInt("0x15", 16),
    COMPACT: parseInt("0x16", 16),
    JSON: parseInt("0x17", 16),
    SCHEDULED_DAILY_REDUNDANT: parseInt("0x18", 16),
    SCHEDULED_EXTENDED: parseInt("0x19", 16),
    COMBINED_HEAT_COOLING: parseInt("0x1A", 16),
    HEAT_INTELLIGENCE: parseInt("0x1B", 16),
    SCHEDULED_EXTENDED_TELEGRAM1: parseInt("0x3B", 16),
    SCHEDULED_EXTENDED_TELEGRAM2: parseInt("0x3C", 16),
}
var WARNING_NAME  = "warning";
var ERROR_NAME  = "error";
var INFO_NAME = "info";

var UNIT_ENERGY_E1_E3 = {
    "0x3403" : {UNIT: "Wh", RESOLUTION : 1},
    "0x0400" : {UNIT: "Wh", RESOLUTION : 0.001},
    "0x0401" : {UNIT: "Wh", RESOLUTION : 0.01},
    "0x0402" : {UNIT: "Wh", RESOLUTION : 0.1},
    "0x0403" : {UNIT: "Wh", RESOLUTION : 1},
    "0x0404" : {UNIT: "Wh", RESOLUTION : 10},
    "0x0405" : {UNIT: "Wh", RESOLUTION : 100},
    "0x0406" : {UNIT: "kWh", RESOLUTION : 1},
    "0x0407" : {UNIT: "kWh", RESOLUTION : 10},
    "0x040E" : {UNIT: "MJ", RESOLUTION : 1},
    "0x040F" : {UNIT: "MJ", RESOLUTION : 10},
    "0x04FB0D" : {UNIT: "MCal", RESOLUTION : 1},
    "0x04FB0E" : {UNIT: "MCal", RESOLUTION : 10},
    "0x04FB0F" : {UNIT: "MCal", RESOLUTION : 100}
}

var UNIT_ENERGY_ACC = {
    "0x3403" : {UNIT: "Wh", RESOLUTION : 1},
    "0x4400" : {UNIT: "Wh", RESOLUTION : 0.001},
    "0x4401" : {UNIT: "Wh", RESOLUTION : 0.01},
    "0x4402" : {UNIT: "Wh", RESOLUTION : 0.1},
    "0x4403" : {UNIT: "Wh", RESOLUTION : 1},
    "0x4404" : {UNIT: "Wh", RESOLUTION : 10},
    "0x4405" : {UNIT: "Wh", RESOLUTION : 100},
    "0x4406" : {UNIT: "kWh", RESOLUTION : 1},
    "0x4407" : {UNIT: "kWh", RESOLUTION : 10},
    "0x440E" : {UNIT: "MJ", RESOLUTION : 1},
    "0x440F" : {UNIT: "MJ", RESOLUTION : 10},
    "0x44FB0D" : {UNIT: "MCal", RESOLUTION : 1},
    "0x44FB0E" : {UNIT: "MCal", RESOLUTION : 10},
    "0x44FB0F" : {UNIT: "MCal", RESOLUTION : 100}
}

var UNIT_ENERGY_E3_ONLY = {
    "0x3403" : {UNIT: "Wh", RESOLUTION : 1},
    "0x0480" : {UNIT: "Wh", RESOLUTION : 0.001},
    "0x0481" : {UNIT: "Wh", RESOLUTION : 0.01},
    "0x0482" : {UNIT: "Wh", RESOLUTION : 0.1},
    "0x0483" : {UNIT: "Wh", RESOLUTION : 1},
    "0x0484" : {UNIT: "Wh", RESOLUTION : 10},
    "0x0485" : {UNIT: "Wh", RESOLUTION : 100},
    "0x0486" : {UNIT: "kWh", RESOLUTION : 1},
    "0x0487" : {UNIT: "kWh", RESOLUTION : 10},
    "0x048E" : {UNIT: "MJ", RESOLUTION : 1},
    "0x048F" : {UNIT: "MJ", RESOLUTION : 10},
    "0x04FB8D" : {UNIT: "MCal", RESOLUTION : 1},
    "0x04FB8E" : {UNIT: "MCal", RESOLUTION : 10},
    "0x04FB8F" : {UNIT: "MCal", RESOLUTION : 100}
}

var UNIT_VOLUME = {
    "0x0410" : {UNIT: "m3", RESOLUTION : 0.000001},
    "0x0411" : {UNIT: "m3", RESOLUTION : 0.00001},
    "0x0412" : {UNIT: "m3", RESOLUTION : 0.0001},
    "0x0413" : {UNIT: "m3", RESOLUTION : 0.001},
    "0x0414" : {UNIT: "m3", RESOLUTION : 0.01},
    "0x0415" : {UNIT: "m3", RESOLUTION : 0.1},
    "0x0416" : {UNIT: "m3", RESOLUTION : 1},
    "0x0417" : {UNIT: "m3", RESOLUTION : 10}
}

var UNIT_POWER = {
    "0x022A" : {UNIT: "W", RESOLUTION : 0.1},
    "0x022B" : {UNIT: "W", RESOLUTION : 1},
    "0x022C" : {UNIT: "W", RESOLUTION : 10},
    "0x022D" : {UNIT: "W", RESOLUTION : 100},
    "0x022E" : {UNIT: "kW", RESOLUTION : 1},
    "0x022F" : {UNIT: "kW", RESOLUTION : 10}
}

var UNIT_FLOW = {
    "0x023B" : {UNIT: "m3/h", RESOLUTION : 0.001},
    "0x023C" : {UNIT: "m3/h", RESOLUTION : 0.01},
    "0x023D" : {UNIT: "m3/h", RESOLUTION : 0.1},
    "0x023E" : {UNIT: "m3/h", RESOLUTION : 1},
    "0x023F" : {UNIT: "m3/h", RESOLUTION : 10}
}

var UNIT_FORWARD_TEMPERATURE = {
    "0x0258" : {UNIT: "°C", RESOLUTION : 0.001},
    "0x0259" : {UNIT: "°C", RESOLUTION : 0.01},
    "0x025A" : {UNIT: "°C", RESOLUTION : 0.1},
    "0x025B" : {UNIT: "°C", RESOLUTION : 1}
}

var UNIT_RETURN_TEMPERATURE = {
    "0x025C" : {UNIT: "°C", RESOLUTION : 0.001},
    "0x025D" : {UNIT: "°C", RESOLUTION : 0.01},
    "0x025E" : {UNIT: "°C", RESOLUTION : 0.1},
    "0x025F" : {UNIT: "°C", RESOLUTION : 1}
}

var CONFIG_MESSAGE_STANDARD = {
    DIB : [
        {
            SIZE: 0, TYPE: "INT32", NAME: "energyConsumption",
            DETAILS :{SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E1_E3
        },
        {
            SIZE: 6, TYPE: "INT32", NAME: "volume",
            DIF : UNIT_VOLUME
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "power",
            DIF : UNIT_POWER
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "flow",
            DIF : UNIT_FLOW
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "forwardTemperature",
            DIF : UNIT_FORWARD_TEMPERATURE
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "returnTemperature",
            DIF : UNIT_RETURN_TEMPERATURE
        },
        {
            SIZE: 6, TYPE: "HEX", NAME: "meterId",
            DIF : {"0x0C78":null}
        },
        {
            SIZE: 7, TYPE: "FLAGS", NAME: "errorAndWarningFlags",
            DIF : {"0x04FD":null},
        }
    ]
}

var CONFIG_MESSAGE_COMPACT = {
    DIB : [
        {
            SIZE: 0, TYPE: "INT32", NAME: "energyConsumption",
            DETAILS :{SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E1_E3
        },
        {
            SIZE: 6, TYPE: "HEX", NAME: "meterId",
            DIF : {"0x0C78":null}
        },
        {
            SIZE: 7, TYPE: "FLAGS", NAME: "errorAndWarningFlags",
            DIF : {"0x04FD":null},
        }
    ]
}

var CONFIG_MESSAGE_SCHEDULED_DAILY_REDUNDANT = {
    DIB : [
        {
            SIZE: 0, TYPE: "INT32", NAME: "energyConsumption",
            DETAILS :{SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E1_E3
        },
        {
            SIZE: 6, TYPE: "INT32", NAME: "volume",
            DIF : UNIT_VOLUME
        },
        {
            SIZE: 6, TYPE: "HEX", NAME: "meterId",
            DIF : {"0x0C78":null}
        },
        {
            SIZE: 7, TYPE: "FLAGS", NAME: "errorAndWarningFlags",
            DIF : {"0x04FD":null},
        },
        {
            SIZE: 6, TYPE: "TIME", NAME: "dateTime",
            DIF : {"0x046D":null}
        },
        {
            SIZE: 0, TYPE: "INT32", NAME: "accumulatedEnergyAtMidnight",
            DETAILS :{SIZE : 6, "0x44FB" : 7},
            DIF : UNIT_ENERGY_ACC
        }
    ]
}

var CONFIG_MESSAGE_SCHEDULED_EXTENDED = {
    DIB : [
        {
            SIZE: 0, TYPE: "INT32", NAME: "energyConsumption",
            DETAILS : {SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E1_E3
        },
        {
            SIZE: 6, TYPE: "INT32", NAME: "volume",
            DIF : UNIT_VOLUME
        },
        {
            SIZE: 12, TYPE: "INT64", NAME: null,
            DETAILS :{SIZE : 12, "0x07FF" : 12},
            DIF : {"0x07FFA0":null}
        },
        {
            SIZE: 11, TYPE: "INT56", NAME: null,
            DETAILS :{SIZE : 11, "0x07FF" : 11},
            DIF : {"0x07FF21":null}
        },
        {
            SIZE: 6, TYPE: "TIME", NAME: "dateTime",
            DIF : {"0x046D":null}
        }
    ]
}

var CONFIG_MESSAGE_COMBINED_HEAT_COOLING = {
    DIB : [
        {
            SIZE: 0, TYPE: "INT32", NAME: "heatEnergy",
            DETAILS :{SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E1_E3
        },
        {
            SIZE: 0, TYPE: "INT32", NAME: "coolingEnergy",
            DETAILS :{SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E3_ONLY
        },
        {
            SIZE: 6, TYPE: "INT32", NAME: "volume",
            DIF : UNIT_VOLUME
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "forwardTemperature",
            DIF : UNIT_FORWARD_TEMPERATURE
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "returnTemperature",
            DIF : UNIT_RETURN_TEMPERATURE
        },
        {
            SIZE: 6, TYPE: "HEX", NAME: "meterId",
            DIF : {"0x0C78":null}
        },
        {
            SIZE: 7, TYPE: "FLAGS", NAME: "errorAndWarningFlags",
            DIF : {"0x04FD":null},
        }
    ]
}

var CONFIG_MESSAGE_HEAT_INTELLIGENCE = {
    DIB : [
        {
            SIZE: 0, TYPE: "INT32", NAME: "heatEnergy",
            DETAILS :{SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E1_E3
        },
        {
            SIZE: 0, TYPE: "INT32", NAME: "coolingEnergy",
            DETAILS :{SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E3_ONLY
        },
        {
            SIZE: 6, TYPE: "INT32", NAME: "volume",
            DIF : UNIT_VOLUME
        },
        {
            SIZE: 11, TYPE: "INT56", NAME: null,
            DETAILS :{SIZE : 11, "0x07FF" : 11},
            DIF : {"0x07FF21":null}
        },
        {
            SIZE: 7, TYPE: "INT32", NAME: "energyE8",
            DETAILS :{SIZE : 7, "0x04FF" : 7},
            DIF : {"0x04FF07":{UNIT: "m3 * °C"}}
        },
        {
            SIZE: 7, TYPE: "INT32", NAME: "energyE9",
            DETAILS :{SIZE : 7, "0x04FF" : 7},
            DIF : {"0x04FF08":{UNIT: "m3 * °C"}}
        },
    ]
}
var CONFIG_MESSAGE_SCHEDULED_EXTENDED_TELEGRAM1 = {
    DIB : [
        {
            SIZE: 0, TYPE: "INT32", NAME: "energyConsumption",
            DETAILS : {SIZE : 6, "0x04FB" : 7},
            DIF : UNIT_ENERGY_E1_E3
        },
        {
            SIZE: 7, TYPE: "INT32", NAME: "energyTariff2",
            DETAILS :{SIZE : 7, "0x8402" : 7},
            DIF : {"0x840203":{UNIT: "Wh"}}
        },
        {
            SIZE: 7, TYPE: "INT32", NAME: "energyTariff3",
            DETAILS :{SIZE : 7, "0x8403" : 7},
            DIF : {"0x840303":{UNIT: "Wh"}}
        },
        {
            SIZE: 6, TYPE: "HEX", NAME: "meterId",
            DIF : {"0x0C78":null}
        },
        {
            SIZE: 6, TYPE: "TIME", NAME: "dateTime",
            DIF : {"0x046D":null}
        }
    ]
}

var CONFIG_MESSAGE_SCHEDULED_EXTENDED_TELEGRAM2 = {
    DIB : [
        {
            SIZE: 6, TYPE: "INT32", NAME: "volume",
            DIF : UNIT_VOLUME
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "power",
            DIF : UNIT_POWER
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "flow",
            DIF : UNIT_FLOW
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "forwardTemperature",
            DIF : UNIT_FORWARD_TEMPERATURE
        },
        {
            SIZE: 4, TYPE: "INT16", NAME: "returnTemperature",
            DIF : UNIT_RETURN_TEMPERATURE
        },
        {
            SIZE: 6, TYPE: "HEX", NAME: "meterId",
            DIF : {"0x0C78":null}
        },
        {
            SIZE: 6, TYPE: "TIME", NAME: "dateTime",
            DIF : {"0x046D":null}
        },
        {
            SIZE: 7, TYPE: "FLAGS", NAME: "errorAndWarningFlags",
            DIF : {"0x04FD":null},
        }
    ]
}

function decodeMessageWithConfig(bytes, config)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 1;   // skip message format
    var dibReverseIndex = config.DIB.length;
    try
    {
        var code = "";
        var dib = {}  // data info block (in the config)
        var size = 0;
        var value = 0;
        var unitInfo = {};
        var isDibCorrect = false;
        while(index < LENGTH && dibReverseIndex != 0)
        {
            dib = config.DIB[config.DIB.length - dibReverseIndex];
            // 2 bytes code
            code = "0x" + getDigitStringArrayEvenFormat(bytes, index, 2).join("").toUpperCase();
            isDibCorrect = (dib.DIF && code in dib.DIF)
            if(!isDibCorrect)
            {
                // Get the correct DIB : search DIB's code in DIF
                var i = 0;
                for(i=0; i<config.DIB.length; i=i+1)
                {
                    dib = config.DIB[i];
                    if(dib.DETAILS && code in dib.DETAILS)
                    {
                        // 3 bytes code
                        code = code + toEvenHEX(bytes[index + 2].toString(16).toUpperCase());
                    }
                    if(dib.DIF && code in dib.DIF)
                    {
                        break;
                    }
                }
                if(i == config.DIB.length)
                {
                    // DIB not found
                    dib = {SIZE:null};
                }
            }
            // Decode data
            size = dib.SIZE;
            if(size == 0)
            {
                // 2 bytes code
                var detailsCode = "0x" + getDigitStringArrayEvenFormat(bytes, index, 2).join("").toUpperCase();
                if(detailsCode in dib.DETAILS)
                {
                    size = dib.DETAILS[detailsCode];
                }else
                {
                    size = dib.DETAILS.SIZE;
                }
            }
            if(size==undefined || size == null)
            {
                dib.TYPE = "UNKNOWN";
                size = 0;
            }
            switch (dib.TYPE)
            {
                case "INT32":
                    value = getValue(bytes, index + (size - 4), 4);
                    value = getSignedIntegerFromInteger(value, 4);
                    break;
                case "INT16":
                    value = getValue(bytes, index + (size - 2), 2);
                    value = getSignedIntegerFromInteger(value, 2);
                    break;
                case "HEX":
                    value = getDigitStringArrayEvenFormat(bytes, index + (size - 4), 4).join("").toUpperCase();
                    break;
                case "FLAGS":
                    value = getFlags(bytes, index + (size - 4), 4);
                    break;
                case "TIME":
                    value = getDateTime(bytes, index + (size - 4), 4);
                    break;
                case "INT56":
                    value = getMultipleValues(bytes, index, "INT56");
                    break;
                case "INT64":
                    value = getMultipleValues(bytes, index, "INT64");
                    break;
                default:
                    break;
            }
            unitInfo = dib.DIF ? dib.DIF[code] : null;
            if(unitInfo && "RESOLUTION" in unitInfo)
            {
                value = value * unitInfo.RESOLUTION;
                if(unitInfo.RESOLUTION < 0.001)
                {
                    value = parseFloat(value.toFixed(6));
                }else if(unitInfo.RESOLUTION < 1)
                {
                    value = parseFloat(value.toFixed(3));
                }
            }
            if(unitInfo && "UNIT" in unitInfo)
            {
                // decoded[dib.NAME] = {};
                // decoded[dib.NAME].data = value;
                // decoded[dib.NAME].unit = unitInfo.UNIT;
                decoded[dib.NAME] = value;
            }else if(dib.DIF)
            {
                if(dib.NAME)
                {
                    decoded[dib.NAME] = value;
                }else 
                {
                    Object.keys(value).forEach( function(key) {
                        decoded[key] = value[key]
                    });
                }
            }else
            {
                var id = "0x" + toEvenHEX(bytes[0].toString(16)).toUpperCase();
                decoded[WARNING_NAME] = "Can't decode message " + id + " correctly";
                size = 0;
            }
            if(size > 0)
            {
                index = index + size;
                dibReverseIndex = dibReverseIndex - 1;
            }else{ // skip unknown dib
                index = index + 1;
            }
        }
    }catch(error)
    {
        decoded[ERROR_NAME] = error.message;
    }
    return decoded;
}


function decodeMessageJSON(bytes)
{
    var decoded = {};
    try 
    {
        bytes.shift();
        message = JSON.parse(getStringFromBytesBigEndianFormat(bytes, 0, bytes.length));
        // decoded.energyConsumption = {}
        // decoded.energyConsumption.data = message.E;
        // decoded.energyConsumption.unit = message.U;
        decoded.energyConsumption = message.E;
        decoded.meterId = message.ID.toString();
    }catch(error)
    {
        decoded[ERROR_NAME] = error.message;
    }
    return decoded;
}



/**  Helper functions  **/

function getValue(bytes, index, size)
{
    return getValueFromBytesLittleEndianFormat(bytes, index, size);
}

function getFlags(bytes, index, size)
{
    return getDigitStringArrayEvenFormat(bytes, index, size).join("").toUpperCase();
}

function getDateTime(bytes, index, size)
{
    var dateTime = getValueFromBytesLittleEndianFormat(bytes, index, size);
    return parseDateTime(dateTime);
}

function getMultipleValues(bytes, index, type)
{
    var decoded = {};
    if(type == "INT56")
    {
        decoded.errorAndWarningFlags = getFlags(bytes, index + 3, 4);
        decoded.meterId = getDigitStringArrayEvenFormat(bytes, index + 7, 4).join("").toUpperCase();
    }else if(type == "INT64")
    {
        var flowScale = bytes[index + 3] & 0x07;
        var powerScale = (bytes[index + 3] >> 4) & 0x07
        var fwTemperature = getValueFromBytesLittleEndianFormat(bytes, index + 4, 2);
        fwTemperature = getSignedIntegerFromInteger(fwTemperature, 2) * 0.01;
        var rtTemperature = getValueFromBytesLittleEndianFormat(bytes, index + 6, 2);
        rtTemperature = getSignedIntegerFromInteger(rtTemperature, 2) * 0.01;
        var flow = getValueFromBytesLittleEndianFormat(bytes, index + 8, 2);
        flow = getSignedIntegerFromInteger(flow, 2) * Math.pow(10, flowScale - 3);
        var power = getValueFromBytesLittleEndianFormat(bytes, index + 10, 2);
        power = getSignedIntegerFromInteger(power, 2) * Math.pow(10, powerScale - 3);
        // decoded.forwardTemperature = {};
        // decoded.forwardTemperature.data = parseFloat(fwTemperature.toFixed(2));
        // decoded.forwardTemperature.unit = "°C";
        decoded.forwardTemperature = parseFloat(fwTemperature.toFixed(2));
        // decoded.returnTemperature = {};
        // decoded.returnTemperature.data = parseFloat(rtTemperature.toFixed(2));
        // decoded.returnTemperature.unit = "°C";
        decoded.returnTemperature = parseFloat(rtTemperature.toFixed(2));
        // decoded.flow = {};
        // decoded.flow.data = parseFloat(flow.toFixed(3));
        // decoded.flow.unit = "m3/h";
        decoded.flow = parseFloat(flow.toFixed(3));
        // decoded.power = {};
        // decoded.power.data = parseFloat(power.toFixed(3));
        // decoded.power.unit = "W";
        decoded.power = parseFloat(power.toFixed(3));
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

function parseDateTime(dateTime) 
{
    // Extracting year, month, day, hour, and minute from the dateTime
    var yearHigh = (dateTime >> 28) & 0xF;
    var month = (dateTime >> 24) & 0xF;
    var yearLow = (dateTime >> 21) & 0x7;
    var day = (dateTime >> 16) & 0x1F;
    var hour = (dateTime >> 8) & 0x1F;
    var minute = dateTime & 0x3F;
  
    // Combining the year-high and year-low unitInfos to get the full year
    var year = (yearHigh << 3) | yearLow;
  
    // Checking the summertime flag
    var isDaylightSavingTime = ((dateTime >> 15) & 0x1) === 1 ? true : false;
  
    // Checking the error flag
    var isValidTimestamp = ((dateTime >> 7) & 0x1) === 0 ? true : false;
  
    // Formatting the date and time as YY-MM-DD HH:MM
    var formattedDate = "20"+toEvenHEX(year.toString()) + '-' +
                          toEvenHEX(month.toString()) + '-' +
                          toEvenHEX(day.toString());
    var formattedTime = toEvenHEX(hour.toString()) + ':' +
                        toEvenHEX(minute.toString())
    
    if (!isValidTimestamp)
    {
        return {value: formattedDate + 'T' + formattedTime, error : "Invalid Timestamp"};
    }
    
    return formattedDate + 'T' + formattedTime;

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
    var format = bytes[0]
    switch (format) {
        case MESSAGE_FORMAT.STANDARD:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_STANDARD);
            break;
        case MESSAGE_FORMAT.COMPACT:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_COMPACT);
            break;
        case MESSAGE_FORMAT.JSON:
            decoded = decodeMessageJSON(bytes);
            break;
        case MESSAGE_FORMAT.SCHEDULED_DAILY_REDUNDANT:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_SCHEDULED_DAILY_REDUNDANT);
            break;
        case MESSAGE_FORMAT.SCHEDULED_EXTENDED:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_SCHEDULED_EXTENDED);
            break;
        case MESSAGE_FORMAT.COMBINED_HEAT_COOLING:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_COMBINED_HEAT_COOLING);
            break;
        case MESSAGE_FORMAT.HEAT_INTELLIGENCE:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_HEAT_INTELLIGENCE);
            break;
        case MESSAGE_FORMAT.SCHEDULED_EXTENDED_TELEGRAM1:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_SCHEDULED_EXTENDED_TELEGRAM1);
            break;
        case MESSAGE_FORMAT.SCHEDULED_EXTENDED_TELEGRAM2:
            decoded = decodeMessageWithConfig(bytes, CONFIG_MESSAGE_SCHEDULED_EXTENDED_TELEGRAM2);
            break;
        default:
            decoded = {error: "Unknown message", fPort : fPort};
            break;
    }
    return decoded;
}

// Decode uplink function. (ChirpStack v4 , TTN)
//
// Input is an object with the following unitInfos:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following unitInfos:
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
// Input is an object with the following unitInfos:
// - data = Object representing the payload that must be encoded.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following unitInfos:
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
    CONFIG  : "Config"
}

// Constants for device configuration 
var CONFIG_DEVICE = {
    PORT : 50,
    REGISTER_CHANNEL : parseInt("0x00", 16),
    REGISTERS : {  // TYPE is TLV in the manual
        "reboot": {TYPE: parseInt("0x22", 16), SIZE: 2, PREDEFINED:true, VALUE: parseInt("0x759E", 16)},
        "lock": {TYPE: parseInt("0x05", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "transmitInterval": {TYPE : parseInt("0x06", 16), SIZE: 2, MIN: 1, MAX: 65535,},
        "messageFormat": {TYPE : parseInt("0x07", 16), SIZE: 1, PREDEFINED:true, VALUES: MESSAGE_FORMAT},
        "ecoMode": {TYPE : parseInt("0x0F", 16), SIZE: 1, MIN: 0, MAX: 1,},
        "timeRelative": {TYPE : parseInt("0x13", 16), SIZE: 4, MIN: -2147483648, MAX: 2147483647,},
        "utcOffset": {TYPE : parseInt("0x17", 16), SIZE: 2, MIN: -32768, MAX: 32767,},
    }
}


function encodeDeviceConfiguration(obj, variables)
{
    var encoded = [CONFIG_DEVICE.REGISTER_CHANNEL];
    var index = 1;
    var config = {};
    var param = "";
    var value = 0;
    try
    {
        param = obj.Param;
        value = obj.Value;
        var config = CONFIG_DEVICE.REGISTERS[param];
        if(config.PREDEFINED)
        {
            encoded[index] = config.TYPE;
            index = index + 1;
            encoded[index] = config.SIZE;
            index = index + 1;
            if(config.VALUE)
            { // little endian
                if(value != 1)
                {
                    return []; // error
                }
                encoded[index] = config.VALUE & 0xFF;
                index = index + 1;
                encoded[index] = (config.VALUE >> 8) & 0xFF;
                index = index + 1;
            }
            if(config.VALUES)
            {
                if(value in config.VALUES)
                {
                    encoded[index] = config.VALUES[value];
                    index = index + 1;
                }else
                {
                    return []; // error
                }
            }
        }
        else if(value >= config.MIN && value <= config.MAX)
        {
            encoded[index] = config.TYPE;
            index = index + 1;
            encoded[index] = config.SIZE;
            index = index + 1;
            var isNegative = value < 0 ? true : false;
            if(isNegative)
            {
                value = -value;
            }
            if(config.SIZE == 4)
            { // little endian
                encoded[index] = value & 0xFF;
                index = index + 1;
                encoded[index] = (value >> 8) & 0xFF;
                index = index + 1;
                encoded[index] = (value >> 16) & 0xFF;
                index = index + 1;
                if(isNegative)
                {
                    encoded[index] = (value >> 24) | 0x80;
                }else{
                    encoded[index] = (value >> 24) & 0xFF;
                }
                index = index + 1;
            } else if(config.SIZE == 2)
            { // little endian
                encoded[index] = value & 0xFF;
                index = index + 1;
                if(isNegative)
                {
                    encoded[index] = (value >> 8) | 0x80;
                }else{
                    encoded[index] = (value >> 8) & 0xFF;
                }
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
    
    }catch(error)
    {
        // Error
        return [];
    }
    return encoded;
}




