import { Inject, Injectable } from '@nestjs/common';
import { InsightsDocument, InsightsEntity } from '../entity/insights.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InsightsDto } from '../dto/insights.dto';
import axios from 'axios';
import * as fs from 'fs'; // Import fs module
import * as cheerio from 'cheerio';

@Injectable()
export class InsightsService {
  private apiVersion = 'v17.0'; // Use the latest API version
  private readonly apiUrl = `https://graph.facebook.com/${this.apiVersion}`;
  private readonly libraryBaseUrl = 'https://www.facebook.com/ads/library/';

  constructor(
    @InjectModel(InsightsEntity.name)
    private readonly insightsModel: Model<InsightsDocument>,
  ) { }

  async getInsights(req, insights_dto) {
    try {
      const params = {
        ad_type: insights_dto.ad_type,
        search_terms: insights_dto.search_terms,
        ad_reached_countries: insights_dto.ad_reached_countries,
        ad_active_status: insights_dto.ad_active_status,
        limit: insights_dto.limit,
        access_token: insights_dto.access_token,
      };

      const response = (await axios.get(this.apiUrl+'/ads_archive', { params })).data;
      let data = response.data;
      let next_url = response.paging.next;

      while (next_url) {
        const next_response = (await axios.get(next_url, { params })).data;
        data.push(...next_response.data);
        next_url = next_response?.paging?.next || null;
      }

      // Add 'librarylink' to each object
      data = data.map((ad) => {
        return {
          ...ad,
          librarylink: `${this.libraryBaseUrl}?id=${ad.id}`, // Add the library link
        };
      });

      // Save the data to a JSON file
      const filePath = './ads_insights.json'; // You can change the file path/name
      await this.saveDataToFile(data, filePath);

      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  // Helper method to save the data to a file
  async saveDataToFile(data: any, filePath: string) {
    try {
      // Convert data to JSON and write it to a file
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`Data successfully saved to ${filePath}`);
    } catch (err) {
      console.error('Error saving data to file:', err);
      throw new Error('Failed to save data to file.');
    }
  }

  async getFbScrapingResult(req: string, insights_dto) {
    try {
      const fields = [
        'ad_creative_body',
        'ad_creative_link_caption',
        'ad_creative_link_description',
        'ad_creative_link_title',
        'ad_delivery_start_time',
        'ad_delivery_stop_time',
        'impressions',
        'spend',
        'demographic_distribution',
        'region_distribution',
        // Add other fields as needed
      ];

      console.log( `${this.apiUrl}/${insights_dto.adId}`)
      const response = await axios.get(
        `${this.apiUrl}/${insights_dto.adId}`,
        {
          params: {
            access_token: insights_dto.access_token,
            fields: fields.join(','),
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error)
      throw new Error('Failed to get the insights.');
    }
  }

  async scrapeTextFromEUAdAudience(url: string): Promise<string> {
    try {
      // Fetch the HTML content of the webpage
      const { data } = await axios.get(url);
      
      console.log('HTML Content:', data);
      // Load the HTML into Cheerio for parsing
      const $ = cheerio.load(data);

      // Select the div with the specified class attributes
      const text = $(`div.${"x8t9es0"}`).text();

      // Return the scraped text
      return text;
    } catch (error) {
      console.error('Error scraping the page:', error);
      throw new Error('Failed to scrape the page');
    }
  }

  async create(reqeust: any, insights_dto: InsightsDto) {
    try {
      console.log(reqeust.user);
      insights_dto.userId = reqeust.user._id;
      return await this.insightsModel.create(insights_dto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(arr) {
    return await this.insightsModel.findOne(arr).lean();
  }

  async findById(id: string) {
    return await this.insightsModel.findById(id).lean();
  }

  async findByIdAndDelete(id: string) {
    return await this.insightsModel.findByIdAndDelete(id);
  }

  async findOneAndDelete(obj: Partial<InsightsEntity>) {
    return await this.insightsModel.findOneAndDelete(obj);
  }

  async findByIdAndUpdate(id: string, obj?: Partial<InsightsEntity>) {
    return await this.insightsModel.findByIdAndUpdate(id, obj);
  }

  async findSorted(obj: Partial<InsightsEntity>, sort: string = '') {
    return await this.insightsModel
      .find(obj)
      .sort({ _id: sort == 'DESC' ? -1 : 1 });
  }

  async findAll(sort: string = '') {
    return await this.insightsModel
      .find()
      .sort({ _id: sort == 'DESC' ? -1 : 1 });
  }
}
