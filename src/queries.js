const SUB_TABLE_STREAM_FULL = `
subscription SubTableSream {
  queryTableLog {
    action
    on_table
    tstamp
    what {
      actype
      id
      locator
      meta
      published
      title
      author {
        name
        surname
        aka
      }
      institution {
        short
        name
      }
    }
  }
}
`

const SUB_TABLE_STREAM_LAST = `
subscription SubTableSream {
  queryTableLog(first: 10, order: {desc: tstamp}) {
    action
    on_table
    tstamp
    what {
      actype
      id
      locator
      meta
      published
      title
      author {
        name
        surname
        aka
      }
      institution {
        short
        name
      }
    }
  }
}`

export { SUB_TABLE_STREAM_LAST, SUB_TABLE_STREAM_FULL }
