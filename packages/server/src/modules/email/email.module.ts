import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { DomainManagerModule } from 'src/modules/domain-manager/domain-manager.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_SMTP_HOST'),
          port: config.get('EMAIL_SMTP_PORT'),
          secure: true,
          auth: {
            user: config.get('EMAIL_SMTP_USERNAME'),
            pass: config.get('EMAIL_SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"YaariAPI" <${config.get('EMAIL_SMTP_USERNAME')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
    DomainManagerModule,
  ],
  providers: [EmailService, DomainManagerModule],
  exports: [EmailService],
})
export class EmailModule {}