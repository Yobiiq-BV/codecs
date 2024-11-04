/**
 * Codec for FM432g device : compatible with TTN, ChirpStack v4 and v3, etc...
 * Release Date : 26 June 2023
 * Update  Date : 15 March 2024
 */

// Config for FM432g device
var CONFIG = {
    T1_HEADERS : {
        STEP_10_MIN : parseInt("0x1D", 16),
        STEP_15_MIN : parseInt("0x1E", 16),
        STEP_60_MIN : parseInt("0x1F", 16),
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
    var timestamp = parseInt(Date.now()/1000); // timestamp in seconds
    var header = bytes[0];

    if( header == CONFIG.T1_HEADERS.STEP_10_MIN ||
        header == CONFIG.T1_HEADERS.STEP_15_MIN ||
        header == CONFIG.T1_HEADERS.STEP_60_MIN)
    {
        return DecodeT1Payload(bytes, timestamp);
    }

    return {
        warning: "Payload is not T1 message", 
        rawPayload: getDigitStringArrayEvenFormat(bytes, 0, bytes.length).join("")
    };
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

/************************************ Functions from FM432 Manual *********************************************/

// return index from T1 payload
function decode_index(payload) {
    var index = null;
    if (payload.length == 40) {
        index = payload.substring(2, 8);
    }
    return parseInt(index, 16);
}
   
// return hexadecimal power list from T1 payload
function payload_to_hex(payload) {
    var list_increment_hex = []
    if (payload.length == 40){
        for(i=0;i<16;i=i+1){
            list_increment_hex.push(payload.substring((8+2*i),2+(8+2*i)))
        }
    }
    return list_increment_hex
}
   
// return power list from T1 payload
function decode_list_increment(payload) {
    var list_increment = []
    var list_increment_hex = []
    if (payload.length == 40){
        list_increment_hex = payload_to_hex(payload)
    }
    if(list_increment_hex.length == 16){
        for(i=0;i<8;i=i+1){
            list_increment.push(parseInt(list_increment_hex[i*2]+list_increment_hex[i*2+1], 16))
        }
    } 
    return list_increment
}

// return step from T1 payload
function decode_step(payload){
    var step = 0
    var header = null
    if(payload.length == 40){
        header = parseInt(payload.substring(0, 2), 16)
        if(header == 29) step = 10
        if(header == 30) step = 15
        if(header == 31) step = 60
    }
    return step
}

/************************************************************************************************************/

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

function DecodeT1Payload(bytes, timestamp)
{
    var decoded = {};
    var payload = getDigitStringArrayEvenFormat(bytes, 0, bytes.length).join("");
    decoded.rawPayload = payload;
    try
    {
        decoded.index = decode_index(payload);
        decoded.stepInMinute = decode_step(payload);
        decoded.listOfIncrements = [];
        var increments = decode_list_increment(payload);
        for(var i=0; i<increments.length; i=i+1)
        {
            var increment = {};
            increment.value = increments[i];
            increment.timestamp = timestamp - ((8 - i)*decoded.stepInMinute*60);
            decoded.listOfIncrements.push(increment);
        }

    }catch(error)
    {

    }
    return decoded;
}
