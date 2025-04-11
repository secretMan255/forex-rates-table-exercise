import { AxiosClient } from './axios'

export class CallApi {
     private static Instance: CallApi

     private constructor() {}

     public static getInstance(): CallApi {
          if (!this.Instance) {
               this.Instance = new CallApi()
          }

          return this.Instance
     }

     public static async getForeignCurrency() {
          return await AxiosClient.getInstance().get('/latest')
     }
}
