// if we have any common header.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MyodisApiHeader {}
export interface HTTPRequestParam {
    // eslint-disable-next-line @typescript-eslint/ban-types
    body?: any
    header?: MyodisApiHeader
  }

  export interface HTTPRequestOption {
    body?: any
    header?: MyodisApiHeader
  }