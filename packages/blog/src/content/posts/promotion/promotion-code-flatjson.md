---
title: 请使用JS完成一个JSON扁平化
date: 2023-02-25 14:57:37
permalink: /Promotion/Code/FlatJson/
category:
  - JavaScript
tag:
  - JavaScript
---

### 代码实现

```js
function expandJsonTool(data, k) {
  var jmap = {}
  var expandJson = function (jstr, mapIndex) {
    if (jstr instanceof Array) {
      for (var i in jstr) {
        expandJson(jstr[i], `${mapIndex}[${i}]`);
      }
    } else if (jstr instanceof Object) {
      for (var i in jstr) {
        // 如果mapIndex为false,null,''时，则不加初始索引
        if (!mapIndex) {
          var key = i;
        } else {
          var key = `${mapIndex}.${i}`;
        }
        // Array 是 Object 的子集，先判断是否为 Array,如果是，则不走Object的判断
        if (jstr[i] instanceof Array) {
          for (var j in jstr[i]) {
            expandJson(jstr[i][j], `${key}[${j}]`);
          }
        } else if ((jstr[i] instanceof Object)) {
          expandJson(jstr[i], key);
        } else if (typeof jstr[i] === 'string' && jstr[i].includes('{') && jstr[i].includes('}')) {
          expandJson(JSON.parse(jstr[i]), key);
        } else {
          jmap[key] = jstr[i]
        }
      }
    }
  }
  expandJson(data, k);
  return jmap
}
```

### 函数使用

```js
const expandJsonTool = (data, k) => {
  // 如上
}
const demo = {
  "Type" : "Notification",
  "MessageId" : "f0477020-1bb4-598d",
  "TopicArn" : "arn:aws:sns:us-east-2::made",
  "Subject" : "ALARM: \"made\" in US East (Ohio)",
  "Message" : "{\"AlarmName\":\"made\",\"AlarmDescription\":null,\"AWSAccountId\":\"917958955567\",\"AldatedTimestamp\":\"20230000\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Threshold.\",\"StateChangeTime\":\"2020000\",\"Region\":\"US East (Ohio)\",\"AlarmArn\":\"arn:alarm:made\",\"OldStateValue\":\"INSUFFICIENT_DATA\",\"OKActions\":[],\"AlarmActions\":[\"arnmade\"],\"InsufficientDataActions\":[],\"Trigger\":{\"MetricName\":\"NetworkTransmitThroughput\",\"Namespace\":\"AWS/RDS\",\"StatisticType\":\"Statistic\",\"Statistic\":\"AVERAGE\",\"Unit\":null,\"Dimensions\":[{\"value\":\"mysql\",\"name\":\"EngineName\"}],\"Period\":300,\"EvaluPeriods\":1,\"DatapAlarm\":1,\"Comparator\":\"Greatehreshold\",\"Thhold\":1.0,\"TreaingData\":\"missing\",\"Evaluateile\":\"\"}}",
  "Timestamp" : "2023-03-06T07:39:44.238Z",
  "SignatureVersion" : "1",
  "Signature" : "P2gIvFv4i",
  "SigningCertURL" : "h",
  "UnsubscribeURL" : "http"
}
expandJsonTool(demo)
```

### 结果输出

```
{
    "Type": "Notification",
    "MessageId": "f0477020-1bb4-598d",
    "TopicArn": "arn:aws:sns:us-east-2::made",
    "Subject": "ALARM: \"made\" in US East (Ohio)",
    "Message.AlarmName": "made",
    "Message.AlarmDescription": null,
    "Message.AWSAccountId": "917958955567",
    "Message.AldatedTimestamp": "20230000",
    "Message.NewStateValue": "ALARM",
    "Message.NewStateReason": "Threshold.",
    "Message.StateChangeTime": "2020000",
    "Message.Region": "US East (Ohio)",
    "Message.AlarmArn": "arn:alarm:made",
    "Message.OldStateValue": "INSUFFICIENT_DATA",
    "Message.Trigger.MetricName": "NetworkTransmitThroughput",
    "Message.Trigger.Namespace": "AWS/RDS",
    "Message.Trigger.StatisticType": "Statistic",
    "Message.Trigger.Statistic": "AVERAGE",
    "Message.Trigger.Unit": null,
    "Message.Trigger.Dimensions[0].value": "mysql",
    "Message.Trigger.Dimensions[0].name": "EngineName",
    "Message.Trigger.Period": 300,
    "Message.Trigger.EvaluPeriods": 1,
    "Message.Trigger.DatapAlarm": 1,
    "Message.Trigger.Comparator": "Greatehreshold",
    "Message.Trigger.Thhold": 1,
    "Message.Trigger.TreaingData": "missing",
    "Message.Trigger.Evaluateile": "",
    "Timestamp": "2023-03-06T07:39:44.238Z",
    "SignatureVersion": "1",
    "Signature": "P2gIvFv4i",
    "SigningCertURL": "h",
    "UnsubscribeURL": "http"
}
```
