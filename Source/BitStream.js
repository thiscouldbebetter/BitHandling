"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var BitHandling;
    (function (BitHandling) {
        class BitStream {
            constructor(byteStream) {
                if (byteStream == null) {
                    byteStream = new BitHandling.ByteStream([]);
                }
                this.byteStream = byteStream;
                this.bitOffsetWithinByteCurrent = 0;
                this.byteCurrent = 0;
            }
            static fromBytes(bytes) {
                return new BitStream(BitHandling.ByteStream.fromBytes(bytes));
            }
            static convertNumberToBitString(numberToConvert) {
                var returnValue = "";
                var numberOfBitsNeeded = Math.ceil(Math.log(numberToConvert + 1)
                    / BitStream.NaturalLogarithmOf2);
                if (numberOfBitsNeeded == 0) {
                    numberOfBitsNeeded = 1;
                }
                for (var b = 0; b < numberOfBitsNeeded; b++) {
                    var bitValue = (numberToConvert >> b) & 1;
                    returnValue = "" + bitValue + returnValue;
                }
                return returnValue;
            }
            // instance methods
            byteIndexCurrent() {
                return this.byteStream.byteIndexCurrent;
            }
            byteIndexIncrement() {
                this.byteStream.readByte();
                this.bitOffsetWithinByteCurrent = 0;
                return this;
            }
            byteIndexSet(value) {
                this.byteStream.byteIndexSet(value);
                this.bitOffsetWithinByteCurrent = 0;
                return this;
            }
            close() {
                if (this.bitOffsetWithinByteCurrent > 0) {
                    this.byteStream.writeByte(this.byteCurrent);
                }
            }
            hasMoreBits() {
                return this.byteStream.hasMoreBytes();
            }
            peekBits(numberOfBitsToPeek) {
                var byteIndexCurrentToRestore = this.byteStream.byteIndexCurrent;
                var bitOffsetWithinByteCurrentToRestore = this.bitOffsetWithinByteCurrent;
                var bitsPeekedAsString = this.readBitsAsString(numberOfBitsToPeek);
                this.byteStream.byteIndexCurrent =
                    byteIndexCurrentToRestore;
                this.bitOffsetWithinByteCurrent =
                    bitOffsetWithinByteCurrentToRestore;
                return bitsPeekedAsString;
            }
            readBit() {
                this.byteCurrent = this.byteStream.peekByteCurrent();
                var bitOffsetWithinByteCurrentReversed = BitStream.BitsPerByte - this.bitOffsetWithinByteCurrent - 1;
                var returnValue = (this.byteCurrent >> bitOffsetWithinByteCurrentReversed) & 1;
                this.bitOffsetWithinByteCurrent++;
                if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte) {
                    this.bitOffsetWithinByteCurrent = 0;
                    if (this.byteStream.hasMoreBytes()) {
                        this.byteCurrent = this.byteStream.readByte();
                    }
                }
                return returnValue;
            }
            readBits(numberOfBitsToRead) {
                var bitsRead = [];
                for (var i = 0; i < numberOfBitsToRead; i++) {
                    var bitRead = this.readBit();
                    bitsRead.push(bitRead);
                }
                return bitsRead;
            }
            readBitsAsString(numberOfBitsToRead) {
                var bitsRead = this.readBits(numberOfBitsToRead);
                var bitsReadAsString = bitsRead.join("");
                return bitsReadAsString;
            }
            readByte() {
                // todo - Check alignment.
                return this.byteStream.readByte();
            }
            readBytes(bytesCount) {
                // todo - Check alignment.
                return this.byteStream.readBytes(bytesCount);
            }
            readIntegerFromBits(numberOfBitsInInteger) {
                var returnValue = 0;
                for (var i = 0; i < numberOfBitsInInteger; i++) {
                    var iReversed = numberOfBitsInInteger - i - 1;
                    var bitRead = this.readBit();
                    returnValue |= (bitRead << iReversed);
                }
                return returnValue;
            }
            writeBit(bitToWrite) {
                this.byteCurrent |= (bitToWrite << this.bitOffsetWithinByteCurrent);
                this.bitOffsetWithinByteCurrent++;
                if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte) {
                    this.byteStream.writeByte(this.byteCurrent);
                    this.bitOffsetWithinByteCurrent = 0;
                    this.byteCurrent = 0;
                }
                return this;
            }
            writeInteger(integerToWrite, numberOfBitsToUse) {
                for (var b = 0; b < numberOfBitsToUse; b++) {
                    var bitValue = (integerToWrite >> b) & 1;
                    this.writeBit(bitValue);
                }
                return this;
            }
        }
        BitStream.BitsPerByte = 8;
        BitStream.NaturalLogarithmOf2 = Math.log(2);
        BitHandling.BitStream = BitStream;
    })(BitHandling = ThisCouldBeBetter.BitHandling || (ThisCouldBeBetter.BitHandling = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
