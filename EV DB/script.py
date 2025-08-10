import scrapy
import json
import asyncio
import nodriver as uc
from scrapy.http import HtmlResponse
import time


class CarSpecsSpider(scrapy.Spider):
    name = 'ultimatespecs_nodriver'
    
    def __init__(self):
        """
        Initialize the spider with basic configuration
        """
        self.specs_data = []  # List to store all scraped specs
        super().__init__()
    
    def start_requests(self):
        """
        Step 1: Define the URLs to scrape
        You can add multiple URLs here
        """
        urls = [
            "https://www.ultimatespecs.com/car-specs/Acura/124155/Acura-ILX-2013-Hybrid.html",
            "https://www.ultimatespecs.com/car-specs/Suzuki/131120/Suzuki-Vitara-2019-15-Hybrid.html",
            "https://www.ultimatespecs.com/car-specs/Suzuki/131122/Suzuki-Vitara-2019-15-Hybrid-Allgrip.html",
            "https://www.ultimatespecs.com/car-specs/Toyota/69821/Toyota-Auris-Touring-Sports-Hybrid-Feel!.html",
            "https://www.ultimatespecs.com/car-specs/Toyota/69647/Toyota-Yaris-3-2014-5d-Hybrid-Active.html",
            "https://www.ultimatespecs.com/car-specs/Toyota/70929/Toyota-Prius+-18-HSD-Advance.html",
            # Add more URLs here as needed
        ]
        
        for url in urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse_with_nodriver,
                meta={'url': url, 'dont_cache': True}
            )
    
    def parse_with_nodriver(self, response):
        """
        Step 2: Use nodriver to handle the page and potential captcha
        This method handles the async operation properly within Scrapy
        """
        url = response.meta['url']
        
        # Get the current event loop (Scrapy's loop)
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            # If no loop is running, create a new one
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        # Create a task to run our async function
        task = loop.create_task(self.get_page_content(url))
        
        # We need to yield a deferred that will be resolved when the task completes
        from twisted.internet import defer
        from twisted.internet.threads import deferToThread
        
        def run_async_task():
            """
            Run the async task in a thread to avoid blocking Scrapy
            """
            # Create a new event loop for this thread
            new_loop = asyncio.new_event_loop()
            asyncio.set_event_loop(new_loop)
            try:
                return new_loop.run_until_complete(self.get_page_content(url))
            finally:
                new_loop.close()
        
        # Use deferToThread to run our async operation
        d = deferToThread(run_async_task)
        d.addCallback(self._handle_page_content, url)
        d.addErrback(self._handle_error, url)
        
        return d
    
    def _handle_page_content(self, html_content, url):
        """
        Step 3: Handle the HTML content returned from nodriver
        """
        if html_content:
            print("✅ HTML content received successfully")
            
            # Create a new HtmlResponse object with the content from nodriver
            new_response = HtmlResponse(
                url=url,
                body=html_content.encode('utf-8'),
                encoding='utf-8'
            )
            
            # Parse the specs and return the results
            return self.parse_specs(new_response)
        else:
            print("❌ No HTML content received")
            return []
    
    def _handle_error(self, failure, url):
        """
        Step 4: Handle any errors that occur during page loading
        """
        print(f"❌ Error processing {url}: {failure.value}")
        return []
    
    async def get_page_content(self, url):
        """
        Step 5: Async method to handle page loading with captcha bypass
        Returns the HTML content after ensuring specs are loaded
        """
        browser = None
        try:
            print(f"🚀 Starting browser for URL: {url}")
            
            # Step 5a: Start browser and load page
            browser = await uc.start(headless=False)
            page = await browser.get(url)
            print("📄 Page loaded. Starting spec detection process...")
            
            # Step 5b: Wait 2 seconds for initial page load
            print("⏳ Step 1: Waiting 2 seconds for page to load...")
            await asyncio.sleep(2)
            
            # Step 5c: Check if specs are already loaded
            print("🔍 Step 2: Checking if specs are already loaded...")
            specs_loaded = await self.check_specs_loaded(page)
            
            if specs_loaded:
                print("✅ Specs already loaded! Proceeding to scrape...")
            else:
                print("❌ Specs not loaded. Applying captcha bypass logic...")
                
                # Step 5d: Wait 7 seconds then apply captcha bypass
                print("⏳ Waiting 7 seconds before captcha bypass...")
                await asyncio.sleep(7)
                
                # Step 5e: Apply captcha bypass logic from your test.py
                await self.bypass_captcha(page)
                
                # Step 5f: Wait for specs to load after captcha bypass
                print("⏳ Waiting for specs to load after captcha bypass...")
                await asyncio.sleep(5)
                
                # Step 5g: Final check for specs
                try:
                    await page.wait_for('div.ficha_specs_left', timeout=30)
                    print("✅ Specs successfully loaded after captcha bypass!")
                except Exception as e:
                    print(f"⚠️  Warning: Could not confirm specs loaded: {e}")
            
            # Step 5h: Get the final HTML content
            html_content = await page.get_content()
            print("📥 HTML content retrieved successfully")
            return html_content
            
        except Exception as e:
            print(f"❌ Error in get_page_content: {e}")
            return None
        finally:
            # Step 5i: Clean up browser
            if browser:
                print("🔒 Closing browser...")
                try:
                    await asyncio.sleep(2)
                    await browser.quit()
                except Exception as e:
                    print(f"⚠️  Warning during browser cleanup: {e}")
    
    async def check_specs_loaded(self, page):
        """
        Step 6: Check if the specs divs are present on the page
        Returns True if specs are loaded, False otherwise
        """
        try:
            # Look for both left and right spec containers
            left_specs = await page.find('div.ficha_specs_left', timeout=3)
            right_specs = await page.find('div.ficha_specs_right', timeout=3)
            
            if left_specs and right_specs:
                print("✅ Both spec containers found!")
                return True
            else:
                print("❌ Spec containers not found")
                return False
                
        except Exception as e:
            print(f"❌ Error checking specs: {e}")
            return False
    
    async def bypass_captcha(self, page):
        """
        Step 7: Apply the captcha bypass logic from your test.py
        """
        try:
            print("🔐 Looking for captcha button...")
            
            # Look for the Continue button (captcha bypass)
            continue_button = await page.find('button[name="captcha"]', timeout=15)
            
            if continue_button:
                print("🎯 Captcha button found! Clicking...")
                await continue_button.click()
                print("✅ Captcha button clicked successfully")
                
                # Wait a bit after clicking
                await asyncio.sleep(3)
            else:
                print("ℹ️  No captcha button found - may not be needed")
                
        except Exception as e:
            print(f"⚠️  Captcha bypass issue (continuing anyway): {e}")
    
    def parse_specs(self, response):
        """
        Step 8: Parse the specifications from the HTML response
        Extract data from both ficha_specs_left and ficha_specs_right
        """
        print("🔍 Starting to parse specifications...")
        
        # Step 8a: Extract left specifications
        left_specs = self.extract_left_specs(response)
        print(f"📊 Extracted {len(left_specs)} left specification sections")
        
        # Step 8b: Extract right specifications  
        right_specs = self.extract_right_specs(response)
        print(f"📊 Extracted {len(right_specs)} right specification sections")
        
        # Step 8c: Combine all specifications
        all_specs = {
            'url': response.url,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'left_specs': left_specs,
            'right_specs': right_specs
        }
        
        # Step 8d: Add to our data collection
        self.specs_data.append(all_specs)
        print("✅ Specifications parsed and stored successfully")
        
        # Step 8e: Return the item for Scrapy
        return [all_specs]
    
    def extract_left_specs(self, response):
        """
        Step 9: Extract specifications from the left container
        """
        left_specs = {}
        
        # Extract from ficha_specs_left div
        left_container = response.css('div.ficha_specs_left')
        
        if left_container:
            # Extract all specification tables
            tables = left_container.css('table.content_text')
            
            for table in tables:
                # Get section title
                section_title = table.css('h2 span.spec_title_text::text').get()
                if section_title:
                    section_title = section_title.strip()
                    left_specs[section_title] = {}
                    
                    # Extract all specification rows
                    rows = table.css('tr')
                    for row in rows:
                        key_cell = row.css('td.tabletd::text').get()
                        value_cell = row.css('td.tabletd_right')
                        
                        if key_cell and value_cell:
                            key = key_cell.strip().rstrip(':')
                            # Get all text from value cell, including spans
                            value_texts = value_cell.css('::text').getall()
                            value = ' '.join([text.strip() for text in value_texts if text.strip()])
                            
                            if key and value:
                                left_specs[section_title][key] = value
        
        return left_specs
    
    def extract_right_specs(self, response):
        """
        Step 10: Extract specifications from the right container
        """
        right_specs = {}
        
        # Extract from ficha_specs_right div
        right_container = response.css('div.ficha_specs_right')
        
        if right_container:
            # Extract all specification tables
            tables = right_container.css('table.content_text')
            
            for table in tables:
                # Get section title
                section_title = table.css('h2 span.spec_title_text::text').get()
                if section_title:
                    section_title = section_title.strip()
                    right_specs[section_title] = {}
                    
                    # Extract all specification rows
                    rows = table.css('tr')
                    for row in rows:
                        key_cell = row.css('td.tabletd::text').get()
                        value_cell = row.css('td.tabletd_right')
                        
                        if key_cell and value_cell:
                            key = key_cell.strip().rstrip(':')
                            # Get all text from value cell, including spans
                            value_texts = value_cell.css('::text').getall()
                            value = ' '.join([text.strip() for text in value_texts if text.strip()])
                            
                            if key and value:
                                right_specs[section_title][key] = value
        
        return right_specs
    
    def closed(self, reason):
        """
        Step 11: Save all collected data to out.json when spider closes
        """
        print(f"🏁 Spider closing. Reason: {reason}")
        print(f"💾 Saving {len(self.specs_data)} car specifications to out.json...")
        
        try:
            with open('electric.json', 'w', encoding='utf-8') as f:
                json.dump(self.specs_data, f, indent=2, ensure_ascii=False)
            print("✅ Data successfully saved to out.json")
        except Exception as e:
            print(f"❌ Error saving data: {e}")


# Custom settings for the spider
custom_settings = {
    'ROBOTSTXT_OBEY': False,          # Disable robots.txt since we're using nodriver
    'DOWNLOAD_DELAY': 1,              # Delay between requests
    'CONCURRENT_REQUESTS': 1,         # Process one request at a time
    'TWISTED_REACTOR': 'twisted.internet.asyncioreactor.AsyncioSelectorReactor',  # Use asyncio reactor
}


if __name__ == "__main__":
    """
    Step 12: Run the spider directly (for testing)
    """
    from scrapy.crawler import CrawlerProcess
    
    print("🚀 Starting Car Specs Spider...")
    
    process = CrawlerProcess(custom_settings)
    process.crawl(CarSpecsSpider)
    process.start()