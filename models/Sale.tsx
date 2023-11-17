import { Client } from "./Client";
import { Product } from "./Product";

export type Sale = {
	id: number;
	billId: number;
	date: Date;
	total: number;
	details: SaleDetail[];
	clientId: string;
}

export type SaleDetail = {
	productId: number;
	quantity: number;
}