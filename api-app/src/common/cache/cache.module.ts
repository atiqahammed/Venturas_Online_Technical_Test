import { Module, CacheModule } from '@nestjs/common';
import { CacheManagerService } from './cache.service';

@Module({
  imports: [CacheModule.register({
    isGlobal: true,
  })],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CommonCacheModule { }
