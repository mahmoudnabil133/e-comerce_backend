import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongodbModule } from './config/mongodb.module';
import { HttpModule } from '@nestjs/axios';
import { AuthApiService } from './api-services/auth-api/auth-api.service';
import { CheckHeaderMiddleware } from './core/platform-key-middleware/check-header.middleware';
import { JwtStrategy } from './core/jwt-auth-guard/jwt.strategy';
import { RabbitMqConfigModule } from './config/rabbitmq-config.module';
import { RequestsLoggerMiddleware } from './core/requests-logger/requests-logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './core/requests-logger/requests-logger.interceptor';
import { AddXClientServiceNameInterceptor } from './core/add-xclient-service-name/add-xclient-service-name.interceptor';
import { MyHttpService } from "./core/my-http-client-service/my-http.service";
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/product.model';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './models/user.model';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    MongodbModule,
    HttpModule,
    RabbitMqConfigModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: 'zsc1911',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController, ProductController, AuthController, UserController],
  providers: [
    AppService,
    AuthApiService,
    JwtStrategy,
    MyHttpService,
    ProductService,
    AuthService,
    UserService,
  ],
})
export class AppModule {} //implements NestModule {
  // MiddlewareConsumer is used to configure the middleware vvv
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(
  //       CheckHeaderMiddleware,
  //       RequestsLoggerMiddleware,
  //       /* , otherMiddleWare */
  //     )
  //     .forRoutes(
  //       { path: '*', method: RequestMethod.ALL } /* OR AppController */,
  //     );
  //   /*  // to implement other middleware:
  //    consumer
  //         .apply(NewMiddleware)
  //         .forRoutes({ path: 'demo', method: RequestMethod.GET });*/
  // }
// }
