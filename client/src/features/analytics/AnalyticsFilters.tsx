type AnalyticsFiltersProps = {
  fromDateFilter: string
  setFromDateFilter: (value: string) => void
  toDateFilter: string
  setToDateFilter: (value: string) => void
  onApplyFilters: () => void
}

const AnalyticsFilters = (props: AnalyticsFiltersProps) => {
  const {
    fromDateFilter,
    setFromDateFilter,
    toDateFilter,
    setToDateFilter,
    onApplyFilters,
  } = props

  return (
    <section>
      <h2>Filters</h2>

      <div>
        <div>
          <label>From</label>
          <input
            type="date"
            value={fromDateFilter}
            onChange={(e) => setFromDateFilter(e.target.value)}
          />
        </div>

        <div>
          <label>To</label>
          <input
            type="date"
            value={toDateFilter}
            onChange={(e) => setToDateFilter(e.target.value)}
          />
        </div>
        <button onClick={onApplyFilters}>Apply filters</button>
      </div>
    </section>
  )
}
export default AnalyticsFilters
