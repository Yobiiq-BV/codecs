/**
 * Codec for UGM device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 12 July 2023
 * Update  Date : 24 July 2023
 */

// Configuration constants for device basic info and current settings
var CONFIG_INFO = {
    PORT     : 50,
    CHANNEL  : parseInt("0xFF", 16),
    TYPES    : {
        "0x01" : {SIZE : 2, NAME : "HardwareVersion", DIGIT: false},
        "0x02" : {SIZE : 2, NAME : "FirmwareVersion", DIGIT: false},
        "0x03" : {SIZE : 7, NAME : "DeviceSerialNumber", DIGIT: true},
        "0x04" : {SIZE : 0, NAME : "DeviceModel",
            VALUES     : {
                "0x04" : "UGM2.5",
                "0x06" : "UGM4",
                "0x10" : "UGM6",
                "0x16" : "UGM10",
                "0x25" : "UGM16",
                "0x40" : "UGM25",
                "0x65" : "UGM40",
                "0x99" : "UGM65",
            },
        },
        "0x05" : {SIZE : 1, NAME : "DeviceClass",
            VALUES     : {
                "0x00" : "Class A",
                "0x01" : "Class B",
                "0x02" : "Class C",
            },
        },
        "0x06" : {SIZE : 2, NAME : "Battery",
        },
        "0x07" : {SIZE : 1, NAME : "PowerEvent",
            VALUES     : {
                "0x00" : "AC Power Off",
                "0x01" : "AC Power On",
            },
        },
        "0x08" : {SIZE : 8, NAME : "Settings"
        },
        "0x14" : {SIZE : 1, NAME : "EnergyType",
			VALUES     : {
				"0x00" : "Electricity",
				"0x01" : "Water",
				"0x02" : "Gas",
			},
		},
        "0x15" : {SIZE : 1, NAME : "ValveStatus",
			VALUES     : {
				"0x00" : "open",
				"0x01" : "closed",
			},
		},
        "0x16" : {SIZE : 1, NAME : "BoxCoverStatus",
			VALUES     : {
				"0x00" : "closed",
				"0x01" : "open",
			},
		},
    },
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}

// Configuration constants for measurement
 var CONFIG_MEASUREMENT = {
    "0x1E" : {SIZE : 4, NAME : "Timestamp",},
    "0x28" : {SIZE : 4, NAME : "GasVolume", UNIT : "m3", RESOLUTION : 0.001,},
    "0x29" : {SIZE : 2, NAME : "GasFlow", UNIT : "m3/h", RESOLUTION : 0.01,},
    "0x2A" : {SIZE : 1, NAME : "Pressure", UNIT : "KPa",},
    "0x1F" : {SIZE : 2, NAME : "Temperature", RESOLUTION : 0.01,},
    "0x15" : {SIZE : 1, NAME : "ValveStatus",
		VALUES     : {
			"0x00" : "open",
			"0x01" : "closed",
		},
	},
	HEADER_CHANNEL : parseInt("0xFF", 16),
	HEADER_TYPE    : parseInt("0X1E", 16),
	HEADER_SIZE    : 4,
	LENGTH         : 21,
    WARNING_NAME   : "Warning",
    ERROR_NAME     : "Error",
    INFO_NAME      : "Info"
}


// Configuration constants for status packet
var CONFIG_STATUS = {
    PORT : 1,
	HEADER_CHANNEL : parseInt("0xFF", 16),
	HEADER_TYPE    : parseInt("0X1E", 16),
	HEADER_SIZE    : 4,
    TYPES : {
        "0x15" : {SIZE : 1, NAME : "ValveStatus",
			VALUES     : {
				"0x00" : "open",
				"0x01" : "closed",
			},
		},
        "0x16" : {SIZE : 1, NAME : "BoxCoverStatus",
			VALUES     : {
				"0x00" : "closed",
				"0x01" : "open",
			},
		},
        "0x06" : {SIZE : 2, NAME : "BatteryAlarm",
			VALUES     : {
				"0x00" : "normal",
				"0x01" : "alarm",
			},
		},
        "0x28" : {SIZE : 1, NAME : "GasLeakageAlarm",
			VALUES     : {
				"0x00" : "normal",
				"0x01" : "alarm",
			},
		},
        "0x00" : {SIZE : 1, NAME : "CommunicationErrorAlarm",
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

function decodeBasicInformation(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    try
    {
        while(index < LENGTH)
        {
            channel = bytes[index];
            index = index + 1;
            // channel checking
            if(channel != CONFIG_INFO.CHANNEL)
            {
                continue;
            }
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
    try
    {
		channel = bytes[index];
		index = index + 1;
		type = bytes[index];
		index = index + 1;
		if(channel == CONFIG_MEASUREMENT.HEADER_CHANNEL && type == CONFIG_MEASUREMENT.HEADER_TYPE)
		{
			// Decode device timestamp
			decoded["DeviceTimestamp"] = getValueFromBytesBigEndianFormat(bytes, index, CONFIG_MEASUREMENT.HEADER_SIZE);
			index = index + CONFIG_MEASUREMENT.HEADER_SIZE;
		}
		decoded["ListOfMeasurements"] = [];
		while(index < LENGTH)
		{
			var measurement = decodeMeasurement(bytes, index, CONFIG_MEASUREMENT.LENGTH);
			decoded["ListOfMeasurements"].push(measurement);
			index = index + CONFIG_MEASUREMENT.LENGTH;
		}

    }catch(error)
    {
        decoded[CONFIG_MEASUREMENT.ERROR_NAME] = error.message;
    }
    return decoded;
}

function decodeStatusPacket(bytes)
{
    var LENGTH = bytes.length;
    var decoded = {};
    var index = 0;
    var channel = 0;
    var type = "";
    var size = 0;
    try
    {
		channel = bytes[index];
		index = index + 1;
		type = bytes[index];
		index = index + 1;
		if(channel == CONFIG_STATUS.HEADER_CHANNEL && type == CONFIG_STATUS.HEADER_TYPE)
		{
			// Decode device timestamp
			decoded["DeviceTimestamp"] = getValueFromBytesBigEndianFormat(bytes, index, CONFIG_STATUS.HEADER_SIZE);
			index = index + CONFIG_STATUS.HEADER_SIZE;
		}
        while(index < LENGTH)
        {
            channel = bytes[index];
            index = index + 1;
            // No channel checking
            // Type of basic information
            type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
            index = index + 1;
            var status = CONFIG_STATUS.TYPES[type];
            size = status["SIZE"];
            // Decoding
            var value = 0;
			if("VALUES" in status)
			{
				// Decode into STRING (VALUES specified in CONFIG_STATUS)
				value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
				if(type == "0x06" || status["NAME"] == "BatteryAlarm")
				{
					decoded[status["NAME"]] = {};
					decoded[status["NAME"]]["status"] = status["VALUES"][value];
					decoded[status["NAME"]]["percentage"] =  getValueFromBytesBigEndianFormat(bytes, index+1, 1); 
				}else
				{
					decoded[status["NAME"]] = status["VALUES"][value];
				}

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

function decodeMeasurement(bytes, baseIndex)
{
	var decoded = {};
	var index = baseIndex;
	try 
	{
		var channel = bytes[index];
		if(channel < 1 || channel > 11)
		{
			decoded[CONFIG_MEASUREMENT.WARNING_NAME]  = "Channel is not correct";
		}
		index = index + 1;
		while(index < (CONFIG_MEASUREMENT.LENGTH + baseIndex))
		{
			// Type of device measurement
			type = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
			index = index + 1;
			var measurement = CONFIG_MEASUREMENT[type]
			size = measurement["SIZE"];
			var value = 0;
			// Decode into DECIMAL format
			value = getValueFromBytesBigEndianFormat(bytes, index, size);
			if("SIGNED" in measurement)
			{
				value = getSignedIntegerFromInteger(value, size);
			}
			if("RESOLUTION" in measurement)
			{
				value = value * measurement["RESOLUTION"];
				value = parseFloat(value.toFixed(3));
			}
			if("VALUES" in measurement)
			{
				value = "0x" + toEvenHEX(value.toString(16).toUpperCase());
				value = measurement["VALUES"][value];
			}
			if("UNIT" in measurement)
			{
				decoded[measurement["NAME"]] = {}
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
    }else if(fPort >= 10 && fPort <= 30)
    {
        return decodeDeviceData(bytes);
    }else if (fPort == CONFIG_STATUS.PORT)
	{
		return decodeStatusPacket(bytes);
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





