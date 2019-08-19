window.requestData = {

  //==========================普通==============================
  //普通-----开户
  normal_open_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'max',
    interval: '',
    samplingAggregate: 'avg-nan'
  },
  //普通-----变更
  normal_change_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'max',
    interval: '',
    samplingAggregate: 'avg-nan'
  },
  //普通-----销户
  normal_close_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'max',
    interval: '',
    samplingAggregate: 'avg-nan'
  },

 //==========================信用==============================
  //信用-----开户
  credit_open_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },
  //信用-----变更
  credit_change_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },
  //信用-----销户
  credit_close_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },

  //===============期权=================
   //期权-----开户
   option_open_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },
  //期权-----变更
  option_change_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },
  //期权-----销户
  option_close_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },

  //==========================贵金属==============================
   //贵金属-----开户
   metal_open_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },
  //贵金属-----变更
  metal_change_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },
  //贵金属-----销户
  metal_close_account: {
    metric: 'cpu_cpu_used_pct',
    tagFilterJson: [
      {
        "filter": "JZJY",
        "groupBy": false,
        "tagk": "appsystem",
        "type": "literal_or"
      }
    ],
    aggregateType: 'sum',
    interval: '1d',
    samplingAggregate: 'sum-zero'
  },


}