import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './modules/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { NotificationModule } from './modules/notification/notification.module'
import { PlanModule } from './modules/plan/plan.module'


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.e6rlg4q.mongodb.net/${process.env.DB_DATABASE}`),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    UserModule,
    AuthModule,
    NotificationModule,
    PlanModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
