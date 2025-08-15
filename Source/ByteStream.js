"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var BitHandling;
    (function (BitHandling) {
        class ByteStream {
            constructor(bytes) {
                this.bytes = bytes;
                this.numberOfBytesTotal = this.bytes.length;
                this.byteIndexCurrent = 0;
            }
            static fromBytes(bytes) {
                return new ByteStream(bytes);
            }
            byteIndexSet(value) {
                this.byteIndexCurrent = value;
                return this;
            }
            hasMoreBytes() {
                return (this.byteIndexCurrent < this.numberOfBytesTotal);
            }
            peekByteCurrent() {
                var byteCurrent = this.bytes[this.byteIndexCurrent];
                return byteCurrent;
            }
            peekBytes(numberOfBytesToRead) {
                var returnValue = [];
                for (var b = 0; b < numberOfBytesToRead; b++) {
                    returnValue[b] = this.bytes[this.byteIndexCurrent + b];
                }
                return returnValue;
            }
            readByte() {
                var returnValue = this.bytes[this.byteIndexCurrent];
                this.byteIndexCurrent++;
                return returnValue;
            }
            readBytes(numberOfBytesToRead) {
                var returnValue = [];
                for (var b = 0; b < numberOfBytesToRead; b++) {
                    returnValue[b] = this.readByte();
                }
                return returnValue;
            }
            writeByte(byteToWrite) {
                this.bytes.push(byteToWrite);
                this.byteIndexCurrent++;
            }
            writeBytes(bytesToWrite) {
                for (var b = 0; b < bytesToWrite.length; b++) {
                    this.bytes.push(bytesToWrite[b]);
                }
                this.byteIndexCurrent = this.bytes.length;
            }
        }
        BitHandling.ByteStream = ByteStream;
    })(BitHandling = ThisCouldBeBetter.BitHandling || (ThisCouldBeBetter.BitHandling = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
