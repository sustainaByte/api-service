import { generateRandomPassword } from 'src/utils';

describe('generateRandomPassword', () => {
  it('should generate a password of the specified length', () => {
    const passwordLength = 12;
    const generatedPassword = generateRandomPassword(passwordLength);

    expect(generatedPassword).toHaveLength(passwordLength);
  });

  it('should only include characters from the specified character sets', () => {
    const passwordLength = 12;
    const generatedPassword = generateRandomPassword(passwordLength);

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const specialChars = "!@#$%^&*";
    
    const allowedChars = chars + specialChars;

    for (const char of generatedPassword) {
      expect(allowedChars).toContain(char);
    }
  });

  it('should include at least one special character', () => {
    const passwordLength = 12;
    const generatedPassword = generateRandomPassword(passwordLength);

    const specialChars = "!@#$%^&*";

    const hasSpecialChar = [...generatedPassword].some(char => specialChars.includes(char));

    expect(hasSpecialChar).toBe(true);
  });
});
