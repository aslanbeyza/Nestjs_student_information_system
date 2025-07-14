import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teacher/teachers.module';
import { StudentsModule } from './student/students.module';
import { CoursesModule } from './course/courses.module';
import { StudentCourseModule } from './studentCourse/StudentCourse.module';
import { GradeModule } from './Grade/grade.module';
import { AttendanceModule } from './Attendance/attendance.module';
import { ClassModule } from './class/class.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 dakika (60 saniye)
        limit: 10, // 1 dakikada maksimum 10 istek
        name: 'short',
      },
      {
        ttl: 300000, // 5 dakika (300 saniye)
        limit: 50, // 5 dakikada maksimum 50 istek
        name: 'medium',
      },
    ]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('database.host')}:${configService.get<string>('database.port')}/${configService.get<string>('database.name')}`,
      }),
    }),
    UsersModule,
    AuthModule,
    TeachersModule,
    StudentsModule,
    CoursesModule,
    StudentCourseModule,
    GradeModule,
    AttendanceModule,
    ClassModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
