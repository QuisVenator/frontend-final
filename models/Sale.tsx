export type Sale = {
	id: number;
	billId: number;
	total: number;
	details: SaleDetail[];
}

export type SaleDetail = {
	productId: number;
	quantity: number;
}