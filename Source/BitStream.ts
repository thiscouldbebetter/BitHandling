
namespace ThisCouldBeBetter.BitHandling
{

export class BitStream
{
	static BitsPerByte = 8;
	static NaturalLogarithmOf2 = Math.log(2);

	byteStream: ByteStream;
	bitOffsetWithinByteCurrent: number;
	byteCurrent: number;

	bitsShouldNotBeReversed: boolean;

	constructor(byteStream: ByteStream, bitsShouldNotBeReversed: boolean)
	{
		this.byteStream = byteStream || new ByteStream([]);
		this.bitsShouldNotBeReversed = bitsShouldNotBeReversed || false;
		this.bitOffsetWithinByteCurrent = 0;
		this.byteCurrent = 0;
	}

	static fromByteStream(byteStream: ByteStream): BitStream
	{
		return new BitStream(byteStream, null);
	}

	static fromByteStreamAndBitsShouldNotBeReversed
	(
		byteStream: ByteStream,
		bitsShouldNotBeReversed: boolean
	): BitStream
	{
		return new BitStream(byteStream, bitsShouldNotBeReversed);
	}

	static fromBytes(bytes: number[]): BitStream
	{
		return new BitStream(ByteStream.fromBytes(bytes), null);
	}

	static convertNumberToBitString(numberToConvert: number)
	{
		var returnValue = "";
		var numberOfBitsNeeded = Math.ceil
		(
			Math.log(numberToConvert + 1)
			/ BitStream.NaturalLogarithmOf2
		);

		if (numberOfBitsNeeded == 0)
		{
			numberOfBitsNeeded = 1;
		}

		for (var b = 0; b < numberOfBitsNeeded; b++)
		{
			var bitValue = (numberToConvert >> b) & 1;
			returnValue = "" + bitValue + returnValue;
		}

		return returnValue;
	}

	// instance methods

	byteIndexCurrent(): number
	{
		return this.byteStream.byteIndexCurrent;
	}

	byteIndexIncrement(): BitStream
	{
		this.byteStream.readByte();
		this.bitOffsetWithinByteCurrent = 0;
		return this;
	}

	byteIndexSet(value: number): BitStream
	{
		this.byteStream.byteIndexSet(value);
		this.bitOffsetWithinByteCurrent = 0;
		return this;
	}

	close(): void
	{
		if (this.bitOffsetWithinByteCurrent > 0)
		{
			this.byteStream.writeByte(this.byteCurrent);
		}
	}

	hasMoreBits(): boolean
	{
		return this.byteStream.hasMoreBytes();
	}

	peekBits(numberOfBitsToPeek: number): string
	{
		var byteIndexCurrentToRestore =
			this.byteStream.byteIndexCurrent;
		var bitOffsetWithinByteCurrentToRestore =
			this.bitOffsetWithinByteCurrent;

		var bitsPeekedAsString =
			this.readBitsAsString(numberOfBitsToPeek);

		this.byteStream.byteIndexCurrent =
			byteIndexCurrentToRestore;
		this.bitOffsetWithinByteCurrent =
			bitOffsetWithinByteCurrentToRestore;

		return bitsPeekedAsString;
	}

	posAsString(): string
	{
		var returnValue =
			"0x" + this.byteStream.byteIndexCurrent.toString(16)
			+ "." + this.bitOffsetWithinByteCurrent;
		return returnValue;
	}

	readBit(): number
	{
		var returnValue =
			this.bitsShouldNotBeReversed
			? this.readBitNonReversed()
			: this.readBitReversed();
		return returnValue;
	}

	readBitNonReversed(): number
	{
		// Taken from Storage/Compressor/BitStream.ts.
		// Does not reverse the i.

		this.byteCurrent = this.byteStream.peekByteCurrent();
		var returnValue = (this.byteCurrent >> this.bitOffsetWithinByteCurrent) & 1;
		this.bitOffsetWithinByteCurrent++;

		if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte)
		{
			//this.byteOffset++;
			this.bitOffsetWithinByteCurrent = 0;
			if (this.byteStream.hasMoreBytes())
			{
				this.byteCurrent = this.byteStream.readByte();
			}
		}
		return returnValue;
	}

	readBitReversed(): number
	{
		this.byteCurrent = this.byteStream.peekByteCurrent();
		var bitOffsetWithinByteCurrentReversed =
			BitStream.BitsPerByte - this.bitOffsetWithinByteCurrent - 1;
		var returnValue =
			(this.byteCurrent >> bitOffsetWithinByteCurrentReversed) & 1;
		this.bitOffsetWithinByteCurrent++;

		if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte)
		{
			this.bitOffsetWithinByteCurrent = 0;
			if (this.byteStream.hasMoreBytes())
			{
				this.byteCurrent = this.byteStream.readByte();
			}
		}
		return returnValue;
	}

	readBits(numberOfBitsToRead: number): number[]
	{
		var bitsRead = [];

		for (var i = 0; i < numberOfBitsToRead; i++)
		{
			var bitRead = this.readBit();
			bitsRead.push(bitRead);
		}

		return bitsRead;
	}

	readBitsAsString(numberOfBitsToRead: number): string
	{
		var bitsRead = this.readBits(numberOfBitsToRead);
		var bitsReadAsString = bitsRead.join("");
		return bitsReadAsString;
	}

	readByte(): number
	{
		// todo - Check alignment.
		return this.byteStream.readByte();
	}

	readBytes(bytesCount: number): number[]
	{
		// todo - Check alignment.
		return this.byteStream.readBytes(bytesCount);
	}

	readIntegerFromBits(numberOfBitsInInteger: number): number
	{
		var returnValue =
			this.bitsShouldNotBeReversed
			? this.readIntegerFromBitsNonReversed(numberOfBitsInInteger)
			: this.readIntegerFromBitsReversed(numberOfBitsInInteger);
		return returnValue;
	}

	readIntegerFromBitsNonReversed(numberOfBitsInNumber: number): number
	{
		// Taken from Storage/Compressor/BitStream.ts.
		// Does not reverse the i.

		var returnValue = 0;

		for (var i = 0; i < numberOfBitsInNumber; i++)
		{
			var bitRead = this.readBit();
			returnValue |= (bitRead << i);
		}

		return returnValue;
	}

	readIntegerFromBitsReversed(numberOfBitsInInteger: number): number
	{
		var returnValue = 0;

		for (var i = 0; i < numberOfBitsInInteger; i++)
		{
			var iReversed = numberOfBitsInInteger - i - 1;
			var bitRead = this.readBit();
			returnValue |= (bitRead << iReversed);
		}

		return returnValue;
	}

	writeBit(bitToWrite: number): BitStream
	{
		this.byteCurrent |= (bitToWrite << this.bitOffsetWithinByteCurrent);
		this.bitOffsetWithinByteCurrent++;

		if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte)
		{
			this.byteStream.writeByte(this.byteCurrent);
			this.bitOffsetWithinByteCurrent = 0;
			this.byteCurrent = 0;
		}

		return this;
	}

	writeInteger(integerToWrite: number, numberOfBitsToUse: number): BitStream
	{
		for (var b = 0; b < numberOfBitsToUse; b++)
		{
			var bitValue = (integerToWrite >> b) & 1;
			this.writeBit(bitValue);
		}
		return this;
	}
}

}
