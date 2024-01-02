import { Pool } from 'pg';

const pool = new Pool({
  user: 'hackathoncheck_largestcut',
  host: 'gpz.h.filess.io',
  database: 'hackathoncheck_largestcut',
  password: 'facbfeee988d152ed95a43154587f13d2df03579',
  port: 5432,
});

async function querying(query:string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
        `SET SEARCH_PATH TO blockchain;
        ${query}`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    client.release();
  }
}

export default querying;

