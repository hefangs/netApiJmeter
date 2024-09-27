/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.88898910705613, "KoPercent": 0.11101089294387012};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6131617289946576, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.20702341137123745, 500, 1500, "获取用户歌单"], "isController": false}, {"data": [0.9799426934097422, 500, 1500, "云贝账户信息 "], "isController": false}, {"data": [0.0017593244194229415, 500, 1500, "获取用户动态"], "isController": false}, {"data": [1.0, 500, 1500, "登录"], "isController": false}, {"data": [0.0017844396859386152, 500, 1500, "获取每日推荐歌曲"], "isController": false}, {"data": [0.994314381270903, 500, 1500, "获取用户历史评论"], "isController": false}, {"data": [0.9903074866310161, 500, 1500, "获取账号信息 "], "isController": false}, {"data": [0.09419770773638969, 500, 1500, "电台 - 分类"], "isController": false}, {"data": [0.8278169014084507, 500, 1500, "vip 成长值"], "isController": false}, {"data": [0.9949856733524355, 500, 1500, "通知 - 私信"], "isController": false}, {"data": [0.9959893048128342, 500, 1500, "获取用户信息"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14413, 16, 0.11101089294387012, 8265.178727537588, 5, 489417, 214.0, 30753.60000000001, 50969.19999999995, 88427.36000000036, 11.516313245637935, 392.99245569069916, 41.450295654605284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["获取用户歌单", 1495, 0, 0.0, 4379.741137123747, 15, 60337, 2753.0, 9988.600000000002, 14422.600000000006, 24474.91999999997, 1.1958880648771275, 25.033240482440846, 4.322318868453912], "isController": false}, {"data": ["云贝账户信息 ", 1396, 0, 0.0, 104.3932664756446, 5, 6619, 8.0, 216.0, 421.0, 1661.12, 1.1195711625415228, 1.1874673441702903, 4.0300188526641145], "isController": false}, {"data": ["获取用户动态", 1421, 5, 0.3518648838845883, 55917.99225897254, 331, 489417, 49515.0, 86624.99999999999, 100979.49999999999, 159416.55999999997, 1.136022052098723, 257.41814817712833, 4.081119311995145], "isController": false}, {"data": ["登录", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 22.336725603070175, 0.4968475877192982], "isController": false}, {"data": ["获取每日推荐歌曲", 1401, 6, 0.4282655246252677, 16558.693790149922, 54, 182207, 12826.0, 31196.399999999994, 40670.79999999999, 65723.90000000002, 1.1214306926215303, 74.41791357209294, 4.023786414979784], "isController": false}, {"data": ["获取用户历史评论", 1495, 1, 0.06688963210702341, 44.14581939799333, 5, 2673, 9.0, 213.0, 220.0, 563.119999999999, 1.1960688935682695, 0.7152833878231385, 4.3241404767414595], "isController": false}, {"data": ["获取账号信息 ", 1496, 2, 0.13368983957219252, 66.44050802139033, 5, 6609, 8.0, 214.0, 232.99999999999727, 836.03, 1.1973019089602361, 0.9791057536319224, 4.302880329934308], "isController": false}, {"data": ["电台 - 分类", 1396, 2, 0.14326647564469913, 6240.877507163319, 37, 121912, 4230.5, 13387.099999999999, 19313.59999999998, 33281.45999999999, 1.1190649875347705, 28.101601078082037, 4.025311292556133], "isController": false}, {"data": ["vip 成长值", 1420, 0, 0.0, 543.8323943661971, 6, 12626, 237.0, 1483.0, 2144.750000000001, 6627.609999999998, 1.1356447703158452, 4.193341447795129, 4.086912238851687], "isController": false}, {"data": ["通知 - 私信", 1396, 0, 0.0, 42.177650429799414, 6, 1617, 11.0, 164.89999999999986, 221.0, 461.98999999999637, 1.1194032842779167, 0.5849509870154029, 4.029414556492579], "isController": false}, {"data": ["获取用户信息", 1496, 0, 0.0, 43.544117647058854, 5, 3749, 8.0, 213.0, 215.0, 423.0, 1.197470583526775, 0.7579345996257905, 4.304655919815096], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 210,755)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["502/Bad Gateway", 4, 25.0, 0.02775272323596753], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 220,751)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,741; received: 23,815)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 215,039)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,754; received: 18,104)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,747; received: 53,803)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 206,470)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,747; received: 19,532)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 25,239; received: 3,824)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,747; received: 28,100)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 233,603; received: 226,462)", 1, 6.25, 0.0069381808089918826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,760; received: 56,659)", 1, 6.25, 0.0069381808089918826], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14413, 16, "502/Bad Gateway", 4, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 210,755)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 220,751)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,741; received: 23,815)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 215,039)", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["获取用户动态", 1421, 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 210,755)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 206,470)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 220,751)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 233,603; received: 226,462)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 231,411; received: 215,039)", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["获取每日推荐歌曲", 1401, 6, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,747; received: 19,532)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,747; received: 28,100)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,741; received: 23,815)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,754; received: 18,104)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 67,747; received: 53,803)", 1], "isController": false}, {"data": ["获取用户历史评论", 1495, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取账号信息 ", 1496, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["电台 - 分类", 1396, 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 25,239; received: 3,824)", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
