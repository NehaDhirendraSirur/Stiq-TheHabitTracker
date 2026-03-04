-- Database: habit_tracker

-- DROP DATABASE IF EXISTS habit_tracker;

CREATE DATABASE habit_tracker
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


Select * from users;

Select * from habits;

Select * from habit_streak;

Select * from habit;


DROP TABLE IF EXISTS day_completed_habits CASCADE;
DROP TABLE IF EXISTS day_failed_habits CASCADE;
DROP TABLE IF EXISTS daily_entry CASCADE;
DROP TABLE IF EXISTS day_summary CASCADE;
DROP TABLE IF EXISTS habit_streak CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS habit CASCADE;
DROP TABLE IF EXISTS streak_freeze_ledger CASCADE;
DROP TABLE IF EXISTS streak_freeze_wallet CASCADE;
DROP TABLE IF EXISTS streak_state CASCADE;
DROP TABLE IF EXISTS growth_state CASCADE;
DROP TABLE IF EXISTS points_ledger CASCADE;
DROP TABLE IF EXISTS users CASCADE;