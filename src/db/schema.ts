import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// USERS
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  avatarUrl: text('avatar_url'),
  // role: text('role').notNull(), // host / editor / guest
});

// SHOWS - Owned by a user (host)
export const shows = pgTable('shows', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// EPISODES
export const episodes = pgTable('episodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  showId: uuid('show_id').notNull().references(() => shows.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull(), // recording / processing / ready / published
  finalUrl: text('final_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// SESSIONS - Represent live recording sessions per episode
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  episodeId: uuid('episode_id').notNull().references(() => episodes.id, { onDelete: 'cascade' }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  active: boolean('active').default(true),
});

// SESSION PARTICIPANTS
export const sessionParticipants = pgTable('session_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  // role: text('role').notNull(), // host / guest / editor
  joinedAt: timestamp('joined_at').notNull(),
  leftAt: timestamp('left_at'),
});

// RECORDINGS - Local recording by a user in a session
export const recordings = pgTable('recordings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  participantId: uuid('participant_id').notNull().references(() => sessionParticipants.id),
  type: text('type').notNull(), // audio / video / screen
  fileUrl: text('file_url'),
  isUploaded: boolean('is_uploaded').default(false),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
});

// RECORDING CHUNKS
export const recordingChunks = pgTable('recording_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  recordingId: uuid('recording_id').notNull().references(() => recordings.id, { onDelete: 'cascade' }),
  chunkIndex: integer('chunk_index').notNull(),
  chunkUrl: text('chunk_url').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// PUBLISH STATUS
export const publishStatus = pgTable('publish_status', {
  id: uuid('id').primaryKey().defaultRandom(),
  episodeId: uuid('episode_id').notNull().references(() => episodes.id),
  platform: text('platform').notNull(), // spotify / youtube / apple
  status: text('status').notNull(),     // scheduled / published / failed
  scheduledFor: timestamp('scheduled_for'),
  publishedAt: timestamp('published_at'),
  platformUrl: text('platform_url'),
});