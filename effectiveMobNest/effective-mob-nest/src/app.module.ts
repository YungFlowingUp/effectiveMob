import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin',
            database: 'effectiveMobNest',
            entities: [User],
            synchronize: true,
            autoLoadEntities: true,
        }), TypeOrmModule.forFeature([User]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
