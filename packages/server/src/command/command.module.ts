import { Module } from '@nestjs/common';

import { DatabaseCommandModule } from 'src/database/commands/database-command.module';
import { AppModule } from 'src/app.module';

@Module({
  imports: [AppModule, DatabaseCommandModule],
})

export class CommandModule {}
