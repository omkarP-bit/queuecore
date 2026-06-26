import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import 'dotenv/config';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for seeding
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Interface for scraped Hospital Data
 */
interface ScrapedHospital {
  name: string;
  city: string;
  specialty_tags: string[];
}

/**
 * Interface for scraped Doctor Data
 */
interface ScrapedDoctor {
  name: string;
  specialty: string;
  avg_consult_minutes: number;
}

/**
 * Main Scraper Class utilizing Puppeteer
 */
class HealthDataScraper {
  /**
   * Scrape a listing of hospitals from Wikipedia (Reliable, no CAPTCHA)
   */
  async scrapeHospitals(url: string): Promise<ScrapedHospital[]> {
    console.log(`Launching Puppeteer to scrape hospitals from: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Extract data inside the browser context specifically for Wikipedia's structure
      const hospitals: ScrapedHospital[] = await page.evaluate(() => {
        const results: ScrapedHospital[] = [];
        
        // Find list items in the main content area
        const listItems = document.querySelectorAll('#mw-content-text ul li');
        
        listItems.forEach(li => {
          const text = li.textContent?.trim() || '';
          
          // Basic heuristic to identify hospital entries on the Wiki page
          if (text.toLowerCase().includes('hospital') || text.toLowerCase().includes('clinic') || text.toLowerCase().includes('care')) {
             // Often formatted like "Aditya Birla Memorial Hospital, Chinchwad"
             const parts = text.split(',');
             let name = parts[0].trim();
             
             // Remove any wikipedia citation brackets like [1]
             name = name.replace(/\[\d+\]/g, '').trim();

             // Avoid super long descriptions
             if (name.length > 5 && name.length < 50) {
                 results.push({ 
                    name, 
                    city: 'Pune', 
                    specialty_tags: ['General', 'Emergency', 'ICU'] // Default tags for major hospitals
                 });
             }
          }
        });
        
        // Deduplicate
        const uniqueNames = new Set<string>();
        const uniqueResults = results.filter(h => {
           if (uniqueNames.has(h.name)) return false;
           uniqueNames.add(h.name);
           return true;
        });

        return uniqueResults;
      });

      return hospitals;
    } catch (error) {
      console.error('Error scraping hospitals:', error);
      return [];
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate doctors for a given hospital (since Wikipedia doesn't list individual doctors)
   * This simulates fetching real doctor data for the scraped hospitals.
   */
  async generateDoctorsForHospital(): Promise<ScrapedDoctor[]> {
    // A list of common Indian names and specialties for realistic mock data
    const firstNames = ['Amit', 'Priya', 'Ravi', 'Sneha', 'Rahul', 'Anjali', 'Vikram', 'Pooja', 'Suresh', 'Kavita'];
    const lastNames = ['Sharma', 'Patil', 'Deshmukh', 'Joshi', 'Kulkarni', 'Deshpande', 'Kale', 'Gaikwad'];
    const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Physician', 'Gynecology'];

    const doctors: ScrapedDoctor[] = [];
    
    // Generate 2 to 5 doctors per hospital
    const numDoctors = Math.floor(Math.random() * 4) + 2; 

    for (let i = 0; i < numDoctors; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const sp = specialties[Math.floor(Math.random() * specialties.length)];
        
        doctors.push({
            name: `Dr. ${fn} ${ln}`,
            specialty: sp,
            avg_consult_minutes: Math.floor(Math.random() * 20) + 10, // 10-30 mins
        });
    }

    return doctors;
  }

  /**
   * Insert scraped data into Supabase
   */
  async seedDatabase(hospitalsData: ScrapedHospital[]) {
    console.log('Seeding database with scraped data...');
    let totalHospitals = 0;
    let totalDoctors = 0;

    for (const hosp of hospitalsData) {
      const hospId = crypto.randomUUID();
      
      const { error: hospError } = await supabase.from('hospitals').insert([{
        id: hospId,
        name: hosp.name,
        city: hosp.city,
        specialty_tags: hosp.specialty_tags,
      }]);

      if (hospError) {
        console.error(`Error inserting hospital ${hosp.name}:`, hospError);
        continue;
      }
      totalHospitals++;
      console.log(`Inserted hospital: ${hosp.name}`);

      // Generate and Insert doctors for this hospital
      const docs = await this.generateDoctorsForHospital();
      for (const doc of docs) {
        const docId = crypto.randomUUID();
        const { error: docError } = await supabase.from('doctors').insert([{
          id: docId,
          hospital_id: hospId,
          name: doc.name,
          specialty: doc.specialty,
          avg_consult_minutes: doc.avg_consult_minutes,
          lag_rolling: 0,
        }]);

        if (docError) {
          console.error(`Error inserting doctor ${doc.name}:`, docError);
        } else {
          totalDoctors++;
        }
      }
    }
    console.log(`\n✅ Seeding complete! Successfully inserted ${totalHospitals} hospitals and ${totalDoctors} doctors.`);
  }
}

// ============================================================================
// Run Scraper
// ============================================================================
async function runScraper() {
  const scraper = new HealthDataScraper();
  
  // Real target URL: Wikipedia's list of hospitals in Pune
  const targetHospitalUrl = 'https://en.wikipedia.org/wiki/List_of_Hospitals_in_Pune'; 

  console.log(`Starting scrape of ${targetHospitalUrl}...`);
  const hospitals = await scraper.scrapeHospitals(targetHospitalUrl);
  
  if (hospitals.length === 0) {
      console.log("No hospitals found. Check internet connection or Wikipedia page structure.");
      return;
  }

  console.log(`Found ${hospitals.length} hospitals. Beginning database seeding...`);
  await scraper.seedDatabase(hospitals);
}

// Execute the scraper if this file is run directly
if (require.main === module) {
  runScraper().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
