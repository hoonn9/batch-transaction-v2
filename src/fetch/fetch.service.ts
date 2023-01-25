import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, isAxiosError } from 'axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetchService {
  public requestFailed: AxiosRequestConfig[] = [];
  public responseFailed: AxiosRequestConfig[] = [];

  constructor(private readonly httpService: HttpService) {
    httpService.axiosRef.interceptors.request.use(
      (req) => {
        return req;
      },
      (req) => {
        this.requestFailed.push(req);
        return Promise.reject(req);
      },
    );

    httpService.axiosRef.interceptors.response.use(
      (res) => {
        return res;
      },
      (res) => {
        this.responseFailed.push(res);
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
}
