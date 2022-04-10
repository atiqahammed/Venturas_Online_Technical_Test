import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManagerService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addToCache(key: string, item: string, time: number) {
    let duplicate: string = await this.cacheManager.get(key);
    if(duplicate != null) {
      return false;
    }
    const value = await this.cacheManager.set(key, item, { ttl: time });
    if(value != null) {
      let entryCounter: number = await this.cacheManager.get('Counter');
      if(entryCounter == null || entryCounter == 0) {
        await this.cacheManager.set('Counter', 1);
      } else {
        entryCounter++;
        await this.cacheManager.set('Counter', entryCounter);
      }
    }
    return value;
  }

  async getFromCache(key: string) {
    const value = await this.cacheManager.get(key);
    if(value == null) {
      return 0;
    }
    return value;
  }

  async delFromCache(key: string) {
    let checkIfExist: string = await this.cacheManager.get(key);
    if(checkIfExist != null) {
      let entryCounter: number = await this.cacheManager.get('Counter');
      if(entryCounter == null) {
        await this.cacheManager.set('Counter', 0);
        await this.cacheManager.del(key);
      } else if(entryCounter > 0) {
        entryCounter--;
        await this.cacheManager.set('Counter', entryCounter);
        await this.cacheManager.del(key);
      }
    } else {
      return false;
    }
  }
}
