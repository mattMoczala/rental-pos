import { response } from "express";
import Item from "../../types/Item";
import Client from "../../types/Client";
import RentalItem from "../../types/RentalItem";

interface FetcherResponse<T> {
  ok: boolean;
  data?: T;
}

export default class Fetcher {
  static domain = "https://api.moczaladev.pl:8080";

  static getItems(): Promise<FetcherResponse<Array<Item>>> {
    return new Promise(async (resolve, reject) => {
      await fetch(`${this.domain}/item/`, {
        method: "GET",
        mode: "cors",
      }).then((response) => {
        if (response.ok) {
          response.json().then((parsedResponse) => {
            resolve({
              ok: true,
              data: parsedResponse.data,
            });
          });
        } else {
          resolve({ ok: false });
        }
      });
    });
  }

  static postClient(name: string, surname: string, pesel: string, phoneNumber: string, nip: string): Promise<FetcherResponse<undefined>> {
  
    const data = {
      name,
      surname,
      pesel,
      phoneNumber,
      nip
    }

    return new Promise(async (resolve, reject) => {
      await fetch(`${this.domain}/client/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: "cors",
      }).then((response) => {
        if (response.ok) {
          response.json().then(() => {
            resolve({
              ok: true
            });
          });
        } else {
          resolve({ ok: false });
        }
      });
    });
  }

  static postOrder(clientId:string, items: RentalItem[], priceTotal: number, endDate: Date): Promise<FetcherResponse<undefined>> {
    let rented: [{item: string; itemRealIdentifier: string}?] = [];
    items.forEach((item)=>{
      rented.push({
        item: item._id,
        itemRealIdentifier: item.itemRealIdentifier
      });
    })

    const data = {
      priceTotal,
      rented,
      ongoing: true,
      client: clientId,
      startDate: new Date(),
      endDate
    }

    return new Promise(async (resolve, reject) => {
      await fetch(`${this.domain}/rent/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: "cors",
      }).then((response) => {
        if (response.ok) {
          response.json().then(() => {
            resolve({
              ok: true
            });
          });
        } else {
          resolve({ ok: false });
        }
      });
    });
  }

  static deleteClient(id: string): Promise<FetcherResponse<undefined>> {
    return new Promise(async (resolve, reject) => {
      await fetch(`${this.domain}/client/?id=${id}`, {
        method: "DELETE",
        mode: "cors",
      }).then((response) => {
        if (response.ok) {
          response.json().then((parsedResponse) => {
            console.log("gotResponse")
            resolve({
              ok: true
            });
          });
        } else {
          resolve({ ok: false });
        }
      });
    });
  }


  static getClients(): Promise<FetcherResponse<Array<Client>>> {
    return new Promise(async (resolve, reject) => {
      await fetch(`${this.domain}/client/`, {
        method: "GET",
        mode: "cors",
      }).then((response) => {
        if (response.ok) {
          response.json().then((parsedResponse) => {
            resolve({
              ok: true,
              data: parsedResponse.data,
            });
          });
        } else {
          resolve({ ok: false });
        }
      });
    });
  }
}
