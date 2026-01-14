import { PerformaInvoice } from "./performa-invoice";

export interface PerformaInvoiceStatus {
    performaInvoiceId : number;
    status : string;
    date : Date
    remarks : string;
    count:string;

    performaInvoice: PerformaInvoice;
}
