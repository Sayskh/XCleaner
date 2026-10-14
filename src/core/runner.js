import { scanUserTweets, deletePost } from './tasks/tweets.js';
import { scanUserLikes, unlikePost } from './tasks/likes.js';
import { sleep } from './utils.js';

export class CleanerRunner {
  constructor(client, ids, options, callbacks = {}) {
    this.client = client;
    this.ids = ids;
    this.options = options;
    this.callbacks = callbacks;
    this.state = 'idle';
    this.counters = {
      scanned: 0,
      deletedPosts: 0,
      unretweeted: 0,
      unliked: 0,
      skipped: 0
    };
  }

  log(level, message) {
    this.callbacks.onLog?.(level, message);
  }

  reportProgress() {
    this.callbacks.onProgress?.({
      state: this.state,
      counters: { ...this.counters }
    });
  }

  pause() {
    if (this.state === 'running') {
      this.state = 'paused';
      this.log('info', 'Process paused by user.');
      this.reportProgress();
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.state = 'running';
      this.log('info', 'Process resumed.');
      this.reportProgress();
    }
  }

  stop() {
    this.state = 'stopped';
    this.log('info', 'Process stopped by user.');
    this.reportProgress();
  }

  async run() {
    this.state = 'running';
    this.reportProgress();
    this.log('info', 'Starting XCleaner run...');

    try {
      if (this.options.deletePosts || this.options.unretweet) {
        for await (const item of scanUserTweets(this.client, this.ids, this.options, (lvl, msg) => this.log(lvl, msg))) {
          while (this.state === 'paused') await sleep(500);
          if (this.state === 'stopped') break;

          this.counters.scanned++;

          if (item.isRetweet && !this.options.unretweet) {
            this.counters.skipped++;
            this.reportProgress();
            continue;
          }
          if (!item.isRetweet && !this.options.deletePosts) {
            this.counters.skipped++;
            this.reportProgress();
            continue;
          }

          await deletePost(this.client, this.ids, item, (lvl, msg) => this.log(lvl, msg));

          if (item.isRetweet) {
            this.counters.unretweeted++;
          } else {
            this.counters.deletedPosts++;
          }

          this.reportProgress();
          await sleep(1000 + Math.random() * 800);
        }
      }

      if (this.state !== 'stopped' && this.options.unlike) {
        for await (const item of scanUserLikes(this.client, this.ids, this.options, (lvl, msg) => this.log(lvl, msg))) {
          while (this.state === 'paused') await sleep(500);
          if (this.state === 'stopped') break;

          this.counters.scanned++;
          await unlikePost(this.client, this.ids, item, (lvl, msg) => this.log(lvl, msg));
          this.counters.unliked++;
          this.reportProgress();
          await sleep(1000 + Math.random() * 800);
        }
      }

      if (this.state !== 'stopped') {
        this.state = 'done';
        this.log('info', 'Finished successfully. All selected items processed.');
      }
    } catch (err) {
      this.state = 'error';
      this.log('error', `Run aborted due to error: ${err.message}`);
      this.callbacks.onError?.(err);
    } finally {
      this.reportProgress();
    }
  }
}
