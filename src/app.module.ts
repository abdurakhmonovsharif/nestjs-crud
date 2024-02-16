import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
const DB_URL= 'mongodb+srv://fullstackdeveloper4413:yv4UCb8yhWtrbOFp@mydb.svis6ii.mongodb.net/g49?retryWrites=true&w=majority'
@Module({
  imports: [
    MongooseModule.forRoot(
     DB_URL,
    ),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
