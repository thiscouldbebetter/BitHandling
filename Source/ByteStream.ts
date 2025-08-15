
namespace ThisCouldBeBetter.BitHandling
{

export class ByteStream
{
	bytes: number[];

	numberOfBytesTotal: number;
	byteIndexCurrent: number;

	constructor(bytes: number[])
	{
		this.bytes = bytes;

		this.numberOfBytesTotal = this.bytes.length;
		this.byteIndexCurrent = 0;
	}

	static fromBytes(bytes: number[] ): ByteStream
	{
		return new ByteStream(bytes);
	}

	byteIndexSet(value: number): ByteStream
	{
		this.byteIndexCurrent = value;
		return this;
	}

	hasMoreBytes(): boolean
	{
		return (this.byteIndexCurrent < this.numberOfBytesTotal);
	}

	peekByteCurrent(): number
	{
		var byteCurrent = this.bytes[this.byteIndexCurrent];

		return byteCurrent;
	}

	peekBytes(numberOfBytesToRead: number): number[]
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.bytes[this.byteIndexCurrent + b];
		}

		return returnValue;
	}

	readByte(): number
	{
		var returnValue = this.bytes[this.byteIndexCurrent];

		this.byteIndexCurrent++;

		return returnValue;
	}

	readBytes(numberOfBytesToRead: number): number[]
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.readByte();
		}

		return returnValue;
	}

	writeByte(byteToWrite: number): void
	{
		this.bytes.push(byteToWrite);

		this.byteIndexCurrent++;
	}

	writeBytes(bytesToWrite: number[]): void
	{
		for (var b = 0; b < bytesToWrite.length; b++)
		{
			this.bytes.push(bytesToWrite[b]);
		}

		this.byteIndexCurrent = this.bytes.length;
	}
}

}