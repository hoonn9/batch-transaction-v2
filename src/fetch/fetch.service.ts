import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
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
        return req;
      },
    );

    httpService.axiosRef.interceptors.response.use(
      (res) => {
        return res;
      },
      (res) => {
        this.responseFailed.push(res);
        return res;
      },
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig<T>) {
    return firstValueFrom(this.httpService.get<T>(url, config));
  }
}
