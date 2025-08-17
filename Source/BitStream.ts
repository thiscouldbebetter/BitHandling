
namespace ThisCouldBeBetter.BitHandling
{

export class BitStream
{
	static BitsPerByte = 8;
	static NaturalLogarithmOf2 = Math.log(2);

	byteStream: ByteStream;
	bitOffsetWithinByteCurrent: number;
	byteCurrent: number;

	constructor(byteStream: ByteStream)
	{
		if (byteStream == null)
		{
			byteStream = new ByteStream([]);
		}

		this.byteStream = byteStream;
		this.bitOffsetWithinByteCurrent = 0;
		this.byteCurrent = 0;
	}

	static fromBytes(bytes: number[]): BitStream
	{
		return new BitStream(ByteStream.fromBytes(bytes) );
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

	readBit(): number
	{
		this.byteCurrent = this.byteStream.peekByteCurrent();
		var returnValue =
			(this.byteCurrent >> this.bitOffsetWithinByteCurrent) & 1;
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
		var returnValue = 0;

		for (var i = 0; i < numberOfBitsInInteger; i++) {
			var bitRead = this.readBit();
			returnValue |= (bitRead << i);
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
