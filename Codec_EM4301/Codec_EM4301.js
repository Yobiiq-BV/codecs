/**
 * Codec for EM4301 device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 11 June 2023
 * Update  Date : 07 February 2024
 */

// Configuration constants for device basic info
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
        "0x1E" : {SIZE : 2, NAME : "PrimaryCurrentTransformerRatio",},
        "0x1F" : {SIZE : 1, NAME : "SecondaryCurrentTransformerRatio",},
        "0x20" : {SIZE : 4, NAME : "PrimaryVoltageTransformerRatio",},
        "0x21" : {SIZE : 2, NAME : "SecondaryVoltageTransformerRatio",},
        "0x28" : {SIZE : 0, NAME : "DeviceModel",},
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
    "0x04" : {SIZE : 4, NAME : "ActiveEnergyImportL123T1", UNIT : "Wh",},
    "0x05" : {SIZE : 4, NAME : "ActiveEnergyImportL123T2", UNIT : "Wh",},
    "0x06" : {SIZE : 4, NAME : "ActiveEnergyExportL123T1", UNIT : "Wh",},
    "0x07" : {SIZE : 4, NAME : "ActiveEnergyExportL123T2", UNIT : "Wh",},
    "0x08" : {SIZE : 4, NAME : "ReactiveEnergyImportL123T1", UNIT : "varh",},
    "0x09" : {SIZE : 4, NAME : "ReactiveEnergyImportL123T2", UNIT : "varh",},
    "0x0A" : {SIZE : 4, NAME : "ReactiveEnergyExportL123T1", UNIT : "varh",},
    "0x0B" : {SIZE : 4, NAME : "ReactiveEnergyExportL123T2", UNIT : "varh",},
    "0x0C" : {SIZE : 4, NAME : "VoltageL1N", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x0D" : {SIZE : 4, NAME : "VoltageL2N", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x0E" : {SIZE : 4, NAME : "VoltageL3N", UNIT : "V", RESOLUTION : 0.1, SIGNED : true,},
    "0x0F" : {SIZE : 4, NAME : "CurrentL123", UNIT : "mA", SIGNED : true,},
    "0x10" : {SIZE : 4, NAME : "CurrentL1", UNIT : "mA", SIGNED : true,},
    "0x11" : {SIZE : 4, NAME : "CurrentL2", UNIT : "mA", SIGNED : true,},
    "0x12" : {SIZE : 4, NAME : "CurrentL3", UNIT : "mA", SIGNED : true,},
    "0x13" : {SIZE : 4, NAME : "ActivePowerL123", UNIT : "W", SIGNED : true,},
    "0x14" : {SIZE : 4, NAME : "ActivePowerL1", UNIT : "W", SIGNED : true,},
    "0x15" : {SIZE : 4, NAME : "ActivePowerL2", UNIT : "W", SIGNED : true,},
    "0x16" : {SIZE : 4, NAME : "ActivePowerL3", UNIT : "W", SIGNED : true,},
    "0x17" : {SIZE : 4, NAME : "ReactivePowerL1", UNIT : "kvar", RESOLUTION : 0.001, SIGNED : true,},
    "0x18" : {SIZE : 4, NAME : "ReactivePowerL2", UNIT : "kvar", RESOLUTION : 0.001, SIGNED : true,},
    "0x19" : {SIZE : 4, NAME : "ReactivePowerL3", UNIT : "kvar", RESOLUTION : 0.001, SIGNED : true,},
    "0x1A" : {SIZE : 4, NAME : "ApparentPowerL1", UNIT : "kVA", RESOLUTION : 0.001, SIGNED : true,},
    "0x1B" : {SIZE : 4, NAME : "ApparentPowerL2", UNIT : "kVA", RESOLUTION : 0.001, SIGNED : true,},
    "0x1C" : {SIZE : 4, NAME : "ApparentPowerL3", UNIT : "kVA", RESOLUTION : 0.001, SIGNED : true,},
    "0x1D" : {SIZE : 1, NAME : "PowerFactorL1", RESOLUTION : 0.01, SIGNED : true,},
    "0x1E" : {SIZE : 1, NAME : "PowerFactorL2", RESOLUTION : 0.01, SIGNED : true,},
    "0x1F" : {SIZE : 1, NAME : "PowerFactorL3", RESOLUTION : 0.01, SIGNED : true,},
    "0x20" : {SIZE : 2, NAME : "PhaseAngleL1", UNIT : "degree", RESOLUTION : 0.01, SIGNED : true,},
    "0x21" : {SIZE : 2, NAME : "PhaseAngleL2", UNIT : "degree", RESOLUTION : 0.01, SIGNED : true,},
    "0x22" : {SIZE : 2, NAME : "PhaseAngleL3", UNIT : "degree", RESOLUTION : 0.01, SIGNED : true,},
    "0x23" : {SIZE : 2, NAME : "Frequency", UNIT : "Hz", RESOLUTION : 0.01, SIGNED : true,},
    "0x24" : {SIZE : 4, NAME : "TotalSystemActivePower", UNIT : "kW",},
    "0x25" : {SIZE : 4, NAME : "TotalSystemReactivePower", UNIT : "kvar", RESOLUTION : 0.001,},
    "0x26" : {SIZE : 4, NAME : "TotalSystemApparentPower", UNIT : "kVA", RESOLUTION : 0.001,},
    "0x27" : {SIZE : 4, NAME : "MaximumL1CurrentDemand", UNIT : "mA", SIGNED : true,},
    "0x28" : {SIZE : 4, NAME : "MaximumL2CurrentDemand", UNIT : "mA", SIGNED : true,},
    "0x29" : {SIZE : 4, NAME : "MaximumL3CurrentDemand", UNIT : "mA", SIGNED : true,},
    "0x2A" : {SIZE : 4, NAME : "AveragePower", UNIT : "W", SIGNED : true,},
    "0x2B" : {SIZE : 4, NAME : "MIDYearOfCertification",},
    "0xF0" : {SIZE : 2, NAME : "ManufacturedYear", DIGIT: true,},
    "0xF1" : {SIZE : 2, NAME : "FirmwareVersion", DIGIT: false,},
    "0xF2" : {SIZE : 2, NAME : "HardwareVersion", DIGIT: false,},
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
                    }else
                    {
                        if("VALUES" in info)
                        {
                            // Decode into STRING (VALUES specified in CONFIG_INFO)
                            value = "0x" + toEvenHEX(bytes[index].toString(16).toUpperCase());
                            value = info.VALUES[value];
                        }else
                        {
                            // Decode into DECIMAL format
                            value = getValueFromBytesBigEndianFormat(bytes, index, size);
                        }
                    }
                    decoded[info.NAME] = value;
                    index = index + size;
                }else
                {
                    // Device Model (End of decoding)
                    size = LENGTH - index;
                    decoded[info.NAME] = getStringFromBytesBigEndianFormat(bytes, index, size);
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
                value = value * measurement["RESOLUTION"];
                value = parseFloat(value.toFixed(2));
            }
            if("UNIT" in measurement)
            {
                decoded[measurement.NAME] = {};
                decoded[measurement.NAME]["data"] = value;
                decoded[measurement.NAME]["unit"] = measurement.UNIT;
                // decoded[measurement.NAME] = value;
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
    }else if(fPort <= 10)
    {
        return decodeDeviceData(bytes);
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
        }else if(obj[CONFIG_DOWNLINK.TYPE] == CONFIG_DOWNLINK.MEASURE)
        {
            return encodePeriodicPackage(obj[[CONFIG_DOWNLINK.MEASURE]], variables);
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
        "PrimaryCurrentTransformerRatio" : {TYPE : parseInt("0x1E", 16), SIZE : 2, MIN : 0, MAX : 9999,},
        "SecondaryCurrentTransformerRatio" : {TYPE : parseInt("0x1F", 16), SIZE : 1, MIN : 0, MAX : 5,},
        "PrimaryVoltageTransformerRatio" : {TYPE : parseInt("0x20", 16), SIZE : 4, MIN : 30, MAX : 500000,},
        "SecondaryVoltageTransformerRatio" : {TYPE : parseInt("0x21", 16), SIZE : 2, MIN : 30, MAX : 500,},
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
        ActiveEnergyImportL123T1 : "0x04",
        ActiveEnergyImportL123T2 : "0x05",
        ActiveEnergyExportL123T1 : "0x06",
        ActiveEnergyExportL123T2 : "0x07",
        ReactiveEnergyImportL123T1 : "0x08",
        ReactiveEnergyImportL123T2 : "0x09",
        ReactiveEnergyExportL123T1 : "0x0A",
        ReactiveEnergyExportL123T2 : "0x0B",
        VoltageL1N : "0x0C",
        VoltageL2N : "0x0D",
        VoltageL3N : "0x0E",
        CurrentL123 : "0x0F",
        CurrentL1 : "0x10",
        CurrentL2 : "0x11",
        CurrentL3 : "0x12",
        ActivePowerL123 : "0x13",
        ActivePowerL1 : "0x14",
        ActivePowerL2 : "0x15",
        ActivePowerL3 : "0x16",
        ReactivePowerL1 : "0x17",
        ReactivePowerL2 : "0x18",
        ReactivePowerL3 : "0x19",
        ApparentPowerL1 : "0x1A",
        ApparentPowerL2 : "0x1B",
        ApparentPowerL3 : "0x1C",
        PowerFactorL1 : "0x1D",
        PowerFactorL2 : "0x1E",
        PowerFactorL3 : "0x1F",
        PhaseAngleL1 : "0x20",
        PhaseAngleL2 : "0x21",
        PhaseAngleL3 : "0x22",
        Frequency : "0x23",
        TotalSystemActivePower : "0x24",
        TotalSystemReactivePower : "0x25",
        TotalSystemApparentPower : "0x26",
        MaximumL1CurrentDemand : "0x27",
        MaximumL2CurrentDemand : "0x28",
        MaximumL3CurrentDemand : "0x29",
        AveragePower : "0x2A",
        MIDYearofCertification : "0x2B",
        ManufacturedYear : "0xF0",
        FirmwareVersion : "0xF1",
        HardwareVersion : "0xF2",
    }
}

// Constants for downlink type (Config or Measure)
var CONFIG_DOWNLINK = {
    TYPE    : "Type",
    CONFIG  : "Config",
    MEASURE : "Measure",
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
            encoded[index] = CONFIG_DEVICE.CHANNEL;
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
