/**
 * Codec for DSMR device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 05 August 2023
 * Update  Date : 06 August 2023
 */

// Configuration constants for device basic info and current settings
var CONFIG_INFO = {
    PORT     : 50,
    CHANNEL  : parseInt("0xFF", 16),
    TYPES    : {
        "0x01" : {SIZE : 2, NAME : "HardwareVersion", DIGIT: false},
        "0x0A" : {SIZE : 2, NAME : "FirmwareVersion", DIGIT: false},
        "0x10" : {SIZE : 7, NAME : "DeviceSerialNumber", DIGIT: true},
        "0x20" : {SIZE : 1, NAME : "DeviceClass",
            VALUES     : {
                "0x00" : "Class A",
                "0x01" : "Class B",
                "0x02" : "Class C",
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
	"0x22" : {SIZE : 2, NAME : "VoltageL1", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x23" : {SIZE : 2, NAME : "VoltageL2", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x24" : {SIZE : 2, NAME : "VoltageL3", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x26" : {SIZE : 2, NAME : "CurrentL1", UNIT : "A", SIGNED : true,},
    "0x28" : {SIZE : 2, NAME : "CurrentL2", UNIT : "A", SIGNED : true,},
    "0x2A" : {SIZE : 2, NAME : "CurrentL3", UNIT : "A", SIGNED : true,},
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
    var security = Object.keys(CONFIG_INFO.TYPES).length;
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
            size = info["SIZE"];
            // Decoding
            var value = 0;
			if(type == "0x06" || info["NAME"] == "Battery")
			{
				decoded[info["NAME"]] = {};
				decoded[info["NAME"]]["percentage"] = getValueFromBytesBigEndianFormat(bytes, index, 1);
				index = index + 1;
				value = getValueFromBytesBigEndianFormat(bytes, index, 1) * 0.1;
				index = index + 1;
				decoded[info["NAME"]]["voltage"] = parseFloat(value.toFixed(1));
				continue;
			}
			if(type == "0x08" || info["NAME"] == "Settings")
			{
				decoded[info["NAME"]] = {};
				value = getValueFromBytesBigEndianFormat(bytes, index, 1);
				decoded[info["NAME"]] = decodeSettingsInfo(value);
				index = index + 1;
				decoded[info["NAME"]]["BatteryAlarmThreshold"] = getValueFromBytesBigEndianFormat(bytes, index, 1);
				index = index + 1;
				decoded[info["NAME"]]["TransmitInterval"] = getValueFromBytesBigEndianFormat(bytes, index, 2);
				index = index + 2;
				decoded[info["NAME"]]["CollectionInterval"] = getValueFromBytesBigEndianFormat(bytes, index, 2);
				index = index + 2;
				decoded[info["NAME"]]["GasLeakageAlarmThreshold"] = getValueFromBytesBigEndianFormat(bytes, index, 2);
				index = index + 2;
				continue;
			}
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
				// Decode into STRING (VALUES specified in CONFIG_INFO)
				value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
				value = info["VALUES"][value];
			}else
			{
				// Decode into DECIMAL format
				value = getValueFromBytesBigEndianFormat(bytes, index, size);
			}
			if("RESOLUTION" in info)
			{
				value = value * info["RESOLUTION"];
				value = parseFloat(value.toFixed(2));
			}
			if("UNIT" in info)
			{
				decoded[info["NAME"]] = {}
				decoded[info["NAME"]]["data"] = value;
				decoded[info["NAME"]]["unit"] = info["UNIT"];
			}else
			{
				decoded[info["NAME"]] = value;
			}
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
    var security = Object.keys(CONFIG_MEASUREMENT).length;
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
            size = measurement["SIZE"];
            // Decoding
            var value = 0;

			if(size == 0)
			{
				// PowerFailureEventLog decoding
				value = getValueFromBytesBigEndianFormat(bytes, index, 4);
				index = index + 4;
				size =  measurement["SINGLE_EVENT_SIZE"] * value;
				decoded[measurement["NAME"]] = getPowerFailureEventLog(bytes, index, size);
				index = index + size;
				continue;
			}
			if(size == 8)
			{
				// Slave last reading decoding
				value = getValueFromBytesBigEndianFormat(bytes, index, 4);
				index = index + 4;
                decoded[measurement["NAME"]] = {};
                decoded[measurement["NAME"]]["timestamp"] = value;
				value = getValueFromBytesBigEndianFormat(bytes, index, 4);
				index = index + 4;
                decoded[measurement["NAME"]]["value"] = value;
				continue;
			}

			// Decode into DECIMAL format
			value = getValueFromBytesBigEndianFormat(bytes, index, size);
		
            if("SIGNED" in measurement)
            {
                value = getSignedIntegerFromInteger(value, size);
            }
            if("RESOLUTION" in measurement)
            {
                value = value * measurement["RESOLUTION"];
                value = parseFloat(value.toFixed(2));
            }
            if("UNIT" in measurement)
            {
                decoded[measurement["NAME"]] = {};
                decoded[measurement["NAME"]]["data"] = value;
                decoded[measurement["NAME"]]["unit"] = measurement["UNIT"];
            }else
            {
                decoded[measurement["NAME"]] = value;
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

function getBitValue(byte, indexOfBitInByte)
{
    var bitMask = 0x01 << indexOfBitInByte;
    if(byte & bitMask)
    {
        return true;
    }
    return false;
}

function decodeSettingsInfo(byte)
{
	var decoded = {};
	decoded["UplinkConfirmation"] = getBitValue(byte, 0);
	decoded["ADR"] = getBitValue(byte, 1);
	decoded["DutyCycle"] = getBitValue(byte, 2);
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
    return value;
}

function getValueFromBytesLittleEndianFormat(bytes, index, size)
{
    var value = 0;
    for(var i=(size-1); i>0; i=i-1)
    {
        value = (value | bytes[index+i]) << 8; 
    }
    value = value | bytes[index]
    return value;
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
    if(fPort == CONFIG_INFO.PORT)
    {
        return decodeBasicInformation(bytes);
    }else if(fPort >= 1 && fPort <= 5)
    {
        return decodeDeviceData(bytes);
    }else if(fPort == 11)
    {
        // status packet
        return {error: "P1 COM Timeout", timestamp: getValueFromBytesBigEndianFormat(bytes, 2, 4)};
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



