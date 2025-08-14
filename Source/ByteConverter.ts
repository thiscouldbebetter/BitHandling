
namespace ThisCouldBeBetter.BitHandling
{

export class ByteConverter
{
	static BitsPerByte = 8;
	static BitsPerByteTimesTwo = ByteConverter.BitsPerByte * 2;
	static BitsPerByteTimesThree = ByteConverter.BitsPerByte * 3;

	/*
	numberOfBits: number;
	numberOfBytes: number;
	maxValueSigned: number;
	maxValueUnsigned: number;
	*/

	constructor()
	{
		/*
		this.numberOfBits = numberOfBits;
		this.numberOfBytes = Math.floor(this.numberOfBits / 8);

		this.maxValueSigned =
			(1 << (numberOfBits - 1)) - 1;

		this.maxValueUnsigned =
			(1 << (numberOfBits));
		*/
	}

	bytesToFloat(bytes: number[]): number
	{
		var bytesAsInteger = this.bytesToIntegerSignedBE(bytes); // Signed or unsigned?  BE or LE?

		var returnValue = this.integerToFloat(bytesAsInteger, bytes.length * ByteConverter.BitsPerByte);

		return returnValue;
	}

	bytesToIntegerSignedBE(bytes: number[]): number
	{
		// Big-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			var byte = bytes[numberOfBytes - i - 1];
			returnValue |= byte << (i * ByteConverter.BitsPerByte);
		}

		var numberOfBits = numberOfBytes * ByteConverter.BitsPerByte;

		var maxValueSigned =
			(1 << (numberOfBits - 1)) - 1;

		if (returnValue > maxValueSigned)
		{
			var maxValueUnsigned = 1 << numberOfBits;

			returnValue -= maxValueUnsigned;
		}

		return returnValue;
	}

	bytesToIntegerSignedLE(bytes: number[]): number
	{
		// Little-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			returnValue |= bytes[i] << (i * ByteConverter.BitsPerByte);
		}

		var numberOfBits = numberOfBytes * ByteConverter.BitsPerByte;

		var maxValueSigned =
			(1 << (numberOfBits - 1)) - 1;

		if (returnValue > maxValueSigned)
		{
			var maxValueUnsigned = 1 << numberOfBits;

			returnValue -= maxValueUnsigned;
		}

		return returnValue;
	}

	bytesToIntegerUnsignedBE(bytes: number[]): number
	{
		// Big-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			var byte = bytes[numberOfBytes - i - 1];
			returnValue |= byte << (i * ByteConverter.BitsPerByte);
		}

		return returnValue;
	}

	bytesToIntegerUnsignedLE(bytes: number[]): number
	{
		// Little-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			returnValue |= bytes[i] << (i * ByteConverter.BitsPerByte);
		}

		return returnValue;
	}

	bytesToString(bytes: number[]): string
	{
		return bytes.map(x => String.fromCharCode(x) ).join("");
	}

	floatToInteger(float: number, numberOfBits: number): number
	{
		var maxValueSigned =
			(1 << (numberOfBits - 1)) - 1;

		return float * maxValueSigned;
	}

	integerToBytesBE(integer: number, numberOfBytes: number): number[]
	{
		// Big-endian.
		var returnValues = new Array<number>();

		for (var i = 0; i < numberOfBytes; i++)
		{
			var byteValue = (integer >> (ByteConverter.BitsPerByte * i)) & 0xFF;
			returnValues.splice(0, 0, byteValue);
		}

		return returnValues;
	}

	integerUnsignedToBytesLE(integer: number, numberOfBytes: number): number[]
	{
		// Little-endian.
		var returnValues = new Array<number>();

		for (var i = 0; i < numberOfBytes; i++)
		{
			var byteValue = (integer >> (ByteConverter.BitsPerByte * i)) & 0xFF;
			returnValues.push(byteValue);
		}

		return returnValues;
	}

	integerUnsigned16BitToBytesLE(integer16Bit: number): number[]
	{
		return this.integerUnsignedToBytesLE(integer16Bit, 2);
	}

	integerUnsigned32BitToBytesLE(integer32Bit: number): number[]
	{
		return this.integerUnsignedToBytesLE(integer32Bit, 4);
	}

	integerToFloat(integer: number, numberOfBits: number): number
	{
		var maxValueSigned =
			(1 << (numberOfBits - 1)) - 1;

		var returnValue =
			integer / maxValueSigned;

		return returnValue;
	}

	stringToBytes(stringToConvert: string): number[]
	{
		return stringToConvert.split("").map(x => x.charCodeAt(0) );
	}
}

}