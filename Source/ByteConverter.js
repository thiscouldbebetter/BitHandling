"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var BitHandling;
    (function (BitHandling) {
        class ByteConverter {
            /*
            numberOfBits: number;
            numberOfBytes: number;
            maxValueSigned: number;
            maxValueUnsigned: number;
            */
            constructor() {
                /*
                this.numberOfBits = numberOfBits;
                this.numberOfBytes = Math.floor(this.numberOfBits / 8);
        
                this.maxValueSigned =
                    (1 << (numberOfBits - 1)) - 1;
        
                this.maxValueUnsigned =
                    (1 << (numberOfBits));
                */
            }
            bytesToFloat(bytes) {
                var bytesAsInteger = this.bytesToIntegerSignedBE(bytes); // Signed or unsigned?  BE or LE?
                var returnValue = this.integerToFloat(bytesAsInteger, bytes.length * ByteConverter.BitsPerByte);
                return returnValue;
            }
            bytesToIntegerSignedBE(bytes) {
                // Big-endian.
                var returnValue = 0;
                var numberOfBytes = bytes.length;
                for (var i = 0; i < numberOfBytes; i++) {
                    var byte = bytes[numberOfBytes - i - 1];
                    returnValue |= byte << (i * ByteConverter.BitsPerByte);
                }
                var numberOfBits = numberOfBytes * ByteConverter.BitsPerByte;
                var maxValueSigned = (1 << (numberOfBits - 1)) - 1;
                if (returnValue > maxValueSigned) {
                    var maxValueUnsigned = 1 << numberOfBits;
                    returnValue -= maxValueUnsigned;
                }
                return returnValue;
            }
            bytesToIntegerSignedLE(bytes) {
                // Little-endian.
                var returnValue = 0;
                var numberOfBytes = bytes.length;
                for (var i = 0; i < numberOfBytes; i++) {
                    returnValue |= bytes[i] << (i * ByteConverter.BitsPerByte);
                }
                var numberOfBits = numberOfBytes * ByteConverter.BitsPerByte;
                var maxValueSigned = (1 << (numberOfBits - 1)) - 1;
                if (returnValue > maxValueSigned) {
                    var maxValueUnsigned = 1 << numberOfBits;
                    returnValue -= maxValueUnsigned;
                }
                return returnValue;
            }
            bytesToIntegerUnsignedBE(bytes) {
                // Big-endian.
                var returnValue = 0;
                var numberOfBytes = bytes.length;
                for (var i = 0; i < numberOfBytes; i++) {
                    var byte = bytes[numberOfBytes - i - 1];
                    returnValue |= byte << (i * ByteConverter.BitsPerByte);
                }
                return returnValue;
            }
            bytesToIntegerUnsignedLE(bytes) {
                // Little-endian.
                var returnValue = 0;
                var numberOfBytes = bytes.length;
                for (var i = 0; i < numberOfBytes; i++) {
                    returnValue |= bytes[i] << (i * ByteConverter.BitsPerByte);
                }
                return returnValue;
            }
            bytesToString(bytes) {
                return bytes.map(x => String.fromCharCode(x)).join("");
            }
            floatToInteger(float, numberOfBits) {
                var maxValueSigned = (1 << (numberOfBits - 1)) - 1;
                return float * maxValueSigned;
            }
            integerToBytesBE(integer, numberOfBytes) {
                // Big-endian.
                var returnValues = new Array();
                for (var i = 0; i < numberOfBytes; i++) {
                    var byteValue = (integer >> (ByteConverter.BitsPerByte * i)) & 0xFF;
                    returnValues.splice(0, 0, byteValue);
                }
                return returnValues;
            }
            integerUnsignedToBytesLE(integer, numberOfBytes) {
                // Little-endian.
                var returnValues = new Array();
                for (var i = 0; i < numberOfBytes; i++) {
                    var byteValue = (integer >> (ByteConverter.BitsPerByte * i)) & 0xFF;
                    returnValues.push(byteValue);
                }
                return returnValues;
            }
            integerUnsigned16BitToBytesLE(integer16Bit) {
                return this.integerUnsignedToBytesLE(integer16Bit, 2);
            }
            integerUnsigned32BitToBytesLE(integer32Bit) {
                return this.integerUnsignedToBytesLE(integer32Bit, 4);
            }
            integerToFloat(integer, numberOfBits) {
                var maxValueSigned = (1 << (numberOfBits - 1)) - 1;
                var returnValue = integer / maxValueSigned;
                return returnValue;
            }
            stringToBytes(stringToConvert) {
                return stringToConvert.split("").map(x => x.charCodeAt(0));
            }
        }
        ByteConverter.BitsPerByte = 8;
        ByteConverter.BitsPerByteTimesTwo = ByteConverter.BitsPerByte * 2;
        ByteConverter.BitsPerByteTimesThree = ByteConverter.BitsPerByte * 3;
        BitHandling.ByteConverter = ByteConverter;
    })(BitHandling = ThisCouldBeBetter.BitHandling || (ThisCouldBeBetter.BitHandling = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
