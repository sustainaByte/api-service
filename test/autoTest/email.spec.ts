import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from 'src/services/EmailService';
import { CustomLogger } from 'src/utils';
import { BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

describe('EmailService', () => {
  let emailService: EmailService;
  let loggerMock: CustomLogger;

  beforeEach(async () => {
    loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(), // Add a warn property to the mock
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: CustomLogger, useValue: loggerMock },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  describe('sendCustomEmail', () => {
    it('should send an email successfully', async () => {
      const sendMailMock = jest.fn().mockResolvedValueOnce({});

      const transporterMock = {
        sendMail: sendMailMock,
      };

      jest.spyOn(nodemailer, 'createTransport').mockReturnValueOnce(transporterMock as any);

      const type = 'TestType';
      const email = 'test@example.com';
      const content = 'Test Content';

      await emailService.sendCustomEmail(type, email, content);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.MAIL_SERVICE_USER,
        to: email,
        subject: type,
        text: `Your ${type} is: ${content}`,
      });

      expect(loggerMock.log).toHaveBeenCalledWith(`${type} sent to ${email}`);
    });

    it('should throw a BadRequestException if sending email fails', async () => {
      const sendMailMock = jest.fn().mockRejectedValueOnce(new Error('Failed to send email'));

      const transporterMock = {
        sendMail: sendMailMock,
      };

      jest.spyOn(nodemailer, 'createTransport').mockReturnValueOnce(transporterMock as any);

      const type = 'TestType';
      const email = 'test@example.com';
      const content = 'Test Content';

      await expect(emailService.sendCustomEmail(type, email, content)).rejects.toThrowError(
        BadRequestException,
      );

      expect(loggerMock.error).toHaveBeenCalled();
    });
  });
});
