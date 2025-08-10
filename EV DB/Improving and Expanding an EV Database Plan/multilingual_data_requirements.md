# Multilingual Data Requirements for EV Database

## Core Language Requirements

### Portuguese (Portugal)
- **Primary Market**: Portugal
- **Character Set**: Latin with Portuguese-specific characters (á, à, â, ã, ç, é, ê, í, ó, ô, õ, ú)
- **Date Format**: DD-MM-YYYY
- **Number Format**: Use comma as decimal separator (e.g., 1.234,56 €)
- **Currency**: Euro (€) with symbol after the number
- **Units of Measurement**: Metric system (km, kWh, etc.)

### Spanish (Spain)
- **Primary Market**: Spain
- **Character Set**: Latin with Spanish-specific characters (á, é, í, ó, ú, ü, ñ, ¿, ¡)
- **Date Format**: DD-MM-YYYY
- **Number Format**: Use comma as decimal separator (e.g., 1.234,56 €)
- **Currency**: Euro (€) with symbol after the number
- **Units of Measurement**: Metric system (km, kWh, etc.)

### English (International)
- **Purpose**: Cross-market compatibility, international users, manufacturer data
- **Character Set**: Standard Latin
- **Date Format**: YYYY-MM-DD (ISO format for database storage)
- **Number Format**: Use period as decimal separator (e.g., €1,234.56)
- **Currency**: Euro (€) with symbol before the number
- **Units of Measurement**: Metric system with optional imperial conversion

## Database Structure Requirements

### Multilingual Field Design
1. **Core Data Fields**: Language-independent numeric and date fields
   - Vehicle ID (primary key)
   - Battery capacity (kWh)
   - Range (km)
   - Charging speed (kW)
   - Price (€)
   - Release date
   - Performance metrics (acceleration, top speed)

2. **Language-Dependent Text Fields**: Separate columns for each language
   - Model name_PT, Model name_ES, Model name_EN
   - Description_PT, Description_ES, Description_EN
   - Features_PT, Features_ES, Features_EN
   - Specifications_PT, Specifications_ES, Specifications_EN

3. **Localized Content Tables**: Separate tables for heavily localized content
   - Reviews (language-specific)
   - News articles (language-specific)
   - Regional incentives (country-specific)
   - Charging location descriptions (region-specific)

### Database Schema Considerations
- **Character Encoding**: UTF-8 for all text fields to support special characters
- **Collation**: Language-specific collation for proper sorting (e.g., pt_PT, es_ES)
- **Default Language**: System-level setting with user override capability
- **Fallback Mechanism**: Chain of language preferences (user selected → browser default → system default)
- **Translation Status Tracking**: Fields to track translation completeness and last update

## User Interface Requirements

### Language Selection
- **Persistent Language Toggle**: Easily accessible in header/footer
- **Automatic Detection**: Based on browser settings with manual override
- **Language Cookies**: Remember user language preference
- **URL Structure**: Language parameter in URL (e.g., /pt/, /es/, /en/)

### Localized UI Elements
- **Navigation Menus**: Fully translated in all three languages
- **Search Functionality**: Support for language-specific search terms and filters
- **Error Messages**: Localized error and notification messages
- **Form Labels and Placeholders**: Translated for all input fields
- **Buttons and CTAs**: Language-specific text with appropriate sizing

### Content Display
- **Dynamic Content Loading**: Load content in user's preferred language
- **Mixed Language Handling**: Protocol for displaying content when translation is unavailable
- **Date and Number Formatting**: Automatic formatting based on language context
- **Units Display**: Primary units in metric with optional toggle for imperial

## Content Management Requirements

### Translation Workflow
- **Content Creation**: Define primary language for initial content creation
- **Translation Process**: Structured workflow for translating new content
- **Quality Assurance**: Review process for translated content
- **Update Synchronization**: System to flag content needing translation when source is updated

### Terminology Management
- **Glossary**: Standardized terminology across all three languages
- **Industry-Specific Terms**: Consistent translation of EV technical terms
- **Brand Names**: Guidelines for handling manufacturer and model names
- **Abbreviations**: Standard handling of common abbreviations (e.g., BEV, PHEV)

### SEO Considerations
- **Multilingual Metadata**: Language-specific meta titles, descriptions, and keywords
- **Hreflang Tags**: Proper implementation for language/region targeting
- **URL Structure**: Consistent URL patterns across languages
- **Sitemap**: Language-specific sitemap entries

## Market-Specific Data Requirements

### Portugal-Specific Fields
- **Portuguese Incentives**: Government rebates and tax incentives
- **Regional Charging Networks**: Portugal-specific charging providers
- **Local Pricing**: Portugal-specific pricing including taxes
- **Popular Models**: Portugal market-specific popularity rankings

### Spain-Specific Fields
- **Spanish Incentives**: MOVES III program details and eligibility
- **Regional Variations**: Autonomous community-specific information
- **Local Pricing**: Spain-specific pricing including taxes
- **Popular Models**: Spain market-specific popularity rankings

### Cross-Market Fields
- **Comparative Pricing**: Standardized price comparison across markets
- **Availability**: Market availability flags for each vehicle
- **Import Information**: Cross-border purchase and import details
- **Charging Compatibility**: Cross-border charging network compatibility

## Technical Implementation Requirements

### Database Implementation
- **Indexing Strategy**: Optimize for multilingual search performance
- **Query Optimization**: Efficient retrieval of language-specific content
- **Caching Strategy**: Language-aware caching mechanisms
- **Database Sharding**: Consider geographic sharding for regional performance

### API Requirements
- **Language Parameter**: Required in all API calls
- **Response Format**: Consistent structure with language-specific fields
- **Error Handling**: Localized error messages in API responses
- **Documentation**: Multilingual API documentation

### Search Functionality
- **Language-Specific Indexing**: Separate indexes for each language
- **Cross-Language Search**: Option to search across all languages
- **Accent Sensitivity**: Proper handling of accented characters
- **Stemming and Lemmatization**: Language-specific word processing

## Data Collection and Maintenance

### Source Identification
- **Portuguese Sources**: Authoritative data sources for Portuguese market
- **Spanish Sources**: Authoritative data sources for Spanish market
- **International Sources**: Cross-market data sources in English

### Update Frequency
- **Core Vehicle Data**: Update schedule for vehicle specifications
- **Pricing Information**: Frequency of price updates by market
- **Incentive Information**: Monitoring system for government policy changes
- **Translation Updates**: Schedule for reviewing and updating translations

### Quality Control
- **Data Validation**: Language-specific validation rules
- **Translation Review**: Process for reviewing translation quality
- **Consistency Checks**: System to ensure cross-language data consistency
- **User Feedback**: Mechanism for users to report language issues
