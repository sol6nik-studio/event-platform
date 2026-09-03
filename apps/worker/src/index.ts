import { Queue, Worker, type Job } from 'bullmq';
import IORedis from 'ioredis';
import { readWorkerEnvironment } from '@arena-grid/config';

const environment = readWorkerEnvironment();
const connection = new IORedis(environment.REDIS_URL, {
  maxRetriesPerRequest: null,
});
const queueName = 'arena-grid-lifecycle';

export const lifecycleQueue = new Queue(queueName, {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1_000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
export const lifecycleWorker = new Worker(
  queueName,
  // eslint-disable-next-line @typescript-eslint/require-await
  async (job: Job<{ tournamentId?: string }>) => {
    switch (job.name) {
      case 'close-registration':
      case 'open-check-in':
      case 'check-unconfirmed-results':
      case 'send-notification':
      case 'sync-game-provider':
        console.info(
          JSON.stringify({
            event: 'job.processed',
            jobId: job.id,
            jobName: job.name,
            tournamentId: job.data.tournamentId,
          }),
        );
        return { ok: true, processedAt: new Date().toISOString() };
      default:
        throw new Error(`Unknown lifecycle job: ${job.name}`);
    }
  },
  { connection, concurrency: 10 },
);

lifecycleWorker.on('failed', (job, error) => {
  console.error(JSON.stringify({ event: 'job.failed', jobId: job?.id, error: error.message }));
});
if (environment.NODE_ENV !== 'test')
  console.info(JSON.stringify({ event: 'worker.ready', queue: queueName }));
