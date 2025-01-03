import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { logSchema } from 'src/models/log.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Log', schema: logSchema },
        ]),
    ],
    exports: [
        MongooseModule.forFeature([
            { name: 'Log', schema: logSchema },
        ]),
    ],
})
export class LogModule { }
