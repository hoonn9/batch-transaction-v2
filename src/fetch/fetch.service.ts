import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, isAxiosError, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { FetchStatisticService } from './fetch-statistic.service';

@Injectable()
export class FetchService {
  public requestFailed: AxiosRequestConfig[] = [];
  public responseFailed: AxiosRequestConfig[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly fetchStatisticService: FetchStatisticService,
  ) {
    httpService.axiosRef.interceptors.request.use(
      (req) => {
        this.fetchStatisticService.apiRequestCount.total++;
        return req;
      },
      (req) => {
        this.requestFailed.push(req);
        this.fetchStatisticService.apiRequestCount.failed++;
        return Promise.reject(req);
      },
    );

    httpService.axiosRef.interceptors.response.use(
      (res) => {
        this.fetchStatisticService.apiRequestCount.succeeded++;
        return res;
      },
      (res) => {
        this.responseFailed.push(res);
        this.fetchStatisticService.apiRequestCount.failed++;
        return Promise.reject(res);
      },
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig<T>, retry = 0) {
    try {
      return firstValueFrom(this.httpService.get<T>(url, config));
    } catch (e) {
      if (isAxiosError(e) && retry > 0) {
        return this.get(url, config, retry--);
      }
      throw e;
    }
  }

  post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig<T>,
    retry = 0,
  ): Promise<AxiosResponse<T>> {
    try {
      return firstValueFrom(this.httpService.post<T>(url, data, config));
    } catch (e) {
      if (isAxiosError(e) && retry > 0) {
        return this.post(url, data, config, retry--);
      }
      throw e;
    }
  }
}
