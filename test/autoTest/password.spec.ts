import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from 'src/services';
import { EmailService } from 'src/services';
import { UserRepository } from 'src/repositories';
import { BadRequestException } from '@nestjs/common';

// Mocking the dependencies
jest.mock('src/services');
jest.mock('src/repositories');

describe('PasswordService', () => {
  let passwordService: PasswordService;
  let emailService: EmailService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        EmailService,
        UserRepository,
      ],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
    emailService = module.get<EmailService>(EmailService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('forgotPassword', () => {
    it('should send reset password email', async () => {
      const email = 'test@example.com';
      const forgotPasswordDto = { email };
    
      jest.spyOn(emailService, 'sendCustomEmail').mockImplementation(async () => undefined);
    
      await passwordService.forgotPassword(forgotPasswordDto);
    
      expect(emailService.sendCustomEmail).toHaveBeenCalledWith(
        'Reset Password Link',
        email,
        expect.stringContaining('/reset-password?token='),
      );
    });
    

    it('should throw BadRequestException on error', async () => {
      const email = 'test@example.com';
      const forgotPasswordDto = { email };

      jest.spyOn(emailService, 'sendCustomEmail').mockRejectedValue(new Error('Email sending failed'));

      await expect(passwordService.forgotPassword(forgotPasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  // Add more tests for resetPassword method
  // ...

  afterEach(() => {
    jest.clearAllMocks();
  });
});
