import { AppDataSource, initializeDatabase } from '../database/data-source';

async function main() {
    try {
        await initializeDatabase();
        console.log('Adding reset_password_token and reset_password_expires to accounts table...');
        await AppDataSource.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255)`);
        await AppDataSource.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP`);
        console.log('Columns added successfully.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
