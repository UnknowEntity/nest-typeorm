import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: 'temp',
      host: 'localhost',
      username: 'admin',
      password: 'admin',
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
