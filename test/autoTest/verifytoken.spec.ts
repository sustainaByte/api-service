import { BadRequestException } from '@nestjs/common';
import { checkIdFormat } from 'src/utils';
import { formatErrorResponse } from 'src/utils/index';

jest.mock('src/utils/index');

describe('checkIdFormat', () => {
  it('should not throw an exception for a valid objectId format', () => {
    const validObjectId = '5f4f8b72fc13ae343c000000'; // Replace with a valid objectId
    expect(() => checkIdFormat(validObjectId)).not.toThrow();
  });

  it('should throw BadRequestException for an invalid objectId format', () => {
    const invalidObjectId = 'invalidObjectId';
    const expectedErrorMessage = 'Invalid objectId format.';

    // Mock formatErrorResponse function
    (formatErrorResponse as jest.Mock).mockReturnValue(expectedErrorMessage);

    expect(() => checkIdFormat(invalidObjectId)).toThrow(BadRequestException);
    expect(formatErrorResponse).toHaveBeenCalledWith({ message: expectedErrorMessage });
  });
});
