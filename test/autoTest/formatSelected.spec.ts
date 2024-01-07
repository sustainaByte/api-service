import { formatSelectedFields } from 'src/utils';

describe('formatSelectedFields', () => {
  it('should return default fields if no filters are provided', () => {
    const defaultFields = '-__v -organizationId';
    const result = formatSelectedFields([]);

    expect(result).toBe(defaultFields);
  });

  it('should format selected fields if filters are provided', () => {
    const filters = ['field1', 'field2', 'field3'];
    const expectedResult = 'field1 field2 field3';
    const result = formatSelectedFields(filters);

    expect(result).toBe(expectedResult);
  });

  it('should handle an empty array of filters', () => {
    const emptyFilters = [];
    const defaultFields = '-__v -organizationId';
    const result = formatSelectedFields(emptyFilters);

    expect(result).toBe(defaultFields);
  });
});
