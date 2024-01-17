import axios from 'axios';
import { getHolidays, checkForHoliday } from 'src/utils';
import { BASE_URL_HOLIDAY } from 'src/constants';

jest.mock('axios');

describe('Holiday Service', () => {
  describe('getHolidays', () => {
    it('should fetch holidays for the current year and country', async () => {
      const currentYear = new Date().getFullYear();
      const responseMock = {
        data: [{ date: '2022-01-01' }, { date: '2022-12-25' }],
      };

      (axios.get as jest.Mock).mockResolvedValue(responseMock);

      const result = await getHolidays();

      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL_HOLIDAY}/${currentYear}/RO`);
      expect(result).toEqual(responseMock.data);
    });

    it('should throw an error if the API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(getHolidays()).rejects.toThrowError('Failed to retrieve holiday data from the API.');
    });
  });

  describe('checkForHoliday', () => {
    it('should return true if the provided date is a holiday', async () => {
      const responseMock = {
        data: [{ date: '2022-01-01' }, { date: '2022-12-25' }],
      };

      (axios.get as jest.Mock).mockResolvedValue(responseMock);

      const result = await checkForHoliday('2022-01-01');

      expect(result).toBe(true);
    });
    it('should return false if the provided date is not a holiday', async () => {
      const responseMock = {
        data: [{ date: '2022-12-25' }],
      };

      (axios.get as jest.Mock).mockResolvedValue(responseMock);

      const result = await checkForHoliday('2022-01-01');

      expect(result).toBe(false);
    });

    it('should throw an error if the API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(checkForHoliday('2022-01-01')).rejects.toThrowError('Failed to retrieve holiday data from the API.');
    });
  });
});