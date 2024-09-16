import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { SocioEntity } from './socio/socio.entity/socio.entity';
import { ClubEntity } from './club/club.entity/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SociosClubsService } from './socios-clubs/socios-clubs.service';
import { SociosClubsModule } from './socios-clubs/socios-clubs.module';
import { SocioService } from './socio/socio.service';

@Module({
  imports: [SocioModule, ClubModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'club',
      entities: [SocioEntity, ClubEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    SociosClubsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
