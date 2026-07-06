import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface ScrapedHospital {
  name: string;
  city: string;
  specialty_tags: string[];
}

interface ScrapedDoctor {
  name: string;
  specialty: string;
  avg_consult_minutes: number;
}

const FALLBACK_HOSPITALS: ScrapedHospital[] = [
  { name: 'Apollo Clinic - Kalyani Nagar', city: 'Pune', specialty_tags: ['Cardiology', 'General', 'Orthopedics'] },
  { name: 'Manipal Hospital - Baner', city: 'Pune', specialty_tags: ['Cardiology', 'Neurology', 'Pediatrics'] },
  { name: 'Jehangir Hospital - Camp', city: 'Pune', specialty_tags: ['General', 'Cardiology', 'Pulmonology'] },
  { name: 'KEM Hospital - Rasta Peth', city: 'Pune', specialty_tags: ['General', 'Cardiology', 'Pediatrics'] },
  { name: 'Ruby Hall Clinic - Wanowrie', city: 'Pune', specialty_tags: ['Cardiology', 'Neurology', 'General'] },
  { name: 'Noble Hospital - Hadapsar', city: 'Pune', specialty_tags: ['General', 'Orthopedics', 'Dermatology'] },
  { name: 'Sahyadri Hospital - Karvenagar', city: 'Pune', specialty_tags: ['Cardiology', 'General', 'Neurology'] },
  { name: 'Deenanath Mangeshkar Hospital - Erandwane', city: 'Pune', specialty_tags: ['Cardiology', 'General', 'Orthopedics', 'Pediatrics'] },
  { name: 'Sancheti Hospital - Shivajinagar', city: 'Pune', specialty_tags: ['Orthopedics', 'General'] },
  { name: 'Aditya Birla Hospital - Pimpri', city: 'Pune', specialty_tags: ['Cardiology', 'General', 'Neurology'] },
  { name: 'City Hospital - FC Road', city: 'Pune', specialty_tags: ['General', 'Cardiology', 'Dermatology'] },
  { name: 'Fortis Hospital - Viman Nagar', city: 'Pune', specialty_tags: ['Cardiology', 'General', 'Neurology'] },
];

const FALLBACK_DOCTORS: Record<string, ScrapedDoctor[]> = {
  'Apollo Clinic - Kalyani Nagar': [
    { name: 'Dr. Sanjay Verma', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Priya Mehta', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Amit Khanna', specialty: 'Orthopedics', avg_consult_minutes: 20 },
  ],
  'Manipal Hospital - Baner': [
    { name: 'Dr. Rohan Deshpande', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Sneha Patil', specialty: 'Pediatrics', avg_consult_minutes: 12 },
    { name: 'Dr. Vikram Joshi', specialty: 'Neurology', avg_consult_minutes: 25 },
  ],
  'Jehangir Hospital - Camp': [
    { name: 'Dr. Anita Kulkarni', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Prakash Rao', specialty: 'Pulmonology', avg_consult_minutes: 18 },
    { name: 'Dr. Meera Joshi', specialty: 'Gastroenterology', avg_consult_minutes: 20 },
  ],
  'KEM Hospital - Rasta Peth': [
    { name: 'Dr. Shailesh Datar', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Nisha Agarwal', specialty: 'Pediatrics', avg_consult_minutes: 12 },
  ],
  'Ruby Hall Clinic - Wanowrie': [
    { name: 'Dr. Arjun Nair', specialty: 'Cardiology', avg_consult_minutes: 18 },
    { name: 'Dr. Deepa Shah', specialty: 'Neurology', avg_consult_minutes: 22 },
  ],
  'Noble Hospital - Hadapsar': [
    { name: 'Dr. Rajesh Patwardhan', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Kavita Deshmukh', specialty: 'Dermatology', avg_consult_minutes: 15 },
    { name: 'Dr. Sameer Khan', specialty: 'ENT', avg_consult_minutes: 12 },
  ],
  'Sahyadri Hospital - Karvenagar': [
    { name: 'Dr. Aditya Thakur', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Pallavi Kulkarni', specialty: 'General Physician', avg_consult_minutes: 10 },
  ],
  'Deenanath Mangeshkar Hospital - Erandwane': [
    { name: 'Dr. Mohan Tendulkar', specialty: 'Cardiology', avg_consult_minutes: 18 },
    { name: 'Dr. Sunita Desai', specialty: 'Pediatrics', avg_consult_minutes: 12 },
    { name: 'Dr. Ravi Bapat', specialty: 'Orthopedics', avg_consult_minutes: 20 },
    { name: 'Dr. Anjali Dixit', specialty: 'Pulmonology', avg_consult_minutes: 16 },
  ],
  'Sancheti Hospital - Shivajinagar': [
    { name: 'Dr. Kiran Sancheti', specialty: 'Orthopedics', avg_consult_minutes: 20 },
    { name: 'Dr. Reshma Iyer', specialty: 'Physical Therapy', avg_consult_minutes: 25 },
  ],
  'Aditya Birla Hospital - Pimpri': [
    { name: 'Dr. Suresh Bhosale', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Neha Sharma', specialty: 'Pediatrics', avg_consult_minutes: 12 },
  ],
  'City Hospital - FC Road': [
    { name: 'Dr. Priya Sharma', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Rakesh Jain', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Tina Bagwe', specialty: 'Dermatology', avg_consult_minutes: 15 },
  ],
  'Fortis Hospital - Viman Nagar': [
    { name: 'Dr. Manoj Agarwal', specialty: 'Cardiology', avg_consult_minutes: 18 },
    { name: 'Dr. Shweta Mishra', specialty: 'Neurology', avg_consult_minutes: 22 },
  ],
};

class ProductionHealthScraper {
  async scrapeHospitals(url: string): Promise<ScrapedHospital[]> {
    console.log(`[HOSPITALS] Attempting to scrape: ${url}`);

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      await page.waitForTimeout(3000);

      const hospitals: ScrapedHospital[] = await page.evaluate(() => {
        const results: ScrapedHospital[] = [];

        // Try multiple selector patterns used by Practo
        const selectors = [
          '.c-Card',
          '.listing-hospital-card',
          '[data-test-id="hospital-card"]',
          '.c-card-hospital',
          '.u-border--light',
          'div[class*="card"][class*="hospital"]',
        ];

        let cards: NodeListOf<Element> | null = null;
        for (const sel of selectors) {
          const found = document.querySelectorAll(sel);
          if (found.length > 0) {
            cards = found;
            break;
          }
        }

        if (!cards || cards.length === 0) return results;

        cards.forEach((card) => {
          // Try various name selectors
          const nameSelectors = [
            '.c-card-hospital__title',
            'h2',
            'h3',
            '[data-test-id="hospital-name"]',
            '.hospital-name',
          ];
          let name = '';
          for (const sel of nameSelectors) {
            const el = card.querySelector(sel);
            if (el?.textContent?.trim()) {
              name = el.textContent.trim();
              break;
            }
          }

          const city = 'Pune';

          const tags: string[] = [];
          const tagSelectors = ['.c-card-hospital__tag', '.specialty-tag', '[data-test-id="specialty"]', 'span[class*="tag"]'];
          for (const sel of tagSelectors) {
            card.querySelectorAll(sel).forEach((tag) => {
              if (tag.textContent?.trim()) tags.push(tag.textContent.trim());
            });
          }

          if (name && name.length > 0 && name.length < 100) {
            results.push({ name, city, specialty_tags: tags.length > 0 ? [...new Set(tags)] : ['General'] });
          }
        });

        return results;
      });

      return hospitals;
    } catch (error) {
      console.error(`[HOSPITALS] Scrape failed:`, (error as Error).message);
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }

  async scrapeDoctorsForHospital(hospitalUrl: string): Promise<ScrapedDoctor[]> {
    console.log(`[DOCTORS] Attempting to scrape: ${hospitalUrl}`);

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.goto(hospitalUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForTimeout(2000);

      const doctors: ScrapedDoctor[] = await page.evaluate(() => {
        const results: ScrapedDoctor[] = [];

        const selectors = [
          '.doctor-profile-card',
          '.c-card-doctor',
          '[data-test-id="doctor-card"]',
          'div[class*="doctor"][class*="card"]',
        ];

        let cards: NodeListOf<Element> | null = null;
        for (const sel of selectors) {
          const found = document.querySelectorAll(sel);
          if (found.length > 0) {
            cards = found;
            break;
          }
        }

        if (!cards || cards.length === 0) return results;

        cards.forEach((card) => {
          const nameSelectors = ['.doctor-name', '.c-card-doctor__name', 'h3', 'h4', '[data-test-id="doctor-name"]'];
          let name = '';
          for (const sel of nameSelectors) {
            const el = card.querySelector(sel);
            if (el?.textContent?.trim()) {
              name = el.textContent.trim();
              break;
            }
          }

          const specSelectors = ['.doctor-specialty', '.c-card-doctor__specialty', '[data-test-id="specialty"]', 'p'];
          let specialty = '';
          for (const sel of specSelectors) {
            const el = card.querySelector(sel);
            if (el?.textContent?.trim()) {
              specialty = el.textContent.trim();
              break;
            }
          }

          const timeSelectors = ['.avg-consult-time', '.c-card-doctor__time', '[data-test-id="consult-time"]'];
          let avgMinutes = 15;
          for (const sel of timeSelectors) {
            const el = card.querySelector(sel);
            if (el?.textContent) {
              const parsed = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
              if (!isNaN(parsed) && parsed > 0) avgMinutes = parsed;
            }
          }

          if (name && name.length > 0 && name.length < 80) {
            results.push({
              name,
              specialty: specialty || 'General Physician',
              avg_consult_minutes: avgMinutes,
            });
          }
        });

        return results;
      });

      return doctors;
    } catch (error) {
      console.error(`[DOCTORS] Scrape failed:`, (error as Error).message);
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }

  async seedDatabase(hospitalsData: ScrapedHospital[], doctorsMap: Record<string, ScrapedDoctor[]>) {
    console.log('\nSeeding database...');
    let totalHospitals = 0;
    let totalDoctors = 0;

    for (const hosp of hospitalsData) {
      const hospId = crypto.randomUUID();

      const { error: hospError } = await supabase.from('hospitals').insert([
        {
          id: hospId,
          name: hosp.name,
          city: hosp.city,
          specialty_tags: hosp.specialty_tags,
        },
      ]);

      if (hospError) {
        console.error(`  ✗ ${hosp.name}: ${hospError.message}`);
        continue;
      }
      totalHospitals++;
      console.log(`  ✓ ${hosp.name}`);

      const realDoctors = doctorsMap[hosp.name] || [];
      for (const doc of realDoctors) {
        const docId = crypto.randomUUID();
          const { error: docError } = await supabase.from('doctors').insert([
            {
              id: docId,
              hospital_id: hospId,
              name: doc.name,
              specialty: doc.specialty,
              avg_consult_minutes: doc.avg_consult_minutes,
              lag_rolling: 0,
              availability_status: 'available',
            },
        ]);

        if (docError) {
          console.error(`    ✗ ${doc.name}: ${docError.message}`);
        } else {
          totalDoctors++;
        }
      }
    }
    console.log(`\n✅ Done: ${totalHospitals} hospitals, ${totalDoctors} doctors.`);
  }
}

async function runScraper() {
  const scraper = new ProductionHealthScraper();

  // Try scraping Practo first (may fail due to anti-scraping)
  const targetUrl = 'https://www.practo.com/pune/hospitals';
  console.log(`Attempting to scrape: ${targetUrl}`);
  const scraped = await scraper.scrapeHospitals(targetUrl);

  if (scraped.length > 0) {
    console.log(`\nScraped ${scraped.length} hospitals successfully.`);

    const doctorsMap: Record<string, ScrapedDoctor[]> = {};
    for (const hosp of scraped) {
      const docs = await scraper.scrapeDoctorsForHospital(`${targetUrl}/${hosp.name.toLowerCase().replace(/\s+/g, '-')}`);
      if (docs.length > 0) doctorsMap[hosp.name] = docs;
    }

    await scraper.seedDatabase(scraped, doctorsMap);
  } else {
    // Fallback to comprehensive seed data
    console.log('\nScraping failed or returned no results. Falling back to curated Pune hospital data...');
    await scraper.seedDatabase(FALLBACK_HOSPITALS, FALLBACK_DOCTORS);
  }
}

if (require.main === module) {
  runScraper().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
