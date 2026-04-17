export interface GetSummaryValidated{
  from?: Date
  to?: Date
}

export interface SummaryByCategoryItem {
  categoryId: string | null,
  amount:number,
  name:string,
}
