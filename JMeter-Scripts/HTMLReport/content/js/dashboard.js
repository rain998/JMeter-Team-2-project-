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

    var data = {"OkPercent": 99.77168949771689, "KoPercent": 0.228310502283105};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9877049180327869, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Mark Todo as Complete"], "isController": false}, {"data": [0.97, 500, 1500, "Redirect to Dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "Mark Subtask as Complete"], "isController": false}, {"data": [0.9746835443037974, 500, 1500, "Create Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete subtask"], "isController": false}, {"data": [1.0, 500, 1500, "Transaction Controller - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Get Todo Data"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Create Subtask"], "isController": false}, {"data": [0.96875, 500, 1500, "Log in"], "isController": false}, {"data": [0.85, 500, 1500, "Transaction Controller - Create Todo"], "isController": true}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Transaction Controller - Create Subtask"], "isController": true}, {"data": [1.0, 500, 1500, "Register User"], "isController": false}, {"data": [1.0, 500, 1500, "Log in attempt"], "isController": false}, {"data": [0.975, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Transaction Controller - Register"], "isController": true}, {"data": [1.0, 500, 1500, "Log out"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Transaction Controller - Edit Subtask"], "isController": true}, {"data": [0.9875, 500, 1500, "Navigate to Dashboard"], "isController": false}, {"data": [0.925, 500, 1500, "Transaction Controller - Edit Todo"], "isController": true}, {"data": [1.0, 500, 1500, "Change Todo Name"], "isController": false}, {"data": [1.0, 500, 1500, "Navigate to Login"], "isController": false}, {"data": [1.0, 500, 1500, "Redirect to Login"], "isController": false}, {"data": [1.0, 500, 1500, "Navigate to Registration"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 876, 2, 0.228310502283105, 19.889269406392703, 2, 628, 7.0, 43.0, 51.0, 470.4500000000021, 5.16698321320294, 4.389963459519399, 2.918484029022992], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Mark Todo as Complete", 10, 0, 0.0, 26.299999999999997, 16, 47, 19.5, 46.9, 47.0, 47.0, 0.33875338753387535, 0.1425146087398374, 0.22455644478319783], "isController": false}, {"data": ["Redirect to Dashboard", 50, 0, 0.0, 54.69999999999999, 4, 628, 7.0, 97.39999999999998, 581.7499999999999, 628.0, 2.7487630566245187, 4.815704026937878, 1.7877697223749311], "isController": false}, {"data": ["Mark Subtask as Complete", 15, 0, 0.0, 26.0, 16, 53, 19.0, 51.2, 53.0, 53.0, 0.8673528391349601, 0.34372244347750663, 0.5800422111715046], "isController": false}, {"data": ["Create Todo", 79, 2, 2.5316455696202533, 34.67088607594937, 12, 79, 42.0, 58.0, 59.0, 79.0, 0.5573900036688962, 0.231717585831005, 0.36252123285496574], "isController": false}, {"data": ["Delete subtask", 11, 0, 0.0, 29.272727272727273, 14, 58, 20.0, 56.00000000000001, 58.0, 58.0, 0.6370533387386345, 0.16921729310244976, 0.3967444221636648], "isController": false}, {"data": ["Transaction Controller - Login", 20, 0, 0.0, 57.4, 29, 264, 38.5, 146.10000000000016, 258.4999999999999, 264.0, 1.054073995994519, 6.242763534968905, 3.542985631653842], "isController": true}, {"data": ["Get Todo Data", 237, 0, 0.0, 9.518987341772153, 4, 89, 7.0, 13.0, 17.0, 76.0, 1.550255759494499, 1.0253146095252423, 0.8725298931173878], "isController": false}, {"data": ["Logout", 60, 0, 0.0, 4.166666666666666, 2, 17, 4.0, 5.0, 15.449999999999953, 17.0, 0.40989486196790526, 0.15090855757998076, 0.2535157023890039], "isController": false}, {"data": ["Create Subtask", 15, 0, 0.0, 45.333333333333336, 15, 199, 29.0, 120.40000000000005, 199.0, 199.0, 0.8676036786395974, 0.3456858407079646, 0.582073952368558], "isController": false}, {"data": ["Log in", 32, 0, 0.0, 44.90625000000001, 5, 603, 8.0, 16.899999999999995, 586.75, 603.0, 1.2931905435441502, 0.6541725601131542, 0.6620655688017781], "isController": false}, {"data": ["Transaction Controller - Create Todo", 20, 2, 10.0, 293.5, 59, 1476, 137.0, 789.0000000000002, 1442.2999999999995, 1476.0, 1.0502546867615397, 11.357160849787324, 8.462447651367958], "isController": true}, {"data": ["Delete Todo", 4, 0, 0.0, 54.25, 50, 65, 51.0, 65.0, 65.0, 65.0, 0.21385799828913601, 0.05680603079555175, 0.13282586612489305], "isController": false}, {"data": ["Transaction Controller - Create Subtask", 15, 0, 0.0, 189.4, 56, 1493, 80.0, 741.8000000000004, 1493.0, 1493.0, 0.8017103153393907, 5.50940965726884, 3.6233548236237305], "isController": true}, {"data": ["Register User", 10, 0, 0.0, 31.4, 14, 132, 18.0, 123.60000000000002, 132.0, 132.0, 0.5655468838366701, 0.1607169367153037, 0.3103880358556725], "isController": false}, {"data": ["Log in attempt", 20, 0, 0.0, 8.149999999999999, 6, 11, 8.0, 10.0, 10.95, 11.0, 1.138627953316254, 0.5507445559350982, 0.5872162325647594], "isController": false}, {"data": ["Login", 40, 0, 0.0, 36.775000000000006, 6, 583, 8.0, 11.0, 544.0499999999976, 583.0, 2.134927412467976, 1.0799730465414175, 1.0716334863364645], "isController": false}, {"data": ["Transaction Controller - Register", 10, 0, 0.0, 69.6, 28, 347, 36.0, 318.80000000000007, 347.0, 347.0, 0.5548773721007657, 2.448179655421152, 1.1016266576961493], "isController": true}, {"data": ["Log out", 30, 0, 0.0, 3.4, 2, 5, 3.0, 4.0, 5.0, 5.0, 1.3165401325317068, 0.4847027636371616, 0.8125521130469128], "isController": false}, {"data": ["Transaction Controller - Edit Subtask", 15, 0, 0.0, 199.86666666666665, 53, 1526, 98.0, 725.6000000000005, 1526.0, 1526.0, 0.7984244424335978, 6.403509574439773, 4.3007839529994145], "isController": true}, {"data": ["Navigate to Dashboard", 40, 0, 0.0, 36.09999999999997, 4, 559, 6.0, 38.39999999999999, 419.09999999999866, 559.0, 1.6570694726376403, 2.903108040929616, 1.079360681884088], "isController": false}, {"data": ["Transaction Controller - Edit Todo", 20, 0, 0.0, 193.49999999999994, 32, 1507, 95.0, 541.3000000000009, 1460.7499999999993, 1507.0, 1.0485477613505294, 7.446583454571668, 5.136501667846282], "isController": true}, {"data": ["Change Todo Name", 13, 0, 0.0, 32.61538461538461, 15, 53, 23.0, 51.8, 53.0, 53.0, 0.7613915895513647, 0.3174943444711257, 0.4885100335305142], "isController": false}, {"data": ["Navigate to Login", 150, 0, 0.0, 13.266666666666666, 2, 204, 5.0, 9.0, 12.899999999999977, 204.0, 0.8847573995210514, 1.2251816333211432, 0.4070690457301608], "isController": false}, {"data": ["Redirect to Login", 50, 0, 0.0, 3.3000000000000003, 2, 11, 3.0, 4.0, 4.449999999999996, 11.0, 1.8255504034466392, 2.4816075796852752, 0.9209759164263025], "isController": false}, {"data": ["Navigate to Registration", 10, 0, 0.0, 6.1, 4, 15, 5.0, 14.100000000000003, 15.0, 15.0, 0.5648121999435188, 0.7744104772663091, 0.2779935046597007], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 2, 100.0, 0.228310502283105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 876, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Todo", 79, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
