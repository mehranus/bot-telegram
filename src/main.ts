import { NestFactory } from '@nestjs/core';
import { BotModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);
  require('dotenv').config()
  const PORT=process.env.PORT
  console.log(PORT)
  await app.listen(PORT,()=>{
    console.log("RUN BOOT",PORT)
  });
  
}
bootstrap();
